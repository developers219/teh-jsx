import { useEffect, useMemo, useState } from "react";

import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";

import { getTravelCategories } from "../../services/travel-category.service";
import api from "../../services/api";

import Carousel from "../ui/Carousel";
import DestinationCard from "../ui/DestinationCard";
import SectionHeader from "./SectionHeader";
import { Link } from "react-router-dom";

/* =========================================================
   FALLBACK CATEGORIES
========================================================= */

const fallbackCategories = [
  {
    id: 0,
    categoryType: "domestic",
    title: "Domestic Holidays",
    description:
      "Explore India with family trips, weekend escapes, pilgrimages, beaches, mountains, and cultural circuits.",
    imageUrl:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=85",
    imageAltText: "Domestic holidays in India",
    ctaLabel: "Domestic Destinations",
    ctaUrl: "/destinations/dom",
    status: "active",
    sortOrder: 1,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 1,
    categoryType: "international",
    title: "International Holidays",
    description:
      "Plan curated international vacations with visa guidance, premium stays, guided tours, and smooth support.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
    imageAltText: "International holiday destination",
    ctaLabel: "International Destinations",
    ctaUrl: "/destinations/intl",
    status: "active",
    sortOrder: 2,
    createdAt: "",
    updatedAt: "",
  },
];

/* =========================================================
   FALLBACK DESTINATIONS
========================================================= */

export const domesticDestinations = [
  {
    name: "MANALI",
    tagline: "THE LAND OF HIMALAYAS",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "KERALA",
    tagline: "GOD'S OWN COUNTRY",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "UDAIPUR",
    tagline: "THE CITY OF LAKES",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "DARJEELING",
    tagline: "THE QUEEN OF HILLS",
    image:
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?q=80&w=1170&auto=format&fit=crop",
  },
  {
    name: "AGRA",
    tagline: "THE TAJ CITY",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85",
  },
];

export const internationalDestinations = [
  {
    name: "MALDIVES",
    tagline: "CREATE MEMORIES IN",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "DUBAI",
    tagline: "THE CITY OF FUTURE",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "THAILAND",
    tagline: "THE LAND OF SMILES",
    image:
      "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "SINGAPORE",
    tagline: "THE LION CITY",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "PARIS",
    tagline: "THE CITY OF LOVE",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",
  },
];

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
    destination?.imageUrl ||
    destination?.image ||
    destination?.src ||
    destination?.path ||
    destination?.thumbnail ||
    destination?.bannerImage ||
    ""
  );
}

/* =========================================================
   MOBILE / TABLET CIRCLE
========================================================= */

function DestinationCircle({ destination }) {
  const name = getDestinationName(destination);
  const image = getDestinationImage(destination);

  return (
    <Link
      to={`/destinations/${destination.categoryName === "Domestic" ? "dom" : "intl"}/${destination.slug}`}
    >
      <div
        className="
      flex
      w-[72px]
        flex-none
        snap-start
        flex-col
        items-center
        text-center
        sm:w-[82px]
        md:w-[90px]
      "
      >
        {/* IMAGE */}

        <div
          className="
          h-[58px]
          w-[58px]
          overflow-hidden
          rounded-full
          border
          border-black/10
          bg-gray-100
          shadow-sm
          transition-transform
          duration-300
          hover:scale-105
          sm:h-[66px]
          sm:w-[66px]
          md:h-[72px]
          md:w-[72px]
        "
        >
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>

        {/* NAME */}

        <p
          className="
          mt-2
          w-full
          truncate
          text-[10px]
          font-medium
          leading-tight
          text-gray-800
          sm:text-[11px]
          md:text-xs
          "
        >
          {name}
        </p>
      </div>
    </Link>
  );
}

/* =========================================================
   HORIZONTAL DESTINATION ROW
========================================================= */

