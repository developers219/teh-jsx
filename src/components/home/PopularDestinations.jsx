import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import api from "../../services/api";
import { Heading } from "../ui/Heading";

// =========================================================
// DEFAULT DESTINATIONS
// Used whenever the backend is unavailable or returns
// no usable destination data.
// =========================================================

const DEFAULT_DESTINATIONS = [
  {
    id: 1,
    name: "Turkey",
    description:
      "Dramatic cliffs, quiet villages and endless Atlantic horizons. Discover one of Europe's most untouched destinations, where nature takes center stage.",
    imageUrl:
      "https://images.unsplash.com/photo-1665470298997-86b6e79799db?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "Kerala",
    description:
      "Whitewashed villages carved into volcanic cliffs, deep blue waters and sunsets that turn the Aegean into a painting.",
    imageUrl:
      "https://images.unsplash.com/photo-1650730005180-2c849af5d6cc?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "Japan",
    description:
      "Ancient temples, lantern-lit streets and gardens shaped by centuries of Japanese tradition.",
    imageUrl:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaWdodHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    name: "Andaman and Nicobar Islands",
    description:
      "Wild mountains, turquoise lakes and enormous open landscapes. Patagonia is an invitation to disappear into the wilderness.",
    imageUrl:
      "https://images.unsplash.com/photo-1642498232612-a837df233825?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    name: "Leh Ladakh",
    description:
      "Cliffside towns, winding coastal roads and Mediterranean waters. Experience the timeless charm of Italy's coastline.",
    imageUrl:
      "https://images.unsplash.com/photo-1600242466690-c1c04f081762?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    name: "spiti valley",
    description:
      "Glaciers, black sand beaches, waterfalls and volcanic landscapes create a world that feels beautifully otherworldly.",
    imageUrl:
      "https://images.unsplash.com/photo-1637314995939-7560a94b1495?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaWdodHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// Auto-advance time (same as teh-vite)
const AUTO_SLIDE_MS = 4000;

// Backend destination -> page link
function getDestinationPath(destination) {
  if (!destination?.slug) return "/destinations";

  const isInternational =
    destination.categoryName === "International" ||
    Number(destination.categoryId) === 2;

  return `/destinations/${isInternational ? "intl" : "dom"}/${destination.slug}`;
}

// =========================================================
// LEFT SIDE: NAME, DESCRIPTION, BUTTON
// =========================================================

const DestinationContent = ({ destination, onExplore }) => {
  return (
    <div className="flex h-full w-full flex-col justify-center px-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={destination.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="space-y-6"
        >
          <motion.h2
            className="text-[clamp(1.8rem,5vw,2.5rem)] font-bold uppercase text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {destination.name}
          </motion.h2>

          {destination.description && (
            <p className="leading-relaxed text-white/80">
              {destination.description}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => onExplore(destination)}
        className="my-5 w-fit cursor-pointer rounded-xl bg-blue-400 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-500"
      >
        Explore
      </button>
    </div>
  );
};

// =========================================================
// RIGHT SIDE: STACKED CARD CAROUSEL
// =========================================================

const DestinationCarousel = ({
  items,
  activeIndex,
  onSelect,
  onOpen,
  next,
  prev,
}) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative h-[256px] w-full md:h-[500px]">
        {items.map((item, index) => {
          const offset = (index - activeIndex + items.length) % items.length;

          if (offset > 3) return null;

          return (
            <motion.button
  type="button"
  key={item.id}
  aria-label={offset === 0 ? `Open ${item.name}` : `Show ${item.name}`}
  onClick={() => (offset === 0 ? onOpen(item) : onSelect(index))}
  className="absolute top-1/2 cursor-pointer overflow-hidden rounded-3xl"
              animate={{
                x: offset * 165,
                y: "-50%",
                scale: offset === 0 ? 1 : 0.9,
                zIndex: 10 - offset,
              }}
              initial={{ y: "-50%", zIndex: 10 - offset }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            >
              <div
                className={`relative overflow-hidden rounded-3xl ${
                  offset === 0
                    ? "h-[200px] w-[250px] md:h-[300px] md:w-[390px] lg:h-[420px] lg:w-[300px]"
                    : "h-[200px] w-[250px] lg:h-[360px] lg:w-[240px]"
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <p className="text-lg font-semibold text-white">
                    {item.name}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mb-5 h-10">
        <button
          type="button"
          aria-label="Previous destination"
          className="mr-4 cursor-pointer rounded-full bg-white/20 p-2 text-white backdrop-blur-lg transition duration-300 hover:text-blue-300"
          onClick={prev}
        >
          <ArrowLeft size={16} />
        </button>

        <button
          type="button"
          aria-label="Next destination"
          className="cursor-pointer rounded-full bg-white/20 p-2 text-white backdrop-blur-lg transition duration-300 hover:text-blue-300"
          onClick={next}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

// =========================================================
// POPULAR DESTINATIONS (Top 10)
// =========================================================

function PopularDestinations() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);
  const [activeIndex, setActiveIndex] = useState(0);

  // =======================================================
  // FETCH POPULAR DESTINATIONS FROM BACKEND
  // =======================================================

  useEffect(() => {
    let isMounted = true;

    const fetchDestinations = async () => {
      try {
        const response = await api.get("/destinations/popular");

        const payload = response?.data?.data;

        const destinationList = Array.isArray(payload)
          ? payload
          : (payload?.destinations ?? payload?.data?.destinations ?? []);

        if (!Array.isArray(destinationList) || destinationList.length === 0) {
          return;
        }

        const normalizedDestinations = destinationList
          .map((item, index) => {
            const imageUrl =
              item.imageUrl ??
              item.images?.[0]?.imageUrl ??
              item.images?.[0]?.url ??
              item.image?.url;

            return {
              id: item.id ?? item._id ?? index + 1,
              name: item.name ?? item.title,
              description: item.description ?? "",
              imageUrl,
              slug: item.slug,
              categoryName: item.categoryName,
              categoryId: item.categoryId,
            };
          })
          .filter((item) => item.name && item.imageUrl)
          // "Top 10 destinations"
          .slice(0, 10);

        // Replace defaults only when usable API data exists.
        if (isMounted && normalizedDestinations.length > 0) {
          setDestinations(normalizedDestinations);
          setActiveIndex(0);
        }
      } catch (error) {
        // Defaults remain visible if the backend fails.
        console.error("Failed to fetch popular destinations:", error);
      }
    };

    fetchDestinations();

    return () => {
      isMounted = false;
    };
  }, []);

  // =======================================================
  // AUTO SLIDE (restarts after every change, also manual ones)
  // =======================================================

  useEffect(() => {
    if (destinations.length < 2) return undefined;

    const timeout = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % destinations.length);
    }, AUTO_SLIDE_MS);

    return () => clearTimeout(timeout);
  }, [activeIndex, destinations.length]);

  const next = () => setActiveIndex((prev) => (prev + 1) % destinations.length);

  const prev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + destinations.length) % destinations.length,
    );

  const handleExplore = (destination) => {
    navigate(getDestinationPath(destination));
  };

  const activeDestination = destinations[activeIndex] ?? destinations[0];

  return (
    <section className="my-[clamp(1.6rem,5vw,4rem)] h-auto max-h-175 font-inter md:h-screen">
      <div className="mx-auto h-full w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        <div className="flex h-full flex-col gap-[clamp(0.25rem,2vw,2rem)]">
          <Heading
            heading="Where to "
            highlight="Next ?"
            subheading="The Places You'll Talk About Forever."
          />

          <div
            className="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-2xl md:flex-row"
            style={{
              backgroundImage: `url("${activeDestination.imageUrl}")`,
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 z-0 bg-black/80" />

            <div className="relative h-full w-full pt-8 md:w-[40%] md:pt-0">
              <DestinationContent
                destination={activeDestination}
                onExplore={handleExplore}
              />
            </div>

            <div className="relative h-full w-full px-8 md:w-[60%] md:px-0">
              <DestinationCarousel
                items={destinations}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                  onOpen={handleExplore}
                next={next}
                prev={prev}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopularDestinations;