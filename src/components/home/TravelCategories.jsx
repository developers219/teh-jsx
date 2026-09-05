import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import { getTravelCategories } from "../../services/travel-category.service";
import api from "../../services/api";
import DestinationCard from "../ui/DestinationCard";
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
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "AGRA",
    tagline: "THE TAJ CITY",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85",
  },
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
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "AGRA",
    tagline: "THE TAJ CITY",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85",
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
   COMPONENT
========================================================= */
function TravelCategories() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [internationalDestinations, setInternationalDestinations] =
    useState(null);
  const [domesticDestinations, setDomesticDestinations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [domesticIndex, setDomesticIndex] = useState(0);
  const [internationalIndex, setInternationalIndex] = useState(0);
  /* =======================================================
       LOAD CATEGORIES
    ======================================================= */
  useEffect(() => {
    async function loadTravelCategories() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const travelCategories = await getTravelCategories();
        // Corrected from TravelCategories.length
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
      const res = await api.get("/destinations/category/1");
      setDomesticDestinations(res.data.data);
      const res2 = await api.get("/destinations/category/2");
      setInternationalDestinations(res2.data.data);
    };
    fetchDestinations();

    loadTravelCategories();
  }, []);
  /* =======================================================
       FIND API CATEGORIES
    ======================================================= */
  const domesticCategory = categories.find(
    (category) => category.categoryType === "domestic"
  );
  const internationalCategory = categories.find(
    (category) => category.categoryType === "international"
  );
  /* =======================================================
       DOMESTIC CAROUSEL
       NO LOOPING
    ======================================================= */
  const showNextDomestic = () => {
    setDomesticIndex((previousIndex) =>
      Math.min(previousIndex + 1, domesticDestinations?.length - 1)
    );
  };
  const showPreviousDomestic = () => {
    setDomesticIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };
  /* =======================================================
       INTERNATIONAL CAROUSEL
       NO LOOPING
    ======================================================= */
  const showNextInternational = () => {
    setInternationalIndex((previousIndex) =>
      Math.min(previousIndex + 1, internationalDestinations?.length - 1)
    );
  };
  const showPreviousInternational = () => {
    setInternationalIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };
  /* =======================================================
       RENDER
    ======================================================= */
  return (
    <section className="bg-white px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            LOADING STATE
        ================================================= */}

        {isLoading ? (
          <div className="space-y-16">
            {/* Domestic Skeleton */}
            <div>
              <Skeleton variant="rounded" height={45} className="mb-7" />

              <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" height={300} />
                ))}
              </div>
            </div>

            {/* International Skeleton */}
            <div>
              <Skeleton variant="rounded" height={45} className="mb-7" />

              <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" height={300} />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* =================================================
            ERROR
        ================================================= */}

        {!isLoading && errorMessage ? (
          <Alert severity="warning" className="mb-10">
            {errorMessage}
          </Alert>
        ) : null}

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        {!isLoading && (
          <div className="space-y-16">
            {/* =================================================
                DOMESTIC DESTINATIONS
            ================================================= */}

            <section>
              {/* Heading + CTA + Arrows */}
              <div className="mb-7 flex items-center justify-between gap-4">
                {/* Heading itself is CTA */}
                <Link
                  to={"/destinations/dom"}
                  className="group inline-flex items-center gap-3"
                >
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300  sm:text-3xl">
                    DOMESTIC DESTINATIONS
                  </h2>

                  {/* <ArrowForwardIosIcon
              sx={{ fontSize: 18 }}
              className="text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-600"
            /> */}
                </Link>

                {/* Carousel Controls */}
                <div className="flex items-center gap-3">
                  {/* Previous */}
                  <button
                    type="button"
                    onClick={showPreviousDomestic}
                    disabled={domesticIndex === 0}
                    aria-label="Previous domestic destinations"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-[#fffaf4] text-slate-600 transition-all duration-300 hover:border-[#d8c4a9] hover:bg-[#f8f0e5] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
                  </button>

                  {/* Next */}
                  <button
                    type="button"
                    onClick={showNextDomestic}
                    disabled={
                      domesticIndex === domesticDestinations?.length - 1
                    }
                    aria-label="Next domestic destinations"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-[#fffaf4] text-slate-700 transition-all duration-300 hover:border-[#d8c4a9] hover:bg-[#f8f0e5] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                  </button>
                </div>
              </div>

              {/* Domestic Carousel */}
              <div className="overflow-hidden">
                <div
                  className="flex gap-5 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${domesticIndex * 20.8}%)`,
                  }}
                >
                  {domesticDestinations?.map((destination) => (
                    <DestinationCard destination={destination} />
                  ))}
                </div>
              </div>
            </section>

            {/* =================================================
                INTERNATIONAL DESTINATIONS
            ================================================= */}

            <section>
              {/* Heading + CTA + Arrows */}
              <div className="mb-7 flex items-center justify-between gap-4">
                {/* Heading itself is CTA */}
                <Link
                  to={"/destinations/intl"}
                  className="group inline-flex items-center gap-3"
                >
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300  sm:text-3xl">
                    INTERNATIONAL DESTINATIONS
                  </h2>

                  {/* <ArrowForwardIosIcon
              sx={{ fontSize: 18 }}
              className="text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-600"
            /> */}
                </Link>

                {/* Carousel Controls */}
                <div className="flex items-center gap-3">
                  {/* Previous */}
                  <button
                    type="button"
                    onClick={showPreviousInternational}
                    disabled={internationalIndex === 0}
                    aria-label="Previous international destinations"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-[#fffaf4] text-slate-600 transition-all duration-300 hover:border-[#d8c4a9] hover:bg-[#f8f0e5] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
                  </button>

                  {/* Next */}
                  <button
                    type="button"
                    onClick={showNextInternational}
                    disabled={
                      internationalIndex ===
                      internationalDestinations?.length - 1
                    }
                    aria-label="Next international destinations"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-[#fffaf4] text-slate-700 transition-all duration-300 hover:border-[#d8c4a9] hover:bg-[#f8f0e5] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                  </button>
                </div>
              </div>

              {/* International Carousel */}
              <div className="overflow-hidden">
                <div
                  className="flex gap-5 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${internationalIndex * 20.8}%)`,
                  }}
                >
                  {internationalDestinations?.map((destination) => (
                    <DestinationCard destination={destination} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
export default TravelCategories;
