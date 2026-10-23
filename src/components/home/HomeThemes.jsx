import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import api from "../../services/api";

/* ---------------------------------------------------------------
   Images
   1) Image coming from the backend theme object (if any)
   2) Otherwise a fallback picked from the theme name
   3) Otherwise a default image
---------------------------------------------------------------- */
const IMAGES = {
  adventure:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  nature:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
  spiritual:
    "https://images.unsplash.com/photo-1576239474622-286656a6a38b?auto=format&fit=crop&w=1200&q=80",
  beach:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  culture:
    "https://images.unsplash.com/photo-1543715474-751a0df77ffc?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
  luxury:
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
};

// keyword in theme name -> fallback image
const KEYWORD_IMAGES = [
  [["adventure", "trek", "group", "solo", "friends"], IMAGES.adventure],
  [["nature", "wildlife", "hill", "mountain"], IMAGES.nature],
  [["spiritual", "pilgrim", "temple"], IMAGES.spiritual],
  [["beach", "island", "romantic", "honeymoon", "couple"], IMAGES.beach],
  [["culture", "heritage", "history", "family"], IMAGES.culture],
  [["luxury", "leisure", "best", "popular", "trending"], IMAGES.luxury],
];

function getThemeImage(theme) {
  const fromBackend =
    theme?.imageUrl ||
    theme?.image_url ||
    theme?.image ||
    theme?.thumbnail ||
    theme?.images?.[0]?.imageUrl ||
    theme?.images?.[0]?.url;

  if (typeof fromBackend === "string" && fromBackend.trim()) {
    return fromBackend;
  }

  const name = String(theme?.name ?? "").toLowerCase();
  const match = KEYWORD_IMAGES.find(([keywords]) =>
    keywords.some((keyword) => name.includes(keyword)),
  );

  return match ? match[1] : IMAGES.nature;
}

/* ---------------------------------------------------------------
   Animation + layout (same as teh-vite)
---------------------------------------------------------------- */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const CARD_HEIGHT = "h-52 sm:h-64 md:h-72 lg:h-70";

// Same gap as teh-vite
const GAP = "clamp(0.25rem,2vw,1rem)";

// Cards visible in one row: mobile 2, tablet 3, desktop 6
function getVisibleSlides() {
  if (typeof window === "undefined") return 6;

  const width = window.innerWidth;

  if (width < 768) return 2;
  if (width < 1024) return 3;
  return 6;
}

export default function HomeThemes() {
  const navigate = useNavigate();

  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewSlides, setViewSlides] = useState(getVisibleSlides);
  const [step, setStep] = useState(0);

  const trackRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);

  // Fetch themes from backend
  useEffect(() => {
    const controller = new AbortController();

    const fetchThemes = async () => {
      try {
        const res = await api.get("/themes", { signal: controller.signal });
        const list = res.data?.data;

        setThemes(
          Array.isArray(list)
            ? list.filter((t) => t?.name && t?.id != null)
            : [],
        );
      } catch (error) {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          console.error("Failed to fetch themes:", error);
        }
        setThemes([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchThemes();

    return () => controller.abort();
  }, []);

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => setViewSlides(getVisibleSlides());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fewer themes than slots -> cards fill the row
  const visibleSlides = Math.max(
    1,
    Math.min(viewSlides, themes.length || viewSlides),
  );
  const maxIndex = Math.max(themes.length - visibleSlides, 0);

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
  }, [themes.length, visibleSlides]);

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

  // Nothing to show (no themes from backend)
  if (!isLoading && themes.length === 0) return null;

  const cardStyle = {
    flex: "0 0 auto",
    width: `calc((100% - ${visibleSlides - 1} * ${GAP}) / ${visibleSlides})`,
  };

  return (
    <section className="overflow-x-clip bg-white py-[clamp(2rem,5vw,4rem)]">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        {/* Heading (exact teh-vite spacing: mb-8 / sm:mb-10).
            Arrows are positioned absolutely, so they never add any height. */}
        <div className="relative mb-8 flex flex-col gap-[clamp(0.5rem,2vw,0.75rem)] sm:mb-10">
          <h2 className="font-jakarta text-[clamp(1.8rem,5vw,2.5rem)] capitalize">
            Explore by <span className="text-blue-400">themes</span>
          </h2>

          <p className="font-inter text-base sm:text-lg lg:text-xl">
            Choose according to your mood
          </p>

          {/* Carousel arrows (teh-vite style) - only when there is more to scroll */}
          {!isLoading && maxIndex > 0 && (
            <div className="absolute bottom-0 right-0 flex gap-[clamp(0.25rem,2vw,0.5rem)]">
              <button
                type="button"
                onClick={prev}
                disabled={activeIndex === 0}
                aria-label="Previous themes"
                className="cursor-pointer rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition duration-300 hover:text-blue-200 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={next}
                disabled={activeIndex >= maxIndex}
                aria-label="Next themes"
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
              <div
                key={i}
                style={{
                  flex: "0 0 auto",
                  width: `calc((100% - ${viewSlides - 1} * ${GAP}) / ${viewSlides})`,
                }}
                className={`${CARD_HEIGHT} animate-pulse rounded-2xl bg-gray-200`}
              />
            ))}
          </div>
        )}

        {/* Carousel viewport.
            overflow-x-clip hides the sliding cards left/right only, so the
            hover effect (scale + lift) is never cut at the top/bottom.
            Side padding gives the edge cards room to scale. */}
        {!isLoading && (
          <div
            className="-mx-2 overflow-x-clip px-2 sm:-mx-4 sm:px-4 lg:-mx-6 lg:px-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slider: moves left/right when the arrows are used */}
            <motion.div
              animate={{ x: -(activeIndex * step) }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              {/* Track: stagger-in animation + the row of cards */}
              <motion.div
                ref={trackRef}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex"
                style={{ gap: GAP }}
              >
                {themes.map((theme) => {
                  const isHovered = hoveredId === theme.id;
                  const isBlurred = hoveredId !== null && !isHovered;

                  // Theme object ko page ke saath bhejo, taaki hero turant dikhe
                  const goToTheme = () =>
                    navigate(`/themes/${theme.id}`, { state: { theme } });

                  return (
                    <motion.div
                      key={theme.id}
                      role="link"
                      tabIndex={0}
                      aria-label={`${theme.name} packages`}
                      variants={cardVariants}
                      onClick={goToTheme}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") goToTheme();
                      }}
                      onMouseEnter={() => setHoveredId(theme.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      animate={{
                        scale: isHovered ? 1.2 : 1,
                        zIndex: isHovered ? 2 : 0,
                        y: isHovered ? -30 : 0,
                        filter: isBlurred ? "blur(1px)" : "blur(0px)",
                        borderColor: "rgba(255,255,255,1)",
                        borderWidth: isHovered ? "4px" : "0px",
                      }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      style={cardStyle}
                      className={`relative ${CARD_HEIGHT} cursor-pointer overflow-hidden rounded-2xl p-2 shadow-2xl`}
                    >
                      <img
                        src={getThemeImage(theme)}
                        alt={theme.name}
                        loading="lazy"
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      <div className="relative flex h-full w-full items-end justify-center">
                        <p className="w-fit rounded-full bg-black/50 p-1 px-2 text-center font-inter text-[10px] text-white backdrop-blur-sm sm:px-3 sm:text-xs">
                          {theme.name}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}