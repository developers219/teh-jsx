import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Heading from "../ui/Heading";
import api from "../../services/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=90";

// ---------------------------------------------------------------------------
// One destination card (same look as DestinationCard, but fluid so it fits
// 2 / 3 / 4 columns on every screen size)
// ---------------------------------------------------------------------------
function DestinationGridCard({ destination }) {
  const imageUrl =
    destination?.images?.[0]?.imageUrl ??
    destination?.imageUrl ??
    destination?.image ??
    FALLBACK_IMAGE;

  const type = destination?.categoryName === "International" ? "intl" : "dom";

  return (
    <Link
      to={`/destinations/${type}/${destination?.slug}`}
      className="group relative block h-[230px] overflow-hidden rounded bg-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-[270px] lg:h-[300px]"
    >
      <img
        src={imageUrl}
        alt={`${destination?.name ?? "Destination"}${
          destination?.tagline ? `, ${destination.tagline}` : ""
        }`}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
      />

      {/* Bottom gradient so the name is readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-3.5 pb-4 text-white sm:px-4 sm:pb-5">
        {destination?.tagline && (
          <p className="mb-1 truncate font-inter text-[10px] font-bold uppercase leading-tight tracking-[0.1px] [text-shadow:0_1px_5px_rgb(0_0_0/0.7)]">
            {destination.tagline}
          </p>
        )}

        <h3 className="truncate font-eb text-xl uppercase leading-none tracking-tight [text-shadow:0_2px_8px_rgb(0_0_0/0.65)] sm:text-2xl">
          {destination?.name}
        </h3>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const AllDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const res = await api.get("/destinations/category/1");

        if (cancelled) return;

        setDestinations(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch destinations:", error);
        setDestinations([]);
        setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDestinations();

    return () => {
      cancelled = true;
    };
  }, []);

  const { visibleItems, loadMoreRef, hasMore } = useInfiniteScroll(
    destinations,
    12,
    12,
  );

  return (
    <section
      id="all-destinations"
      className="overflow-x-clip bg-white py-[clamp(2rem,5vw,4rem)]"
    >
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        <Heading
          heading="All"
          highlight="destinations"
          subheading="From serene beaches to majestic mountains, discover handpicked destinations for your next unforgettable journey."
          className="mb-6 sm:mb-8"
        />

        {/* Loading spinner (same as ThemePackages) */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-[320px] flex-col items-center justify-center gap-4"
          >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="text-sm font-medium text-slate-500">
              Loading destinations…
            </p>
          </div>
        )}

        {!isLoading && hasError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center text-red-700">
            We could not load destinations right now. Please try again later.
          </div>
        )}

        {!isLoading && !hasError && destinations.length === 0 && (
          <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-slate-600">
            No destinations are available yet.
          </div>
        )}

        {/* Destination grid */}
        {!isLoading && destinations.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {visibleItems.map((destination) => (
                <DestinationGridCard
                  key={destination.id}
                  destination={destination}
                />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div
              ref={loadMoreRef}
              className="mt-8 flex min-h-[80px] items-center justify-center"
            >
              {hasMore ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
                  <p className="text-xs font-medium text-slate-500">
                    Loading more destinations…
                  </p>
                </div>
              ) : (
                <p className="py-3 text-sm font-medium text-slate-400">
                  You&apos;ve explored all destinations
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AllDestinations;
