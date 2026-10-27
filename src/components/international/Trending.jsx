import { useEffect, useRef, useState } from "react";

import DestinationCard from "../ui/DestinationCard";
import Heading from "../ui/Heading";
import Carousel from "../ui/Carousel";
import api from "../../services/api";

export default function Trending() {
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const mobileScrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch trending (featured) international destinations
  useEffect(() => {
    const fetchTrendingDestinations = async () => {
      try {
        setLoading(true);

        const res = await api.get("/destinations/featured");

        const filtered = res.data.data.filter(
          (destination) => Number(destination.categoryId) === 2,
        );

        setTrendingDestinations(filtered);
      } catch (error) {
        console.error(
          "Failed to fetch trending international destinations:",
          error,
        );
        setTrendingDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingDestinations();
  }, []);

  // Mobile / tablet scroll thumb
  useEffect(() => {
    const container = mobileScrollRef.current;

    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }

      setScrollProgress(container.scrollLeft / maxScroll);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [trendingDestinations]);

  return (
    <section className="overflow-x-clip bg-white py-[clamp(2rem,5vw,4rem)]">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        <Heading
          heading="Trending"
          highlight="destinations"
          subheading="Discover our most popular destinations and start planning your next journey."
          className="mb-4 sm:mb-6"
        />

        {/* Desktop carousel */}
        {!loading && trendingDestinations.length > 0 && (
          <div className="hidden lg:block">
            <Carousel
              items={trendingDestinations}
              desktopItems={4}
              tabletItems={2}
              mobileItems={1}
              gap={20}
              renderItem={(destination) => (
                <DestinationCard destination={destination} />
              )}
            />
          </div>
        )}

        {/* Mobile + tablet: swipe row */}
        {!loading && trendingDestinations.length > 0 && (
          <div className="lg:hidden">
            <div
              ref={mobileScrollRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {trendingDestinations.map((destination) => (
                <div
                  key={destination.id || destination._id}
                  className="w-[86%] min-w-0 shrink-0 snap-start sm:w-[78%] md:w-[68%]"
                >
                  <DestinationCard destination={destination} />
                </div>
              ))}
            </div>

            {trendingDestinations.length > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="relative h-[3px] w-[100px] overflow-hidden rounded-full bg-slate-200 sm:w-[120px]">
                  <div
                    className="absolute left-0 top-0 h-full w-[25%] rounded-full bg-slate-900"
                    style={{
                      transform: `translateX(${scrollProgress * 300}%)`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[300px] w-[86%] shrink-0 animate-pulse rounded bg-slate-100 sm:w-[48%] lg:w-auto lg:flex-1"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && trendingDestinations.length === 0 && (
          <div className="py-10 text-center font-inter text-slate-500">
            No trending destinations available.
          </div>
        )}
      </div>
    </section>
  );
}