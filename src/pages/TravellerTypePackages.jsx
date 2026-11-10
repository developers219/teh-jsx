import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PackageCard from "../components/packages/PackageCard";
import api from "../services/api";
import {
  getPackagesByTravellerType,
  getTravellerTypes,
} from "../services/traveller-type.service";

// Image na ho ya link toot jaye to ye dikhegi.
// Apni site ka DEFAULT_IMAGE (jo TravelCategories / Themes me use hota hai) yahan daal sakti ho.
const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

// Background refresh interval (backend me image change ho to khud update ho jaye)
const REFRESH_MS = 60_000;

// Hero height model (same as the other page heroes / the home hero):
//  - below lg (phones / tablets): the hero is as tall as the image itself
//    (its real width / height ratio), so the WHOLE image is shown and the text
//    sits on top of it. min-h-[16rem] keeps room for the text.
//  - lg and up (desktop): fixed banner, same size as the About Us hero:
//    70vh, max 24.5rem (392px). The image covers it (object-cover).
const MIN_RATIO = 0.8;
const MAX_RATIO = 2.4;
const DEFAULT_RATIO = 16 / 9;
const HERO_SIZE =
  "aspect-(--hero-ratio) min-h-[16rem] lg:aspect-auto lg:h-[70vh] lg:max-h-98 lg:min-h-[21rem]";

/* Fluid sizes: they scale smoothly with the screen width (same idea as ExploreByPeople) */
const GAP = "clamp(1rem,2vw,1.5rem)"; // gap between package cards
const SIDE_PADDING = "clamp(1rem,4vw,2rem)"; // left / right padding

// Backend traveller type object se naam nikalo (ExploreByPeople jaisi hi logic)
function getTypeName(type, slug) {
  const name =
    type?.travellerTypeName ||
    type?.traveller_type_name ||
    type?.name ||
    type?.title ||
    type?.typeName;

  if (typeof name === "string" && name.trim()) return name.trim();
  return slug ? slug.replace(/-/g, " ") : "";
}

/* ---------- Image resolve: sab formats, sab field names ---------- */

// Jin field names me image hone ki ummeed hai
const IMAGE_KEYS = [
  "imageUrl",
  "image_url",
  "imageURL",
  "image",
  "images",
  "img",
  "imgUrl",
  "img_url",
  "imagePath",
  "image_path",
  "thumbnail",
  "thumbnailUrl",
  "thumbnail_url",
  "photo",
  "photoUrl",
  "picture",
  "coverImage",
  "cover_image",
  "coverImageUrl",
  "banner",
  "bannerImage",
  "banner_image",
  "heroImage",
  "hero_image",
  "icon",
];

// Field ka naam image jaisa ho to bina extension wala URL bhi chalega (CDN / cloud storage)
const IMAGE_KEY_HINT = /image|img|photo|picture|thumb|cover|banner|hero/i;

// Saare common image formats
const IMAGE_FILE =
  /\.(png|jpe?g|jfif|pjpeg|pjp|webp|avif|gif|svg|bmp|ico|tiff?|heic|heif)(\?.*)?(#.*)?$/i;

// image can be "url", { url }, or [url], [{ imageUrl }]
function toUrl(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = toUrl(item);
      if (url) return url;
    }
    return "";
  }

  if (value && typeof value === "object") {
    return toUrl(
      value.url ||
        value.imageUrl ||
        value.image_url ||
        value.secure_url ||
        value.src ||
        value.path ||
        value.location ||
        value.fileUrl ||
        value.file_url,
    );
  }

  if (typeof value !== "string") return "";

  // "uploads\a.jpg" -> "uploads/a.jpg", naam me space ho to %20
  return value.trim().replace(/\\/g, "/").replace(/ /g, "%20");
}

// "/uploads/a.jpg" -> "https://<cms-domain>/uploads/a.jpg"
function toAbsoluteUrl(url) {
  if (
    !url ||
    /^(https?:)?\/\//i.test(url) ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  try {
    return new URL(url, new URL(api.defaults.baseURL).origin).href;
  } catch {
    return url;
  }
}

