import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import { Heading } from "../ui/Heading";
import { getTravellerTypes } from "../../services/traveller-type.service";

function getTypeName(type) {
  return type?.travellerTypeName || type?.name || type?.title || "Travellers";
}

function getTypeImage(type) {
  return type?.imageUrl || type?.image || type?.thumbnail || "";
}

/* Same gap as HomeThemes */
const GAP = "clamp(0.25rem,2vw,1rem)";

// Cards visible in one row: mobile 1, tablet 2, desktop 4
function getVisibleSlides() {
  if (typeof window === "undefined") return 4;

  const width = window.innerWidth;

  if (width < 768) return 1;
  if (width < 1024) return 2;
  return 4;
}

function PeopleCard({ type, style }) {
  const name = getTypeName(type);
  const image = getTypeImage(type);

  return (
    <Link
      to={`/packages/traveller-type/${type.slug}`}
      style={style}
      className="group relative flex aspect-[4/3] cursor-pointer items-end overflow-hidden rounded-2xl bg-gray-200 shadow-people"
    >
      {image ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : null}

      <div className="relative flex h-1/4 w-full items-end justify-center bg-linear-to-t from-black via-black/50 to-transparent pb-4 font-inter text-xl font-bold capitalize text-white sm:pb-5 sm:text-2xl">
        <p>{name}</p>
      </div>
    </Link>
  );
}

function ExploreByPeople() {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carousel state (same as HomeThemes)
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewSlides, setViewSlides] = useState(getVisibleSlides);
  const [step, setStep] = useState(0);

  const trackRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);

  useEffect(() => {
    async function loadTypes() {
      try {
        const data = await getTravellerTypes();
        console.log("Traveller types loaded:", data);
        setTypes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Traveller types could not be loaded:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTypes();
  }, []);

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => setViewSlides(getVisibleSlides());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleSlides = Math.max(
    1,
    Math.min(viewSlides, types.length || viewSlides),
  );
  const maxIndex = Math.max(types.length - visibleSlides, 0);

  // Width of one slide (card + gap) for the translate animation
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const firstCard = track?.children[0];

      if (!firstCard) return;

      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      setStep(firstCard.offsetWidth + gap);
    };

    measure();

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [types.length, visibleSlides, isLoading]);

  // Keep the active slide valid when the layout changes
  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const next = () => setActiveIndex((prev) => Math.min(prev + 1, maxIndex));
  const prev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    endX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = startX.current - endX.current;

    if (distance > 50) next();
    if (distance < -50) prev();
  };

  // Data nahi aaya to poora section hide
  if (!isLoading && types.length === 0) return null;

  const cardStyle = {
    flex: "0 0 auto",
    width: `calc((100% - ${visibleSlides - 1} * ${GAP}) / ${visibleSlides})`,
  };

  return (
    <section className="overflow-x-clip bg-white py-[clamp(2rem,5vw,4rem)]">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        {/* Heading + arrows: exactly like HomeThemes */}
        <div className="relative">
          <Heading
            heading="Explore by"
            highlight="people"
            subheading="Choose plan according to your company"
          />

          {!isLoading && maxIndex > 0 && (
            <div className="absolute bottom-0 right-0 flex gap-[clamp(0.25rem,2vw,0.5rem)]">
              <button
                type="button"
                onClick={prev}
                disabled={activeIndex === 0}
                aria-label="Previous traveller types"
                className="cursor-pointer rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition duration-300 hover:text-blue-200 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={next}
                disabled={activeIndex >= maxIndex}
                aria-label="Next traveller types"
                className="cursor-pointer rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition duration-300 hover:text-blue-200 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Loading skeleton (single row) */}
        {isLoading && (
          <div className="flex" style={{ gap: GAP }}>
            {Array.from({ length: viewSlides }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                style={{
                  flex: "0 0 auto",
                  width: `calc((100% - ${viewSlides - 1} * ${GAP}) / ${viewSlides})`,
                }}
                className="!aspect-[4/3] !h-auto !rounded-2xl"
              />
            ))}
          </div>
        )}

        {/* Carousel viewport */}
        {!isLoading && (
          <div
            className="-mx-2 overflow-x-clip px-2 sm:-mx-4 sm:px-4 lg:-mx-6 lg:px-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              animate={{ x: -(activeIndex * step) }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div ref={trackRef} className="flex" style={{ gap: GAP }}>
                {types.map((type) => (
                  <PeopleCard key={type.id} type={type} style={cardStyle} />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ExploreByPeople;
