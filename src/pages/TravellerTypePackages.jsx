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

  return (
    <main className="bg-slate-50 font-mont">
      {/* Header (top padding clears the fixed navbar) */}
      <section className="relative overflow-hidden bg-slate-950 px-6 pb-8 pt-44 text-white lg:px-8">
        {/* Traveller type image as hero background */}
        <img
          key={heroImage}
          src={heroImage}
          alt=""
          aria-hidden="true"
          draggable={false}
          onError={() => {
            if (heroImage === backendImage) {
              console.warn("Traveller type image could not be loaded:", heroImage);
              setFailedImage(backendImage);
            }
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/60" />

        <div className="relative mx-auto max-w-7xl">
          {/* Selected traveller type ka naam */}
          <h1 className="mt-4 min-h-[1.25em] max-w-3xl font-cg text-4xl font-bold capitalize sm:text-5xl">
            {typeName}
          </h1>

          {/* Package count */}
          {!isLoading && !errorMessage && (
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
              {packages.length > 0
                ? `${packages.length} handpicked ${
                    packages.length === 1 ? "package" : "packages"
                  } for your next ${typeName.toLowerCase()} trip.`
                : "Handpicked holiday packages for this traveller type."}
            </p>
          )}
        </div>
      </section>

      {/* Packages */}
      <section className="px-6 pb-16 pt-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Loading spinner */}
          {isLoading && (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-[320px] flex-col items-center justify-center gap-4"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
              <p className="text-sm font-medium text-slate-500">
                Loading packages…
              </p>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center text-red-700">
              <p>{errorMessage}</p>

              {/* Sirf development mein: asli error dikhao */}
              {import.meta.env.DEV && errorDetails && (
                <p className="mt-3 break-words font-mono text-xs text-red-500">
                  {errorDetails.status ? `HTTP ${errorDetails.status} · ` : ""}
                  {errorDetails.message}
                  {errorDetails.url ? ` · ${errorDetails.url}` : ""}
                </p>
              )}

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 cursor-pointer rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && packages.length === 0 && (
            <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-slate-600">
              <p>No packages found for this traveller type yet.</p>
              <Link
                to="/packages"
                className="mt-4 inline-block rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Browse all packages
              </Link>
            </div>
          )}

          {!isLoading && !errorMessage && packages.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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