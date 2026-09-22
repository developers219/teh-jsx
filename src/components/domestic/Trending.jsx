import { useEffect, useRef, useState } from "react";

import DestinationCard from "../ui/DestinationCard";
import SectionHeader from "../home/SectionHeader";
import Carousel from "../ui/Carousel";
import api from "../../services/api";

export default function Trending() {
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const mobileScrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // -------------------------------------------------------
  // FETCH TRENDING DESTINATIONS
  // -------------------------------------------------------

  useEffect(() => {
    const fetchTrendingDestinations = async () => {
      try {
        setLoading(true);

        const res = await api.get("/destinations/featured");

        const filtered = res.data.data.filter(
          (destination) => Number(destination.categoryId) === 1,
        );

        setTrendingDestinations(filtered);
      } catch (error) {
        console.error("Failed to fetch trending destinations:", error);

        setTrendingDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingDestinations();
  }, []);

  // -------------------------------------------------------
  // MOBILE / TABLET SCROLL THUMB
  // -------------------------------------------------------

  useEffect(() => {
    const container = mobileScrollRef.current;

    if (!container) return;

    const handleScroll = () => {
      const maxScroll =
        container.scrollWidth - container.clientWidth;

      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }

      setScrollProgress(container.scrollLeft / maxScroll);
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [trendingDestinations]);

  return (
    <section className="w-full overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mb-8 sm:mb-10">
          <SectionHeader
            title="Trending Destinations"
            description="Discover our most popular destinations and start planning your next journey."
          />
        </div>

        {/* =====================================================
            DESKTOP CAROUSEL
            5 CARDS — SAME AS BEFORE
        ====================================================== */}

        {!loading && trendingDestinations.length > 0 && (
          <div className="hidden lg:block">
            <Carousel
              items={trendingDestinations}
              desktopItems={5}
              tabletItems={2}
              mobileItems={1}
              gap={20}
              renderItem={(destination) => (
                <DestinationCard destination={destination} />
              )}
            />
          </div>
        )}

        {/* =====================================================
            MOBILE + TABLET + IPAD
            ONE COMPLETE CARD + PART OF SECOND CARD
        ====================================================== */}

        {!loading && trendingDestinations.length > 0 && (
          <div className="lg:hidden">

            <div
              ref={mobileScrollRef}
              className="
                flex
                gap-5
                overflow-x-auto
                overscroll-x-contain
                snap-x
                snap-mandatory
                pb-1

                [-ms-overflow-style:none]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {trendingDestinations.map((destination) => (
                <div
                  key={destination.id || destination._id}
                  className="
                    min-w-0
                    shrink-0
                    snap-start

                    w-[86%]

                    sm:w-[78%]

                    md:w-[68%]
                  "
                >
                  <DestinationCard destination={destination} />
                </div>
              ))}
            </div>

            {/* =================================================
                THUMB SCROLL
            ================================================== */}

            {trendingDestinations.length > 1 && (
              <div className="mt-6 flex justify-center">
                <div
                  className="
                    relative
                    h-[3px]
                    w-[100px]
                    overflow-hidden
                    rounded-full
                    bg-slate-200

                    sm:w-[120px]
                  "
                >
                  <div
                    className="
                      absolute
                      left-0
                      top-0
                      h-full
                      w-[25%]
                      rounded-full
                      bg-black
                    "
                    style={{
                      transform: `translateX(${
                        scrollProgress * 300
                      }%)`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (
          <>
            {/* Desktop loading */}
            <div className="hidden gap-5 overflow-hidden lg:flex">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="
                    h-[280px]
                    flex-1
                    animate-pulse
                    rounded-2xl
                    bg-slate-100
                  "
                />
              ))}
            </div>

            {/* Mobile / Tablet loading */}
            <div className="flex gap-5 overflow-hidden lg:hidden">
              <div
                className="
                  h-[280px]
                  w-[86%]
                  shrink-0
                  animate-pulse
                  rounded-2xl
                  bg-slate-100

                  sm:w-[78%]

                  md:w-[68%]
                "
              />

              <div
                className="
                  h-[280px]
                  w-[86%]
                  shrink-0
                  animate-pulse
                  rounded-2xl
                  bg-slate-100

                  sm:w-[78%]

                  md:w-[68%]
                "
              />
            </div>
          </>
        )}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {!loading && trendingDestinations.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No trending destinations available.
          </div>
        )}
      </div>
    </section>
  );
}