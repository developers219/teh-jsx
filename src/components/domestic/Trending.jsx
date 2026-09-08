import { useEffect, useState } from "react";

import DestinationCard from "../ui/DestinationCard";
import SectionHeader from "../home/SectionHeader";
import Carousel from "../ui/Carousel";
import api from "../../services/api";

export default function Trending() {
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------
  // FETCH TRENDING DESTINATIONS
  // -------------------------------------------------------

  useEffect(() => {
    const fetchTrendingDestinations = async () => {
      try {
        setLoading(true);

        const res = await api.get("/destinations/featured");

        console.log("Featured destinations:", res.data.data);

        const filtered = res.data.data.filter(
          (destination) => Number(destination.categoryId) === 1
        );

        console.log("Trending destinations:", filtered);

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
            CAROUSEL
        ====================================================== */}

        {!loading && trendingDestinations.length > 0 && (
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
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="
                  h-[280px]
                  w-[calc(20%-16px)]
                  shrink-0
                  animate-pulse
                  rounded-2xl
                  bg-slate-100
                "
              />
            ))}
          </div>
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