function getTypeBackendImage(type) {
  if (!type || typeof type !== "object") return "";

  // 1) Known field names
  for (const key of IMAGE_KEYS) {
    const url = toUrl(type[key]);
    if (url) return toAbsoluteUrl(url);
  }

  // 2) Koi bhi field jo image jaisa dikhe (extension ya base64) ya jiska naam image jaisa ho
  for (const [key, value] of Object.entries(type)) {
    const url = toUrl(value);
    if (!url) continue;

    if (url.startsWith("data:image/") || IMAGE_FILE.test(url)) {
      return toAbsoluteUrl(url);
    }

    if (IMAGE_KEY_HINT.test(key) && /^(https?:)?\/\/|^\//i.test(url)) {
      return toAbsoluteUrl(url);
    }
  }

  return "";
}

// Image URL me _t param: backend me image badle to browser purani cached na dikhaye
function withCacheBust(url, stamp) {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;

  try {
    const parsed = new URL(url);

    // Signed URLs (S3 etc.) me extra param signature tod deta hai
    if (/signature|x-amz|x-goog|token|expires/i.test(parsed.search)) return url;

    parsed.searchParams.set("_t", String(stamp));
    return parsed.href;
  } catch {
    return url;
  }
}

function getTypeFromState(location, slug) {
  const stateType = location.state?.type;
  return stateType && stateType.slug === slug ? stateType : null;
}

// Error ki asli wajah (status code + backend message) nikalo
function getErrorDetails(error) {
  const status = error?.response?.status;
  const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.response?.data === "string" ? error.response.data : "");

  return {
    status,
    url: error?.config?.url,
    message: backendMessage || error?.message || "Unknown error",
  };
}

