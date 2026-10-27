import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PackageCard from "../components/packages/PackageCard";
import api from "../services/api";
import { getPackagesByTheme } from "../services/theme.service";

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

  return (
    <main className="bg-slate-50 font-mont">
      {/* Header (top padding clears the fixed navbar) */}
      <section className="relative overflow-hidden bg-slate-950 px-6 pb-8 pt-44 text-white lg:px-8">
        {/* Backend theme image as hero background */}
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/60" />

        <div className="relative mx-auto max-w-7xl">
          {/* <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Explore by theme
          </p> */}

          <h1 className="mt-4 min-h-[1.25em] max-w-3xl font-cg text-4xl font-bold capitalize sm:text-5xl">
            {isLoading && !theme ? "" : themeName}
          </h1>

          {!isLoading && !errorMessage && (
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
              {packages.length > 0
                ? `${packages.length} handpicked ${
                    packages.length === 1 ? "package" : "packages"
                  } for your next ${themeName.toLowerCase()} trip.`
                : "Handpicked holiday packages for this theme."}
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
              className="flex min-h-[444px] flex-col items-center justify-center gap-4"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
              <p className="text-sm font-medium text-slate-500">
                Loading packages…
              </p>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center text-red-700">
              {errorMessage}
            </div>
          )}

          {!isLoading && !errorMessage && packages.length === 0 && (
            <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-slate-600">
              <p>No packages are available for this theme yet.</p>
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

export default ThemePackages;