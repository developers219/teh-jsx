import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import SectionHeader from "../home/SectionHeader";
import DestinationCard from "../ui/DestinationCard";

import {
  getDestinationsByTheme,
  getThemes,
} from "../../services/destination.service";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_WIDTH = 240;
const CARD_GAP = 20;

// ---------------------------------------------------------------------------
// Navigation Button
// ---------------------------------------------------------------------------

function NavButton({
  direction = "left",
  onClick,
  disabled,
  size = "md",
  className = "",
}) {
  const Icon =
    direction === "left"
      ? ChevronLeft
      : ChevronRight;

  const dims =
    size === "sm"
      ? "w-9 h-9"
      : "w-10 h-10";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        direction === "left"
          ? "Scroll left"
          : "Scroll right"
      }
      className={[
        dims,
        "shrink-0 flex items-center justify-center rounded-full",
        "bg-white border border-[#E3E1DC]",
        "transition-all duration-200 ease-out",
        disabled
          ? "opacity-35 cursor-default"
          : "hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_8px_20px_rgba(20,20,20,0.10)]",
        className,
      ].join(" ")}
    >
      <Icon
        className="w-4 h-4 text-[#141414]"
        strokeWidth={1.75}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Category Chip
// ---------------------------------------------------------------------------

function CategoryChip({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "relative shrink-0 inline-flex items-center",
        "pl-3.5 pr-4 py-2.5 rounded-full",
        "text-[13.5px] font-medium whitespace-nowrap",
        "border transition-colors duration-200",
        active
          ? "bg-beigeD text-text border-beigeD"
          : "bg-white text-[#141414] border-beige",
      ].join(" ")}
    >
      <span>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Draggable / Scrollable Track
// ---------------------------------------------------------------------------

function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    const onDown = (e) => {
      isDown = true;
      startX = e.pageX;
      scrollStart = el.scrollLeft;
    };

    const onUp = () => {
      isDown = false;
    };

    const onMove = (e) => {
      if (!isDown) return;

      el.scrollLeft =
        scrollStart -
        (e.pageX - startX);
    };

    el.addEventListener(
      "mousedown",
      onDown
    );

    window.addEventListener(
      "mouseup",
      onUp
    );

    window.addEventListener(
      "mousemove",
      onMove
    );

    return () => {
      el.removeEventListener(
        "mousedown",
        onDown
      );

      window.removeEventListener(
        "mouseup",
        onUp
      );

      window.removeEventListener(
        "mousemove",
        onMove
      );
    };
  }, [ref]);
}

// ---------------------------------------------------------------------------
// Scroll Thumb
// ---------------------------------------------------------------------------

