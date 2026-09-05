import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({
  items = [],
  renderItem,
  desktopItems = 5,
  tabletItems = 2,
  mobileItems = 1,
  gap = 20,
}) => {
  const containerRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(desktopItems);

  // ---------------------------------------------
  // Get container width
  // ---------------------------------------------

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;

      setContainerWidth(width);

      if (window.innerWidth < 640) {
        setVisibleItems(mobileItems);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(tabletItems);
      } else {
        setVisibleItems(desktopItems);
      }
    };

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [
    desktopItems,
    tabletItems,
    mobileItems,
  ]);

  // ---------------------------------------------
  // Card width
  // ---------------------------------------------

  const cardWidth =
    containerWidth > 0
      ? (containerWidth - gap * (visibleItems - 1)) /
        visibleItems
      : 0;

  // ---------------------------------------------
  // Maximum index
  // ---------------------------------------------

  const maxIndex = Math.max(
    0,
    items.length - visibleItems
  );

  // ---------------------------------------------
  // Reset index when screen changes
  // ---------------------------------------------

  useEffect(() => {
    setCurrentIndex((prev) =>
      Math.min(prev, maxIndex)
    );
  }, [maxIndex]);

  // ---------------------------------------------
  // Navigation
  // ---------------------------------------------

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0;
      }

      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return maxIndex;
      }

      return prev - 1;
    });
  };

  // ---------------------------------------------
  // Empty state
  // ---------------------------------------------

  if (!items || items.length === 0) {
    return null;
  }

  // ---------------------------------------------
  // Transform
  // ---------------------------------------------

  const translateX =
    currentIndex * (cardWidth + gap);

  return (
    <div className="relative w-full">

      {/* Viewport */}

      <div
        ref={containerRef}
        className="w-full overflow-hidden"
      >

        {/* Track */}

        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            gap: `${gap}px`,
            transform: `translateX(-${translateX}px)`,
          }}
        >

          {items.map((item, index) => (

            <div
              key={
                item.id ||
                `${item.name}-${index}`
              }
              className="shrink-0"
              style={{
                width:
                  cardWidth > 0
                    ? `${cardWidth}px`
                    : `calc((100% - ${
                        gap * (visibleItems - 1)
                      }px) / ${visibleItems})`,
              }}
            >
              {renderItem(item, index)}
            </div>

          ))}

        </div>

      </div>


      {/* Navigation */}

      {items.length > visibleItems && (

        <div className="mt-5 flex justify-end gap-2">

          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous destinations"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition-all
              hover:bg-slate-900
              hover:text-white
            "
          >
            <ChevronLeft size={18} />
          </button>


          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next destinations"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition-all
              hover:bg-slate-900
              hover:text-white
            "
          >
            <ChevronRight size={18} />
          </button>

        </div>

      )}

    </div>
  );
};

export default Carousel;