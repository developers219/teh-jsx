import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Website carousel (teh-vite design):
 *  - small round arrows at the top-right
 *  - spring slide animation
 *  - swipe support on touch screens
 *
 * arrowsVariant:
 *  - "default" -> dark glass arrows (as before)
 *  - "glass"   -> light glass arrows (same as Popular Destinations)
 *  - "overlay" -> arrows sit ON the photo, left and right, vertically
 *                 centred (photo sliders). Shown on hover on desktop
 *                 (parent needs the `group` class), always on touch.
 *
 * Extra props:
 *  - fillHeight     -> carousel takes 100% height of its parent (photo sliders)
 *  - className      -> extra classes for the root element
 *  - onIndexChange  -> called with the active index (used for dots)
 *  - index          -> optional: jump to this slide from outside (e.g. when a
 *                      thumbnail is clicked). Leave it out for normal use.
 */

// Arrow styles
const ARROW_VARIANTS = {
  default: {
    wrapper: "mb-6 flex gap-[clamp(0.25rem,2vw,0.5rem)]",
    button:
      "cursor-pointer rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition duration-300 hover:text-blue-200 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white",
    prev: "",
    next: "",
    size: 18,
  },
  glass: {
    wrapper: "mb-6 flex gap-4",
    button:
      "cursor-pointer rounded-full bg-white/20 p-2 text-white backdrop-blur-lg transition duration-300 hover:text-blue-300 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white",
    prev: "",
    next: "",
    size: 16,
  },
  overlay: {
    // `contents` -> the wrapper adds no box, so each button positions
    // itself against the photo (the carousel root is `relative`)
    wrapper: "contents",
    button:
      "absolute top-1/2 z-20 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition duration-300 hover:bg-black/55 disabled:cursor-default disabled:hover:bg-black/30 max-lg:disabled:opacity-40 lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:disabled:opacity-40",
    prev: "left-3",
    next: "right-3",
    size: 18,
  },
};

// Cards visible at the current screen size
function getVisibleItems(desktopItems, tabletItems, mobileItems) {
  if (typeof window === "undefined") return desktopItems;

  const width = window.innerWidth;

  if (width < 640) return mobileItems;
  if (width < 1024) return tabletItems;
  return desktopItems;
}

export default function Carousel({
  items = [],
  renderItem,
  gap = 20,
  showArrows = true,
  arrowsVariant = "default",
  desktopItems = 5,
  tabletItems = 2,
  mobileItems = 2,
  fillHeight = false,
  className = "",
  onIndexChange,
  index,
}) {
  const trackRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [visibleItems, setVisibleItems] = useState(() =>
    getVisibleItems(desktopItems, tabletItems, mobileItems),
  );

  const totalSlides = items.length;
  const maxIndex = Math.max(totalSlides - visibleItems, 0);

  const arrowStyle = ARROW_VARIANTS[arrowsVariant] ?? ARROW_VARIANTS.default;

  // -------------------------------------------------------
  // RESPONSIVE: how many cards are visible
  // -------------------------------------------------------

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getVisibleItems(desktopItems, tabletItems, mobileItems));
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [desktopItems, tabletItems, mobileItems]);

  // -------------------------------------------------------
  // SLIDE WIDTH (card width + gap)
  // -------------------------------------------------------

  useEffect(() => {
    const measure = () => {
      const firstCard = trackRef.current?.children[0];

      if (!firstCard) return;

      setStep(firstCard.offsetWidth + gap);
    };

    measure();

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [totalSlides, visibleItems, gap]);

  // -------------------------------------------------------
  // KEEP POSITION VALID
  // -------------------------------------------------------

  // new list -> start from the first card
  useEffect(() => {
    setActiveIndex(0);
  }, [totalSlides]);

  // layout change -> never go past the last card
  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  // parent asked for a specific slide (thumbnail click etc.)
  useEffect(() => {
    if (typeof index !== "number") return;
    setActiveIndex(Math.min(Math.max(index, 0), maxIndex));
  }, [index, maxIndex]);

  // tell the parent which card is active (for dots etc.)
  useEffect(() => {
    onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange]);

  // -------------------------------------------------------
  // NAVIGATION
  // -------------------------------------------------------

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

  if (totalSlides === 0) return null;

  const cardWidth = `calc((100% - ${(visibleItems - 1) * gap}px) / ${visibleItems})`;

  return (
    <div
      className={`relative flex w-full flex-col items-end ${
        fillHeight ? "h-full" : ""
      } ${className}`}
    >
      {/* ARROWS */}
      {showArrows && maxIndex > 0 && (
        <div className={arrowStyle.wrapper}>
          <button
            type="button"
            onClick={prev}
            disabled={activeIndex === 0}
            aria-label="Previous"
            className={`${arrowStyle.button} ${arrowStyle.prev}`}
          >
            <ArrowLeft size={arrowStyle.size} />
          </button>

          <button
            type="button"
            onClick={next}
            disabled={activeIndex >= maxIndex}
            aria-label="Next"
            className={`${arrowStyle.button} ${arrowStyle.next}`}
          >
            <ArrowRight size={arrowStyle.size} />
          </button>
        </div>
      )}

      {/* VIEWPORT: clips left/right only, so hover lift and shadows stay visible */}
      <div
        className={`w-full touch-pan-y overflow-x-clip ${
          fillHeight ? "h-full" : "h-auto"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* SLIDING TRACK */}
        <motion.div
          ref={trackRef}
          animate={{ x: -(activeIndex * step) }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="flex h-full"
          style={{ gap: `${gap}px` }}
        >
          {items.map((item, index) => (
            <div
              key={item?.id ?? index}
              className={`min-w-0 shrink-0 ${fillHeight ? "h-full" : ""}`}
              style={{ width: cardWidth }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}