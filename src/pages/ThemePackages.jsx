import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PackageCard from "../components/packages/PackageCard";
import api from "../services/api";
import { getPackagesByTheme } from "../services/theme.service";

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

// Backend theme object se image nikalo (HomeThemes jaisi hi logic)
function getThemeBackendImage(theme) {
  const img =
    theme?.imageUrl ||
    theme?.image_url ||
    theme?.image ||
    theme?.thumbnail ||
    theme?.images?.[0]?.imageUrl ||
    theme?.images?.[0]?.url;

  return typeof img === "string" && img.trim() ? img : null;
}

function ThemePackages() {
  const { themeId } = useParams();
  const location = useLocation();

  // Home page se card click par theme aa jaye to hero turant dikh jayega
  const [theme, setTheme] = useState(location.state?.theme ?? null);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageRatio, setImageRatio] = useState(null); // width / height of the hero image

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function fetchThemePackages() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [themesRes, packageList] = await Promise.all([
          api.get("/themes", { signal: controller.signal }),
          getPackagesByTheme(themeId, { signal: controller.signal }),
        ]);

        if (cancelled) return;

        const themes = themesRes.data?.data;
        setTheme(
          Array.isArray(themes)
            ? themes.find((item) => String(item.id) === String(themeId)) ||
                null
            : null,
        );
        setPackages(packageList);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load theme packages:", error);
        setErrorMessage(
          "We could not load these packages right now. Please try again later.",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchThemePackages();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [themeId]);

  const themeName = theme?.name || "Theme";
  const heroImage = getThemeBackendImage(theme);

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
        {/* Backend theme image as hero background */}
        {heroImage && (
          <img
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
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

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
            {/* <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Explore by theme
            </p> */}

            {/* Title: fluid size, 24px (small phones) -> 48px (large screens) */}
            <h1 className="line-clamp-2 min-h-[1.25em] max-w-3xl font-eb text-[clamp(1.5rem,5vw,3rem)] font-bold capitalize leading-tight">
              {isLoading && !theme ? "" : themeName}
            </h1>

            {/* Package count (space is reserved, so the title does not jump) */}
            <div className="mt-[clamp(0.5rem,1vw,0.75rem)] min-h-10 sm:min-h-7 lg:min-h-8">
              {!isLoading && !errorMessage && (
                <p className="line-clamp-2 max-w-2xl text-[clamp(0.875rem,2.2vw,1.125rem)] leading-[1.6] text-slate-200">
                  {packages.length > 0
                    ? `${packages.length} handpicked ${
                        packages.length === 1 ? "package" : "packages"
                      } for your next ${themeName.toLowerCase()} trip.`
                    : "Handpicked holiday packages for this theme."}
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
              className="flex min-h-[444px] flex-col items-center justify-center gap-4"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
              <p className="text-[clamp(0.8125rem,1.8vw,0.875rem)] font-medium text-slate-500">
                Loading packages…
              </p>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 p-[clamp(1.25rem,4vw,2rem)] text-center text-[clamp(0.875rem,2vw,1rem)] text-red-700">
              {errorMessage}
            </div>
          )}

          {!isLoading && !errorMessage && packages.length === 0 && (
            <div className="rounded-md border border-slate-200 bg-white p-[clamp(1.25rem,4vw,2rem)] text-center text-[clamp(0.875rem,2vw,1rem)] text-slate-600">
              <p>No packages are available for this theme yet.</p>
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

export default ThemePackages;