function TravellerTypePackages() {
  const { slug } = useParams();
  const location = useLocation();

  // Home page se card click par type aa jaye to hero turant dikh jayega
  const [type, setType] = useState(() => getTypeFromState(location, slug));
  const [typeStamp, setTypeStamp] = useState(() => Date.now());
  const [failedImage, setFailedImage] = useState("");
  const [imageRatio, setImageRatio] = useState(null); // width / height of the hero image
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Hero: type badalte hi turant naya naam/image + background me latest data
  useEffect(() => {
    let cancelled = false;

    setType(getTypeFromState(location, slug));
    setTypeStamp(Date.now());

    async function loadType({ silent = false } = {}) {
      try {
        const types = await getTravellerTypes({ fresh: true });
        if (cancelled) return;

        const found = Array.isArray(types)
          ? types.find((item) => item.slug === slug)
          : null;

        if (!found) return;

        setType(found);
        setTypeStamp(Date.now());

        if (!silent && !getTypeBackendImage(found)) {
          console.warn(
            `Traveller type "${slug}" has NO image from CMS:`,
            found,
          );
        }
      } catch (error) {
        if (!silent) console.error("Failed to load traveller types:", error);
      }
    }

    loadType();

    // Admin panel me image badalke wapas aate hi latest le aao
    const refresh = () => {
      if (document.visibilityState === "visible") loadType({ silent: true });
    };

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    const intervalId = setInterval(refresh, REFRESH_MS);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Packages: hero se alag load hota hai
  useEffect(() => {
    let cancelled = false;

    async function fetchTypePackages() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setErrorDetails(null);
        setPackages([]);

        const list = await getPackagesByTravellerType(slug);

        if (cancelled) return;
        setPackages(Array.isArray(list) ? list : []);
      } catch (error) {
        if (cancelled) return;

        const details = getErrorDetails(error);

        // Console mein poori detail: kaun si URL, kaun sa status, backend ka jawab
        console.error(
          `Failed to load packages for traveller type "${slug}":`,
          {
            status: details.status,
            url: details.url,
            message: details.message,
            response: error?.response?.data,
          },
          error,
        );

        setErrorDetails(details);
        setErrorMessage(
          "We could not load packages right now. Please try again later.",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchTypePackages();

    return () => {
      cancelled = true;
    };
  }, [slug, retryCount]);

  const handleRetry = useCallback(
    () => setRetryCount((count) => count + 1),
    [],
  );

  const typeName = getTypeName(type, slug);

  // Backend image (cache-bust ke saath). Link toot jaye ya image na ho to fallback.
  const backendImage = withCacheBust(getTypeBackendImage(type), typeStamp);
  const heroImage =
    backendImage && failedImage !== backendImage
      ? backendImage
      : DEFAULT_HERO_IMAGE;

  // Phones / tablets: hero height = ratio of the hero image (whole image shown)
  const ratio = Math.min(
    Math.max(imageRatio || DEFAULT_RATIO, MIN_RATIO),
    MAX_RATIO,
  );

  return (
    <main className="bg-slate-50 font-mont">
      {/* Header: phones / tablets = the image's own ratio (whole image),
          desktop = banner (70vh, max 392px). The fixed navbar sits on the image. */}
      <section
        style={{ "--hero-ratio": ratio }}
        className={`relative w-full overflow-hidden bg-slate-950 text-white ${HERO_SIZE}`}
      >
        {/* Traveller type image as hero background */}
        <img
          key={heroImage}
          src={heroImage}
          alt=""
          aria-hidden="true"
          draggable={false}
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (naturalWidth && naturalHeight) {
              setImageRatio(naturalWidth / naturalHeight);
            }
          }}
          onError={() => {
            if (heroImage === backendImage) {
              console.warn("Traveller type image could not be loaded:", heroImage);
              setFailedImage(backendImage);
            }
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay so text stays readable (stronger at the bottom, a bit at the top for the navbar) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/55" />

        {/* Hero content: INSIDE the image, bottom aligned (below the navbar) */}
        <div
          style={{ paddingInline: SIDE_PADDING }}
          className="absolute inset-x-0 bottom-0 top-20 z-10 lg:top-24"
        >
          <div
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}
            className="mx-auto flex h-full max-w-7xl flex-col justify-end pb-[clamp(1.5rem,3vw,2.25rem)]"
          >
            {/* Title: fluid size, 24px (small phones) -> 48px (large screens) */}
            <h1 className="line-clamp-2 min-h-[1.25em] max-w-3xl font-eb text-[clamp(1.5rem,5vw,3rem)] font-bold capitalize leading-tight">
              {typeName}
            </h1>

            {/* Package count (space is reserved, so the title does not jump) */}
            <div className="mt-[clamp(0.5rem,1vw,0.75rem)] min-h-10 sm:min-h-7 lg:min-h-8">
              {!isLoading && !errorMessage && (
                <p className="line-clamp-2 max-w-2xl text-[clamp(0.875rem,2.2vw,1.125rem)] leading-[1.6] text-slate-200">
                  {packages.length > 0
                    ? `${packages.length} handpicked ${
                        packages.length === 1 ? "package" : "packages"
                      } for your next ${typeName.toLowerCase()} trip.`
                    : "Handpicked holiday packages for this traveller type."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section
        style={{ paddingInline: SIDE_PADDING }}
        className="pb-[clamp(2.5rem,6vw,4rem)] pt-[clamp(1.5rem,4vw,2.5rem)]"
      >
        <div className="mx-auto max-w-7xl">
          {/* Loading spinner */}
          {isLoading && (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-[320px] flex-col items-center justify-center gap-4"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
              <p className="text-[clamp(0.8125rem,1.8vw,0.875rem)] font-medium text-slate-500">
                Loading packages…
              </p>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 p-[clamp(1.25rem,4vw,2rem)] text-center text-[clamp(0.875rem,2vw,1rem)] text-red-700">
              <p>{errorMessage}</p>

              {/* Sirf development mein: asli error dikhao */}
              {import.meta.env.DEV && errorDetails && (
                <p className="mt-3 break-words font-mono text-[clamp(0.6875rem,1.6vw,0.75rem)] text-red-500">
                  {errorDetails.status ? `HTTP ${errorDetails.status} · ` : ""}
                  {errorDetails.message}
                  {errorDetails.url ? ` · ${errorDetails.url}` : ""}
                </p>
              )}

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 cursor-pointer rounded-full bg-gray-900 px-[clamp(1rem,3vw,1.5rem)] py-2 text-[clamp(0.8125rem,1.8vw,0.875rem)] font-semibold text-white transition hover:bg-black"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && packages.length === 0 && (
            <div className="rounded-md border border-slate-200 bg-white p-[clamp(1.25rem,4vw,2rem)] text-center text-[clamp(0.875rem,2vw,1rem)] text-slate-600">
              <p>No packages found for this traveller type yet.</p>
              <Link
                to="/packages"
                className="mt-4 inline-block rounded-full bg-gray-900 px-[clamp(1rem,3vw,1.5rem)] py-2 text-[clamp(0.8125rem,1.8vw,0.875rem)] font-semibold text-white transition hover:bg-black"
              >
                Browse all packages
              </Link>
            </div>
          )}

          {!isLoading && !errorMessage && packages.length > 0 && (
            <div
              style={{ gap: GAP }}
              className="grid md:grid-cols-2 lg:grid-cols-3"
            >
              {packages.map((travelPackage) => (
                <PackageCard
                  key={travelPackage.id ?? travelPackage.slug}
                  travelPackage={travelPackage}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default TravellerTypePackages;