import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Heading from "../ui/Heading";
import DestinationCard from "../ui/DestinationCard";

import {
  getDestinationsByTheme,
  getThemes,
} from "../../services/destination.service";

// Domestic category id (same as the backend: /destinations/:categoryId/theme/:themeId)
const DOMESTIC_CATEGORY_ID = 1;

// DestinationCard width (243px) + gap between cards (20px)
const CARD_STEP = 243 + 20;

// ---------------------------------------------------------------------------
// Small reusable bits
// ---------------------------------------------------------------------------

// Carousel arrow — same design as the Home page (Explore by themes)
function NavButton({ direction = "left", onClick, disabled }) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className="hidden shrink-0 cursor-pointer rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition duration-300 hover:text-blue-200 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white lg:block"
    >
      <Icon size={18} />
    </button>
  );
}

function CategoryChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 py-2.5",
        "font-inter text-[13.5px] font-medium transition-colors duration-200",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-800 hover:border-slate-900",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// Mouse drag to scroll (desktop)
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
      el.scrollLeft = scrollStart - (e.pageX - startX);
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [ref]);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Themes() {
  const [themes, setThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [chipNav, setChipNav] = useState({ atStart: true, atEnd: false });
  const [cardNav, setCardNav] = useState({ atStart: true, atEnd: false });
  const [cardProgress, setCardProgress] = useState(0);

  const chipTrackRef = useRef(null);
  const cardTrackRef = useRef(null);
  const requestIdRef = useRef(0);

  useDragScroll(chipTrackRef);
  useDragScroll(cardTrackRef);

  // ---- scroll state -------------------------------------------------------

  const updateChipNav = useCallback(() => {
    const el = chipTrackRef.current;

    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);

    setChipNav({
      atStart: el.scrollLeft <= 4,
      atEnd: maxScroll <= 0 || el.scrollLeft >= maxScroll - 4,
    });
  }, []);

  const updateCardNav = useCallback(() => {
    const el = cardTrackRef.current;

    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);

    setCardProgress(
      maxScroll > 0 ? Math.min(1, Math.max(0, el.scrollLeft / maxScroll)) : 0,
    );

    setCardNav({
      atStart: el.scrollLeft <= 4,
      atEnd: maxScroll <= 0 || el.scrollLeft >= maxScroll - 4,
    });
  }, []);

  useEffect(() => {
    const onResize = () => {
      updateChipNav();
      updateCardNav();
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [updateChipNav, updateCardNav]);

  // ---- data ---------------------------------------------------------------

  // Destinations of one theme (latest request wins)
  const loadDestinations = useCallback(async (themeId) => {
    const requestId = ++requestIdRef.current;

    try {
      setIsLoading(true);

      const list = await getDestinationsByTheme(DOMESTIC_CATEGORY_ID, themeId);

      if (requestId !== requestIdRef.current) return;

      setDestinations(Array.isArray(list) ? list : []);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error("Failed to fetch destinations:", error);
      setDestinations([]);
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  // Themes + destinations of the first theme
  useEffect(() => {
    let cancelled = false;

    async function fetchThemes() {
      try {
        const res = await getThemes();

        if (cancelled) return;

        const list = Array.isArray(res?.data) ? res.data : [];

        setThemes(list);

        if (list.length > 0) {
          setActiveTheme(list[0].id);
          loadDestinations(list[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch themes:", error);
        setThemes([]);
        setIsLoading(false);
      }
    }

    fetchThemes();

    return () => {
      cancelled = true;
    };
  }, [loadDestinations]);

  // New themes -> refresh chip arrows
  useEffect(() => {
    updateChipNav();
  }, [themes, updateChipNav]);

  // New destinations -> start from the first card
  useEffect(() => {
    cardTrackRef.current?.scrollTo({ left: 0 });
    updateCardNav();
  }, [destinations, isLoading, updateCardNav]);

  // ---- actions ------------------------------------------------------------

  const handleThemeClick = (id) => {
    if (id === activeTheme) return;

    setActiveTheme(id);
    loadDestinations(id);
  };

  const scrollChips = (dir) => {
    chipTrackRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const scrollCards = (dir) => {
    cardTrackRef.current?.scrollBy({
      left: dir * CARD_STEP * 2,
      behavior: "smooth",
    });
  };

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

  // Nothing to show (no themes from backend)
  if (!isLoading && themes.length === 0) return null;

  return (
    <section className="overflow-x-clip bg-white py-[clamp(2rem,5vw,4rem)]">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        <Heading
          heading="Explore destinations that"
          highlight="inspire"
          subheading="From serene beaches to majestic mountains, find places that match your vibe."
          className="mb-6 sm:mb-8"
        />

        {/* Theme chips */}
        <div className="flex items-center gap-3">
          <NavButton
            direction="left"
            onClick={() => scrollChips(-1)}
            disabled={chipNav.atStart}
          />

          <div className="relative min-w-0 flex-1">
            <div
              ref={chipTrackRef}
              onScroll={updateChipNav}
              role="tablist"
              aria-label="Destination themes"
              className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {themes.map((theme) => (
                <div key={theme.id} className="shrink-0 snap-start">
                  <CategoryChip
                    label={theme.name}
                    active={theme.id === activeTheme}
                    onClick={() => handleThemeClick(theme.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <NavButton
            direction="right"
            onClick={() => scrollChips(1)}
            disabled={chipNav.atEnd}
          />
        </div>

        {/* Destinations header */}
        <div className="mt-8 flex items-end justify-between border-b border-slate-200 pb-2 lg:mt-10">
          <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Top Destinations
          </span>

          <div className="flex items-center gap-4">
            <a
              href="#all-destinations"
              className="hidden items-center gap-1.5 font-inter text-sm text-slate-900 transition-colors hover:text-slate-500 sm:inline-flex"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>

            <div className="hidden items-center gap-2 lg:flex">
              <NavButton
                direction="left"
                onClick={() => scrollCards(-1)}
                disabled={cardNav.atStart}
              />
              <NavButton
                direction="right"
                onClick={() => scrollCards(1)}
                disabled={cardNav.atEnd}
              />
            </div>
          </div>
        </div>

        {/* Loading spinner (same as ThemePackages) */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-[300px] flex-col items-center justify-center gap-4"
          >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="font-inter text-sm font-medium text-slate-500">
              Loading destinations…
            </p>
          </div>
        )}

        {!isLoading && destinations.length === 0 && (
          <div className="mt-8 rounded-md border border-slate-200 bg-white p-8 text-center font-inter text-slate-600">
            No destinations are available for this theme yet.
          </div>
        )}

        {/* Destination cards */}
        {!isLoading && destinations.length > 0 && (
          <div className="-mx-6 mt-8 px-6 lg:-mx-8 lg:px-8">
            <div
              ref={cardTrackRef}
              onScroll={updateCardNav}
              onKeyDown={onCardsKeyDown}
              tabIndex={0}
              aria-label="Destination cards, use arrow keys to navigate"
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
            >
              {destinations.map((destination) => (
                <div
                  key={destination.id}
                  className="w-[86%] shrink-0 snap-start sm:w-[72%] md:w-[62%] lg:w-auto"
                >
                  <DestinationCard destination={destination} />
                </div>
              ))}
            </div>

            {/* Mobile / tablet scroll thumb */}
            <div className="mt-5 flex justify-center lg:hidden">
              <div className="relative h-[3px] w-[100px] overflow-hidden rounded-full bg-slate-200 sm:w-[120px]">
                <div
                  className="absolute left-0 top-0 h-full w-[25%] rounded-full bg-slate-900"
                  style={{ transform: `translateX(${cardProgress * 300}%)` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}