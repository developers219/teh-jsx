import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

import api from "../../services/api";
import Carousel from "../ui/Carousel";
import { Heading } from "../ui/Heading";

/* =========================================================
   FALLBACK DESTINATIONS
   Used only when the backend fails or returns nothing.
========================================================= */

const FALLBACK_DOMESTIC = [
  {
    name: "MANALI",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "KERALA",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "UDAIPUR",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "DARJEELING",
    image:
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?q=80&w=1170&auto=format&fit=crop",
  },
  {
    name: "AGRA",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85",
  },
];

const FALLBACK_INTERNATIONAL = [
  {
    name: "MALDIVES",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "DUBAI",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "THAILAND",
    image:
      "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "SINGAPORE",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "PARIS",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",
  },
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=90";

/* =========================================================
   HELPERS
========================================================= */

function getDestinationName(destination) {
  return (
    destination?.name ||
    destination?.title ||
    destination?.destinationName ||
    destination?.city ||
    "Destination"
  );
}

function getDestinationImage(destination) {
  return (
    destination?.images?.[0]?.imageUrl ||
    destination?.imageUrl ||
    destination?.image ||
    destination?.src ||
    destination?.path ||
    destination?.thumbnail ||
    destination?.bannerImage ||
    DEFAULT_IMAGE
  );
}

// Use backend list when it has data, otherwise the fallback
function pickList(result, fallback) {
  if (result.status !== "fulfilled") return fallback;

  const list = result.value?.data?.data;

  return Array.isArray(list) && list.length > 0 ? list : fallback;
}

/* =========================================================
   DESTINATION CARD (teh-vite design)
========================================================= */

function DestinationTile({ destination, category }) {
  const name = getDestinationName(destination);

  // Fallback items have no slug -> open the category page
  const path = destination?.slug
    ? `/destinations/${category}/${destination.slug}`
    : `/destinations/${category}`;

  return (
    <Link
      to={path}
      className="group relative flex h-[40vh] min-h-[240px] w-full cursor-pointer items-end overflow-hidden rounded-2xl shadow-sm"
    >
      <img
        src={getDestinationImage(destination)}
        alt={name}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-115"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/30 to-transparent" />

      <div className="relative flex min-h-[15%] w-full items-center justify-center bg-linear-to-t from-black/30 to-transparent px-2 py-2 text-center text-lg font-semibold leading-tight text-white backdrop-blur-xs sm:text-xl">
        {name}
      </div>
    </Link>
  );
}

/* =========================================================
   ONE SECTION: HEADING + CAROUSEL
========================================================= */

function DestinationSection({
  heading,
  subheading,
  destinations,
  category,
}) {
  return (
    <div className="w-full">
      <Heading
        heading={heading}
        highlight="Destinations"
        subheading={subheading}
        className="mb-2"
      />

      <Carousel
        items={destinations}
        desktopItems={5}
        tabletItems={3}
        mobileItems={2}
        gap={20}
        showArrows={true}
        renderItem={(destination) => (
          <DestinationTile destination={destination} category={category} />
        )}
      />
    </div>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function SectionSkeleton() {
  return (
    <div className="w-full">
      <Skeleton variant="text" width={280} height={48} />
      <Skeleton variant="text" width={220} height={28} className="mb-8" />

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={280}
            className={
              index >= 3 ? "hidden lg:block" : index >= 2 ? "hidden sm:block" : ""
            }
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function TravelCategories() {
  const [domesticDestinations, setDomesticDestinations] =
    useState(FALLBACK_DOMESTIC);
  const [internationalDestinations, setInternationalDestinations] = useState(
    FALLBACK_INTERNATIONAL,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDestinations = async () => {
      // 1 = Domestic, 2 = International
      const [domesticRes, internationalRes] = await Promise.allSettled([
        api.get("/destinations/category/1", { signal: controller.signal }),
        api.get("/destinations/category/2", { signal: controller.signal }),
      ]);

      if (controller.signal.aborted) return;

      if (domesticRes.status === "rejected") {
        console.log("Domestic destinations API error:", domesticRes.reason);
      }

      if (internationalRes.status === "rejected") {
        console.log(
          "International destinations API error:",
          internationalRes.reason,
        );
      }

      setDomesticDestinations(pickList(domesticRes, FALLBACK_DOMESTIC));
      setInternationalDestinations(
        pickList(internationalRes, FALLBACK_INTERNATIONAL),
      );
      setIsLoading(false);
    };

    fetchDestinations();

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-white py-[clamp(2rem,5vw,4rem)] font-inter">
      <div className="mx-auto w-full max-w-7xl space-y-[clamp(1.6rem,5vw,4rem)] px-2 sm:px-4 lg:px-6 xl:px-0">
        {isLoading ? (
          <>
            <SectionSkeleton />
            <SectionSkeleton />
          </>
        ) : (
          <>
            {/* ===============================
                DOMESTIC
            ================================ */}

            <DestinationSection
              heading="Domestic"
              subheading="Choose from destinations across India"
              destinations={domesticDestinations}
              category="dom"
            />

            {/* ===============================
                INTERNATIONAL
            ================================ */}

            <DestinationSection
              heading="International"
              subheading="Explore destinations around the world"
              destinations={internationalDestinations}
              category="intl"
            />
          </>
        )}
      </div>
    </section>
  );
}

export default TravelCategories;