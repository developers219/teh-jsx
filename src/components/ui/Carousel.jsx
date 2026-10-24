import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Website carousel (teh-vite design):
 *  - small round arrows at the top-right
 *  - spring slide animation
 *  - swipe support on touch screens
 *
 * Props are the same as before, so every page that already uses
 * <Carousel items renderItem ... /> switches to this design automatically.
 */

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
  desktopItems = 5,
  tabletItems = 2,
  mobileItems = 2,
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
    <div className="flex w-full flex-col items-end">
      {/* ARROWS (same as teh-vite) */}
      {showArrows && maxIndex > 0 && (
        <div className="mb-6 flex gap-[clamp(0.25rem,2vw,0.5rem)]">
          <button
            type="button"
            onClick={prev}
            disabled={activeIndex === 0}
            aria-label="Previous"
            className="cursor-pointer rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition duration-300 hover:text-blue-200 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            onClick={next}
            disabled={activeIndex >= maxIndex}
            aria-label="Next"
            className="cursor-pointer rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition duration-300 hover:text-blue-200 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* VIEWPORT: clips left/right only, so hover lift and shadows stay visible */}
      <div
        className="h-auto w-full touch-pan-y overflow-x-clip"
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
              className="min-w-0 shrink-0"
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