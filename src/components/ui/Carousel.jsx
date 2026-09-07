import { useEffect, useRef, useState } from "react";

export default function Carousel({
  items = [],
  renderItem,
  desktopItems = 5,
  tabletItems = 2,
  mobileItems = 1,
  gap = 20,
  showArrows = true,
}) {
  const containerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] =
    useState(desktopItems);
  const [cardWidth, setCardWidth] = useState(0);

  // -------------------------------------------------------
  // RESPONSIVE ITEMS PER VIEW
  // -------------------------------------------------------

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setItemsPerView(mobileItems);
      } else if (width < 1024) {
        setItemsPerView(tabletItems);
      } else {
        setItemsPerView(desktopItems);
      }
    };

    updateItemsPerView();

    window.addEventListener(
      "resize",
      updateItemsPerView
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateItemsPerView
      );
    };
  }, [
    desktopItems,
    tabletItems,
    mobileItems,
  ]);

  // -------------------------------------------------------
  // CALCULATE CARD WIDTH
  // -------------------------------------------------------

  useEffect(() => {
    const calculateCardWidth = () => {
      if (!containerRef.current) return;

      const containerWidth =
        containerRef.current.offsetWidth;

      const totalGap =
        gap * (itemsPerView - 1);

      const width =
        (containerWidth - totalGap) /
        itemsPerView;

      setCardWidth(width);
    };

    calculateCardWidth();

    window.addEventListener(
      "resize",
      calculateCardWidth
    );

    return () => {
      window.removeEventListener(
        "resize",
        calculateCardWidth
      );
    };
  }, [itemsPerView, gap]);

  // -------------------------------------------------------
  // MAXIMUM SLIDE
  // -------------------------------------------------------

  const maxIndex = Math.max(
    0,
    items.length - itemsPerView
  );

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  // -------------------------------------------------------
  // NEXT
  // -------------------------------------------------------

  const nextSlide = () => {
    if (!canGoNext) return;

    setCurrentIndex((previous) =>
      Math.min(previous + 1, maxIndex)
    );
  };

  // -------------------------------------------------------
  // PREVIOUS
  // -------------------------------------------------------

  const previousSlide = () => {
    if (!canGoPrevious) return;

    setCurrentIndex((previous) =>
      Math.max(previous - 1, 0)
    );
  };

  // -------------------------------------------------------
  // RESET WHEN ITEMS CHANGE
  // -------------------------------------------------------

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  // -------------------------------------------------------
  // TRANSLATION
  // -------------------------------------------------------

  const translateX =
    currentIndex * (cardWidth + gap);

  return (
    <div className="w-full">

      {/* =================================================
          ARROWS
      ================================================== */}

      {showArrows && (
        <div className="mb-6 flex justify-end gap-3">

          {/* PREVIOUS ARROW */}

          <button
            type="button"
            onClick={previousSlide}
            disabled={!canGoPrevious}
            aria-label="Previous destinations"
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              bg-white
              transition-all
              duration-300

              ${
                canGoPrevious
                  ? `
                    border-[#e8ded4]
                    text-slate-700
                    hover:bg-slate-50
                    hover:shadow-sm
                  `
                  : `
                    cursor-not-allowed
                    border-[#f1eee9]
                    text-[#d8d1ca]
                  `
              }
            `}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18L9 12L15 6" />
            </svg>
          </button>

          {/* NEXT ARROW */}

          <button
            type="button"
            onClick={nextSlide}
            disabled={!canGoNext}
            aria-label="Next destinations"
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              bg-white
              transition-all
              duration-300

              ${
                canGoNext
                  ? `
                    border-[#e8ded4]
                    text-slate-800
                    hover:bg-slate-50
                    hover:shadow-sm
                  `
                  : `
                    cursor-not-allowed
                    border-[#f1eee9]
                    text-[#d8d1ca]
                  `
              }
            `}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>

        </div>
      )}

      {/* =================================================
          VIEWPORT
      ================================================== */}

      <div
        ref={containerRef}
        className="w-full overflow-hidden"
      >

        {/* =================================================
            SLIDING TRACK
        ================================================== */}

        <div
          className="flex"
          style={{
            gap: `${gap}px`,
            transform: `translate3d(-${translateX}px, 0, 0)`,
            transition:
              "transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id ?? index}
              className="shrink-0"
              style={{
                width: `${cardWidth}px`,
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}