function ScrollThumb({
  progress,
  mobileWidth = "w-[90px]",
  tabletWidth = "sm:w-[110px]",
  className = "",
}) {
  return (
    <div
      className={[
        "flex justify-center",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "relative h-[3px]",
          mobileWidth,
          tabletWidth,
          "overflow-hidden rounded-full bg-slate-200",
        ].join(" ")}
      >
        <div
          className="
            absolute
            left-0
            top-0
            h-full
            w-[25%]
            rounded-full
            bg-black
          "
          style={{
            transform: `translateX(${
              progress * 300
            }%)`,
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function Themes() {
  const [activeCategory, setActiveCategory] =
    useState(1);

  const [chipNav, setChipNav] = useState({
    atStart: true,
    atEnd: false,
  });

  const [cardNav, setCardNav] = useState({
    atStart: true,
    atEnd: false,
  });

  const [categories, setCategories] =
    useState(null);

  const [destinations, setDestinations] =
    useState(null);

  const [page, setPage] = useState(0);

  const [perPage, setPerPage] =
    useState(1);

  // -------------------------------------------------------------------------
  // Scroll Refs
  // -------------------------------------------------------------------------

  const chipTrackRef = useRef(null);
  const cardTrackRef = useRef(null);

  useDragScroll(chipTrackRef);
  useDragScroll(cardTrackRef);

  // -------------------------------------------------------------------------
  // Card Scroll Progress
  // -------------------------------------------------------------------------

  const [cardProgress, setCardProgress] =
    useState(0);

  // -------------------------------------------------------------------------
  // Category Navigation
  // -------------------------------------------------------------------------

  const updateChipNav = useCallback(() => {
    const el = chipTrackRef.current;

    if (!el) return;

    const maxScroll = Math.max(
      0,
      el.scrollWidth -
        el.clientWidth
    );

    setChipNav({
      atStart: el.scrollLeft <= 4,
      atEnd:
        maxScroll <= 0 ||
        el.scrollLeft >=
          maxScroll - 4,
    });
  }, []);

  // -------------------------------------------------------------------------
  // Destination Navigation
  // -------------------------------------------------------------------------

  const updateCardNav = useCallback(() => {
    const el = cardTrackRef.current;

    if (!el) return;

    const maxScroll = Math.max(
      0,
      el.scrollWidth -
        el.clientWidth
    );

    const progress =
      maxScroll > 0
        ? Math.min(
            1,
            Math.max(
              0,
              el.scrollLeft /
                maxScroll
            )
          )
        : 0;

    setCardProgress(progress);

    const step =
      CARD_WIDTH + CARD_GAP;

    const visible = Math.max(
      1,
      Math.round(
        el.clientWidth /
          step
      )
    );

    setPerPage(visible);

    setPage(
      Math.round(
        el.scrollLeft /
          (visible * step)
      )
    );

    setCardNav({
      atStart:
        el.scrollLeft <= 4,

      atEnd:
        maxScroll <= 0 ||
        el.scrollLeft >=
          maxScroll - 4,
    });
  }, []);

  // -------------------------------------------------------------------------
  // Resize
  // -------------------------------------------------------------------------

  useEffect(() => {
    updateChipNav();
    updateCardNav();

    const onResize = () => {
      updateChipNav();
      updateCardNav();
    };

    window.addEventListener(
      "resize",
      onResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        onResize
      );
    };
  }, [
    updateChipNav,
    updateCardNav,
  ]);

  // -------------------------------------------------------------------------
  // Fetch Themes + Initial International Destinations
  // -------------------------------------------------------------------------

  useEffect(() => {
    async function fetchThemes() {
      try {
        const res =
          await getThemes();

        setCategories(
          res.data
        );

        const res2 =
          await getDestinationsByTheme(
            2,
            7
          );

        setDestinations(
          res2
        );
      } catch (error) {
        console.error(
          "Failed to fetch themes:",
          error
        );

        setCategories([]);
        setDestinations([]);
      }
    }

    fetchThemes();

    const el =
      cardTrackRef.current;

    if (el) {
      el.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }

    updateCardNav();
  }, [updateCardNav]);

  // -------------------------------------------------------------------------
  // Scroll Categories
  // -------------------------------------------------------------------------

  const scrollChips = (dir) => {
    chipTrackRef.current?.scrollBy({
      left: dir * 220,
      behavior: "smooth",
    });
  };

  // -------------------------------------------------------------------------
  // Scroll Destinations
  // -------------------------------------------------------------------------

  const scrollCards = (dir) => {
    cardTrackRef.current?.scrollBy({
      left:
        dir *
        (CARD_WIDTH + CARD_GAP) *
        2,
      behavior: "smooth",
    });
  };

  // -------------------------------------------------------------------------
  // Keyboard Navigation
  // -------------------------------------------------------------------------

  const onCardsKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollCards(1);
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollCards(-1);
    }
  };

  // -------------------------------------------------------------------------
  // Category Selection
  // -------------------------------------------------------------------------

  const handleCategoryClick =
    async (id) => {
      try {
        setActiveCategory(id);

        const res =
          await getDestinationsByTheme(
            2,
            id
          );

        setDestinations(res);

        // Reset destination carousel
        requestAnimationFrame(() => {
          const el =
            cardTrackRef.current;

          if (el) {
            el.scrollTo({
              left: 0,
              behavior: "smooth",
            });
          }

          setCardProgress(0);

          setCardNav({
            atStart: true,
            atEnd: false,
          });

          updateCardNav();
        });
      } catch (error) {
        console.error(
          "Failed to fetch destinations:",
          error
        );

        setDestinations([]);
      }
    };

  // -------------------------------------------------------------------------
  // Pagination Calculation
  // -------------------------------------------------------------------------

  const pageCount = Math.max(
    1,
    Math.ceil(
      (destinations?.length ||
        0) / perPage
    )
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <section className="w-full bg-white px-5 sm:px-8 md:px-10 lg:px-16 font-sans text-[#141414]">
      <div className="mx-auto max-w-[1440px]">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <SectionHeader
          title="Explore destinations that inspire"
          description="From serene beaches to majestic mountains, find places that match your vibe."
        />

        {/* =====================================================
            CATEGORY CAROUSEL
        ====================================================== */}

        <div className="mt-7 lg:mt-8 flex items-start gap-3">

          {/* Desktop category arrow */}

          <NavButton
            direction="left"
            onClick={() =>
              scrollChips(-1)
            }
            disabled={
              chipNav.atStart
            }
            className="hidden lg:flex"
          />

          {/* Category Track */}

          <div className="relative min-w-0 flex-1">
            <div
              ref={chipTrackRef}
              onScroll={
                updateChipNav
              }
              role="tablist"
              aria-label="Destination categories"
              className="
                flex
                gap-2.5
                overflow-x-auto
                px-1
                py-1
                snap-x
                snap-mandatory
                overscroll-x-contain
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {categories?.map(
                (cat) => (
                  <div
                    key={cat.id}
                    className="
                      shrink-0
                      snap-start
                    "
                  >
                    <CategoryChip
                      label={
                        cat.name
                      }
                      active={
                        cat.id ===
                        activeCategory
                      }
                      onClick={() =>
                        handleCategoryClick(
                          cat.id
                        )
                      }
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Desktop category arrow */}

          <NavButton
            direction="right"
            onClick={() =>
              scrollChips(1)
            }
            disabled={
              chipNav.atEnd
            }
            className="hidden lg:flex"
          />
        </div>

        {/* =====================================================
            DESTINATIONS HEADER
        ====================================================== */}

        <div
          className="
            mt-8
            lg:mt-10
            flex
            items-end
            justify-between
            border-b
            border-[#E3E1DC]
            pb-2
          "
        >
          <span
            className="
              text-[11px]
              font-semibold
              tracking-[0.18em]
              uppercase
              text-[#8A877F]
            "
          >
            Top Destinations
          </span>

          <div className="flex items-center gap-4">

            {/* View All */}

            <a
              href="#"
              className="
                hidden
                sm:inline-flex
                items-center
                gap-1.5
                text-sm
                text-[#141414]
                transition-colors
                hover:text-[#8A877F]
              "
            >
              View all

              <ArrowRight
                className="w-3.5 h-3.5"
                strokeWidth={1.75}
              />
            </a>

            {/* Desktop destination arrows */}

            <div className="hidden lg:flex items-center gap-2">

              <NavButton
                direction="left"
                size="sm"
                onClick={() =>
                  scrollCards(-1)
                }
                disabled={
                  cardNav.atStart
                }
              />

              <NavButton
                direction="right"
                size="sm"
                onClick={() =>
                  scrollCards(1)
                }
                disabled={
                  cardNav.atEnd
                }
              />

            </div>
          </div>
        </div>

        {/* =====================================================
            DESTINATION CAROUSEL
        ====================================================== */}

        <div
          className="
            mt-8
            -mx-5
            sm:-mx-8
            md:-mx-10
            lg:-mx-16
            px-5
            sm:px-8
            md:px-10
            lg:px-16
          "
        >
          <div
            ref={cardTrackRef}
            onScroll={
              updateCardNav
            }
            onKeyDown={
              onCardsKeyDown
            }
            tabIndex={0}
            aria-label="Destination cards, use arrow keys to navigate"
            className="
              flex
              gap-4
              sm:gap-5
              overflow-x-auto
              py-2
              snap-x
              snap-mandatory
              overscroll-x-contain
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <AnimatePresence
              mode="popLayout"
              initial={false}
            >
              {destinations?.map(
                (destination) => (
                  <motion.div
                    key={
                      destination.id
                    }
                    className="
                      shrink-0
                      snap-start

                      w-[86%]

                      sm:w-[72%]

                      md:w-[62%]

                      lg:w-auto
                    "
                  >
                    <DestinationCard
                      destination={
                        destination
                      }
                    />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              DESTINATION SCROLL THUMB
          ================================================== */}

          <div className="mt-5 lg:hidden">
            <ScrollThumb
              progress={
                cardProgress
              }
              mobileWidth="w-[100px]"
              tabletWidth="sm:w-[120px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}