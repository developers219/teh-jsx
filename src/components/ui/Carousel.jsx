import { useEffect, useState } from "react";

export default function Carousel({
  items = [],
  renderItem,
  gap = 20,
  showArrows = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // -------------------------------------------------------
  // RESET POSITION WHEN ITEMS CHANGE
  // -------------------------------------------------------

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  // -------------------------------------------------------
  // NAVIGATION
  // -------------------------------------------------------

  const previousSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <div className="w-full ">
      {/* =================================================
          ARROWS
      ================================================== */}

      {showArrows && (
        <div className=" flex justify-end gap-3">
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
            disabled={currentIndex >= items.length - 1}
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
                currentIndex < items.length - 1
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

      <div className="w-full overflow-hidden">
        {/* =================================================
            SLIDING GRID TRACK
        ================================================== */}

        <div
          className="
            grid
            grid-flow-col

            auto-cols-[100%]

            min-[640px]:auto-cols-[calc((100%-20px)/2)]

            min-[768px]:auto-cols-[calc((100%-40px)/3)]

           

            transition-transform
            duration-500
            ease-out
            will-change-transform py-8
          "
          style={{
            gap: `${gap}px`,

            /*
             * Move one complete card + gap.
             *
             * The responsive card widths above match
             * these calculations.
             */
            transform: `
              translateX(
                calc(
                  -${currentIndex} *
                  (
                    100% +
                    ${gap}px
                  )
                )
              )
            `,
          }}
        >
          {items.map((item, index) => (
            <div key={item.id ?? index} className="min-w-0 w-full">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