function DestinationScrollRow({ title, destinations }) {
  return (
    <div className="w-full">
      {/* ROW TITLE */}

      <div className="mb-3 flex items-center justify-between">
        <h3
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.14em]
            text-gray-700
            sm:text-sm
          "
        >
          {title}
        </h3>

        {/* <span
          className="
            text-[10px]
            text-gray-400
            sm:text-xs
          "
        >
          Swipe →
        </span> */}
      </div>

      {/* HORIZONTAL SCROLL */}

      <div
        className="
          flex
          w-full
          gap-4
          overflow-x-auto
          pb-3
          snap-x
          snap-mandatory
          overscroll-x-contain
          scroll-smooth

          sm:gap-5
          md:gap-6

          [scrollbar-width:none]
    [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden
        "
      >
        {destinations.map((destination, index) => (
          <DestinationCircle
            key={
              destination?.id ||
              destination?.slug ||
              `${getDestinationName(destination)}-${index}`
            }
            destination={destination}
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
  const [categories, setCategories] = useState(fallbackCategories);

  const [internationalDestinations, setInternationalDestinations] =
    useState(null);

  const [domesticDestinations, setDomesticDestinations] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    async function loadTravelCategories() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const travelCategories = await getTravelCategories();

        if (travelCategories.length > 0) {
          setCategories(travelCategories);
        }
      } catch (error) {
        setErrorMessage("Travel categories could not be loaded right now.");

        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    const fetchDestinations = async () => {
      try {
        const res = await api.get("/destinations/category/1");

        setDomesticDestinations(
          res?.data?.data?.length ? res.data.data : domesticDestinations,
        );

        const res2 = await api.get("/destinations/category/2");

        setInternationalDestinations(
          res2?.data?.data?.length ? res2.data.data : internationalDestinations,
        );
      } catch (error) {
        console.log("Destination API error:", error);

        setDomesticDestinations(domesticDestinations);
        setInternationalDestinations(internationalDestinations);
      }
    };

    fetchDestinations();
    loadTravelCategories();
  }, []);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="
        bg-white
        px-4
        py-12
        sm:px-6
        sm:py-14
        lg:px-8
        lg:py-20
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            LOADING
        ================================================== */}

        {isLoading ? (
          <>
            {/* MOBILE / TABLET */}

            <div className="lg:hidden">
              <Skeleton variant="rounded" height={40} className="mb-7" />

              {/* Domestic skeleton */}

              <div className="mb-8">
                <Skeleton
                  variant="text"
                  width={100}
                  height={24}
                  className="mb-3"
                />

                <div className="flex gap-5 overflow-hidden">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-none flex-col items-center"
                    >
                      <Skeleton variant="circular" width={66} height={66} />

                      <Skeleton variant="text" width={55} height={18} />
                    </div>
                  ))}
                </div>
              </div>

              {/* International skeleton */}

              <div>
                <Skeleton
                  variant="text"
                  width={120}
                  height={24}
                  className="mb-3"
                />

                <div className="flex gap-5 overflow-hidden">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-none flex-col items-center"
                    >
                      <Skeleton variant="circular" width={66} height={66} />

                      <Skeleton variant="text" width={55} height={18} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DESKTOP */}

            <div className="hidden space-y-16 lg:block">
              <div>
                <Skeleton variant="rounded" height={45} className="mb-7" />

                <div className="grid grid-cols-5 gap-5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} variant="rounded" height={300} />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton variant="rounded" height={45} className="mb-7" />

                <div className="grid grid-cols-5 gap-5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} variant="rounded" height={300} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* =================================================
            ERROR
        ================================================== */}

        {!isLoading && errorMessage ? (
          <Alert severity="warning" className="mb-10">
            {errorMessage}
          </Alert>
        ) : null}

        {/* =================================================
            MAIN CONTENT
        ================================================== */}

        {!isLoading && (
          <>
            {/* =================================================
                MOBILE + TABLET

                ONE DESTINATIONS SECTION
                TWO HORIZONTAL SCROLL ROWS
            ================================================== */}

            <section className="lg:hidden">
              {/* MAIN HEADING */}

              <div className="mb-7">
                <SectionHeader
                  title="Destinations"
                  description="Explore our most-loved destinations"
                  align="center"
                  style={{ fontSize: "text-[clamp(2rem, 4vw, 3rem)]" }}
                />
              </div>

              {/* ===============================
                  DOMESTIC ROW
              ================================ */}

              <div className="mb-8">
                <DestinationScrollRow
                  title="Domestic"
                  destinations={domesticDestinations ?? []}
                />
              </div>

              {/* ===============================
                  INTERNATIONAL ROW
              ================================ */}

              <DestinationScrollRow
                title="International"
                destinations={internationalDestinations ?? []}
              />
            </section>

            {/* =================================================
                DESKTOP

                EXISTING CAROUSEL CARDS
            ================================================== */}

            <div className="hidden space-y-16 lg:block">
              {/* ===============================
                  DOMESTIC
              ================================ */}

              <section>
                <div className="mb-0 flex items-center justify-between gap-4">
                  <SectionHeader
                    title="Domestic Destinations"
                    description="Choose from destinations across India"
                    align="center"
                  />
                </div>

                <Carousel
                  items={domesticDestinations ?? []}
                  desktopItems={5}
                  tabletItems={2}
                  mobileItems={1}
                  gap={20}
                  showArrows={true}
                  renderItem={(destination) => (
                    <DestinationCard destination={destination} />
                  )}
                />
              </section>

              {/* ===============================
                  INTERNATIONAL
              ================================ */}

              <section>
                <div className="mb-0 flex items-center justify-between gap-4">
                  <SectionHeader
                    title="International Destinations"
                    description="Explore destinations around the world"
                    align="center"
                  />
                </div>

                <Carousel
                  items={internationalDestinations ?? []}
                  desktopItems={5}
                  tabletItems={2}
                  mobileItems={1}
                  gap={20}
                  showArrows={true}
                  renderItem={(destination) => (
                    <DestinationCard destination={destination} />
                  )}
                />
              </section>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default TravelCategories;
