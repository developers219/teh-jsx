
import { useEffect, useState } from "react";

import DestinationCard from "../ui/DestinationCard";
import SectionHeader from "../home/SectionHeader";
import Carousel from "../ui/Carousel";
import api from "../../services/api";

export default function Trending() {
  const [trendingDestinations, setTrendingDestinations] = useState(null);

  // -------------------------------------------------------
  // FETCH TRENDING DESTINATIONS
  // -------------------------------------------------------

  useEffect(() => {
    const fetchTrendingDestinations = async () => {
      const res = await api.get("/destinations/featured");

      const filtered = res.data.data.filter(
        (r) => r.categoryId === 2
      );

      setTrendingDestinations(filtered);
    };

    fetchTrendingDestinations();
  }, []);

  return (
    <section className="w-full overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="relative mb-8 flex items-end justify-between gap-6 sm:mb-10">

          <SectionHeader
            title="Trending Destinations"
            description="Discover our most popular destinations and start planning your next journey."
          />

        </div>

        {/* =====================================================
            DESTINATION CAROUSEL
        ====================================================== */}

        <Carousel
          items={trendingDestinations || []}
          desktopItems={5}
          tabletItems={2}
          mobileItems={1}
          gap={20}
          showArrows={true}
          renderItem={(destination) => (
            <DestinationCard
              destination={destination}
            />
          )}
        />

      </div>
    </section>
  );
}

