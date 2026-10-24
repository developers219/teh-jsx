import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PackageCard from "../components/packages/PackageCard";
import {
  getPackagesByTravellerType,
  getTravellerTypes,
} from "../services/traveller-type.service";

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

// Backend traveller type object se image nikalo (ThemePackages jaisi hi logic)
function getTypeBackendImage(type) {
  const img =
    type?.imageUrl ||
    type?.image_url ||
    type?.image ||
    type?.thumbnail ||
    type?.images?.[0]?.imageUrl ||
    type?.images?.[0]?.url;

  return typeof img === "string" && img.trim() ? img : null;
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
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Hero: type badalte hi turant naya naam/image (pichla type dikhna band)
  useEffect(() => {
    let cancelled = false;

    setType(getTypeFromState(location, slug));

    getTravellerTypes()
      .then((types) => {
        if (cancelled) return;
        const found = Array.isArray(types)
          ? types.find((item) => item.slug === slug)
          : null;
        if (found) setType(found);
      })
      .catch((error) => {
        console.error("Failed to load traveller types:", error);
      });

    return () => {
      cancelled = true;
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
        console.log(`Packages for traveller type "${slug}" loaded:`, list);

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
  const heroImage = getTypeBackendImage(type);

  return (
    <main className="bg-slate-50 font-mont">
      {/* Header (top padding clears the fixed navbar) */}
      <section className="relative overflow-hidden bg-slate-950 px-6 pb-8 pt-44 text-white lg:px-8">
        {/* Backend traveller type image as hero background */}
        {heroImage && (
          <img
            key={heroImage}
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
