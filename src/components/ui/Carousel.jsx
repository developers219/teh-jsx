import { useEffect, useRef, useState } from "react";

export default function Carousel({
  items = [],
  renderItem,
  gap = 20,
  showArrows = true,
  desktopItems = 5,
  tabletItems = 2,
  mobileItems = 2,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const viewportRef = useRef(null);

  // -------------------------------------------------------
  // CHECK MOBILE SCREEN
  // -------------------------------------------------------

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  // -------------------------------------------------------
  // RESET POSITION WHEN ITEMS CHANGE
  // -------------------------------------------------------

  useEffect(() => {
    setCurrentIndex(0);

    if (viewportRef.current) {
      viewportRef.current.scrollLeft = 0;
    }
  }, [items.length]);

  // -------------------------------------------------------
  // NAVIGATION
  // -------------------------------------------------------

  const getVisibleItems = () => {
    if (typeof window === "undefined") return desktopItems;

    if (window.innerWidth < 640) {
      return mobileItems;
    }

    if (window.innerWidth < 1024) {
      return tabletItems;
    }

    return desktopItems;
  };

  const visibleItems = getVisibleItems();

  const maxIndex = Math.max(items.length - visibleItems, 0);

  const previousSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  // -------------------------------------------------------
  // MOBILE SCROLL
  // -------------------------------------------------------

  const handleMobileScroll = () => {
    if (!viewportRef.current) return;

    const viewport = viewportRef.current;

    const firstCard = viewport.firstElementChild;

    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;

    const index = Math.round(
      viewport.scrollLeft / (cardWidth + gap)
    );

    setCurrentIndex(index);
  };

  // -------------------------------------------------------
  // CARD WIDTH
  // -------------------------------------------------------

  const getCardWidth = () => {
    if (mobileItems === 1) {
      return "100%";
    }

    return `calc((100% - ${(mobileItems - 1) * gap}px) / ${mobileItems})`;
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <div className="w-full">

      {/* =================================================
          ARROWS
      ================================================== */}

      {showArrows && (
        <div className="flex justify-end gap-3">
          
          {/* PREVIOUS */}

          <button
            type="button"
            onClick={previousSlide}
            disabled={currentIndex === 0}
            aria-label="Previous"
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
                currentIndex > 0
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

          {/* NEXT */}

          <button
            type="button"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            aria-label="Next"
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
                currentIndex < maxIndex
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
        ref={viewportRef}
        onScroll={isMobile ? handleMobileScroll : undefined}
        className={`
          w-full
          ${
            isMobile
              ? `
                overflow-x-auto
                overflow-y-hidden
                snap-x
                snap-mandatory
                scroll-smooth
                touch-pan-x
                pb-3

                [&::-webkit-scrollbar]:h-1.5
                [&::-webkit-scrollbar-track]:bg-[#f1eee9]
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#b8afa6]

                scrollbar-thin
                scrollbar-track-[#f1eee9]
                scrollbar-thumb-[#b8afa6]
              `
              : "overflow-hidden"
          }
        `}
      >

        {/* =================================================
            SLIDING TRACK
        ================================================== */}

        <div
          className={`
            flex
            ${isMobile ? "" : "transition-transform duration-500 ease-out"}
            will-change-transform
            py-8
          `}
          style={{
            gap: `${gap}px`,

            ...(isMobile
              ? {}
              : {
                  transform: `
                    translateX(
                      calc(
                        -${currentIndex} *
                        (
                          (
                            100% -
                            ${(visibleItems - 1) * gap}px
                          ) /
                          ${visibleItems}
                          +
                          ${gap}px
                        )
                      )
                    )
                  `,
                }),
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id ?? index}
              className={`
                min-w-0
                shrink-0

                ${
                  isMobile
                    ? "snap-start"
                    : ""
                }
              `}
              style={{
                width: isMobile
                  ? getCardWidth()
                  : `calc(
                      (100% - ${(visibleItems - 1) * gap}px) /
                      ${visibleItems}
                    )`,
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          MOBILE SCROLL HINT
      ================================================== */}

      {/* {isMobile && items.length > mobileItems && (
        <div className="mt-1 flex justify-center">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Swipe to explore
          </div>
        </div>
      )} */}

    </div>
  );
}