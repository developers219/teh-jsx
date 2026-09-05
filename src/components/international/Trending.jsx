import { useRef } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import DestinationCard from "../ui/DestinationCard";
import SectionHeader from "../home/SectionHeader";


const trendingDestinations = [
  {
    name: "Manali",
    state: "HIMACHAL PRADESH",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
    link: "/destinations/manali",
  },
  {
    name: "Kerala",
    state: "KERALA",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
    link: "/destinations/kerala",
  },
  {
    name: "Udaipur",
    state: "RAJASTHAN",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85",
    link: "/destinations/udaipur",
  },
  {
    name: "Darjeeling",
    state: "WEST BENGAL",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85",
    link: "/destinations/darjeeling",
  },
  {
    name: "Goa",
    state: "GOA",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85",
    link: "/destinations/goa",
  },
  {
    name: "Jaipur",
    state: "RAJASTHAN",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85",
    link: "/destinations/jaipur",
  },
  {
    name: "Shimla",
    state: "HIMACHAL PRADESH",
    image:
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=85",
    link: "/destinations/shimla",
  },
  {
    name: "Andaman",
    state: "ANDAMAN & NICOBAR",
    image:
      "https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?auto=format&fit=crop&w=1200&q=85",
    link: "/destinations/andaman",
  },
];

export default function Trending() {
  const carouselRef = useRef(null);

  // -------------------------------------------------------
  // MOVE CAROUSEL
  // -------------------------------------------------------

  const moveCarousel = (direction) => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;

    const card = container.querySelector(
      "[data-destination-card]"
    );

    if (!card) return;

    const cardWidth = card.offsetWidth;

    const gap = 20;

    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

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

          {/* ===================================================
              CAROUSEL CONTROLS
              SAME AS TRAVEL CATEGORIES
          ==================================================== */}

          <div className="flex items-center gap-3">

            {/* Previous */}

            <button
              type="button"
              onClick={() => moveCarousel(-1)}
              aria-label="Previous trending destinations"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#eadfce]
                bg-[#fffaf4]
                text-slate-600
                transition-all
                duration-300
                hover:border-[#d8c4a9]
                hover:bg-[#f8f0e5]
                hover:text-slate-900
              "
            >
              <ArrowBackIosNewIcon
                sx={{ fontSize: 15 }}
              />
            </button>


            {/* Next */}

            <button
              type="button"
              onClick={() => moveCarousel(1)}
              aria-label="Next trending destinations"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#eadfce]
                bg-[#fffaf4]
                text-slate-700
                transition-all
                duration-300
                hover:border-[#d8c4a9]
                hover:bg-[#f8f0e5]
                hover:text-slate-900
              "
            >
              <ArrowForwardIosIcon
                sx={{ fontSize: 15 }}
              />
            </button>

          </div>
        </div>


        {/* =====================================================
            DESTINATION CAROUSEL
        ====================================================== */}

        <div
          ref={carouselRef}
          className="
            flex
            gap-5
            overflow-x-auto
            scroll-smooth
            pb-2
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          {trendingDestinations.map((destination) => (
            <div
              key={destination.name}
              data-destination-card
              className="
                shrink-0
                w-[75%]
                sm:w-[45%]
                md:w-[31%]
                lg:w-[19%]
              "
            >
              <DestinationCard
                destination={destination}
              />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}