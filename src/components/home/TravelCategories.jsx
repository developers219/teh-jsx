import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import { getTravelCategories } from "../../services/travel-category.service";
import api from "../../services/api";
import Carousel from "../ui/Carousel";
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

  /* =======================================================
       LOAD CATEGORIES
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
        setErrorMessage(
          "Travel categories could not be loaded right now."
        );
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
       RENDER
  ======================================================= */

  return (
    <section className="bg-white px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            LOADING STATE
        ================================================== */}

        {isLoading ? (
          <div className="space-y-16">

            {/* Domestic Skeleton */}
            <div>
              <Skeleton
                variant="rounded"
                height={45}
                className="mb-7"
              />

              <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    height={300}
                  />
                ))}
              </div>
            </div>

            {/* International Skeleton */}
            <div>
              <Skeleton
                variant="rounded"
                height={45}
                className="mb-7"
              />

              <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    height={300}
                  />
                ))}
              </div>
            </div>

          </div>
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
          <div className="space-y-16">

            {/* =================================================
                DOMESTIC DESTINATIONS
            ================================================= */}

            <section>

              {/* Heading + CTA */}
              <div className="mb-7 flex items-center justify-between gap-4">

                <Link
                  to={"/destinations/dom"}
                  className="group inline-flex items-center gap-3"
                >
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 sm:text-3xl">
                    DOMESTIC DESTINATIONS
                  </h2>
                </Link>

              </div>

              {/* Domestic Carousel */}
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

            {/* =================================================
                INTERNATIONAL DESTINATIONS
            ================================================= */}

            <section>

              {/* Heading + CTA */}
              <div className="mb-7 flex items-center justify-between gap-4">

                <Link
                  to={"/destinations/intl"}
                  className="group inline-flex items-center gap-3"
                >
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 sm:text-3xl">
                    INTERNATIONAL DESTINATIONS
                  </h2>
                </Link>

              </div>

              {/* International Carousel */}
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
        )}

      </div>
    </section>
  );
}

export default TravelCategories;