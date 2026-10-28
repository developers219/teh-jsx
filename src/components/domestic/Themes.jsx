import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, SlidersHorizontal } from "lucide-react";

import Heading from "../ui/Heading";
import DestinationCard from "../ui/DestinationCard";
import api from "../../services/api";
import { getDestinationsByTheme, getThemes } from "../../services/destination.service";

// Domestic category id (backend: /destinations/category/:id and /destinations/:categoryId/theme/:themeId)
const DOMESTIC_CATEGORY_ID = 1;

// ---------------------------------------------------------------------------
// Small reusable bits
// ---------------------------------------------------------------------------

// Chip row arrow
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
// Main component  (Themes filter + All destinations, in one section)
// ---------------------------------------------------------------------------

export default function Themes() {
  const [themes, setThemes] = useState([]);

  // null = no filter selected -> every destination is shown (default)
  const [activeTheme, setActiveTheme] = useState(null);

  const [allDestinations, setAllDestinations] = useState([]);
  const [allLoading, setAllLoading] = useState(true);
  const [allError, setAllError] = useState(false);

  const [themeDestinations, setThemeDestinations] = useState([]);
  const [themeLoading, setThemeLoading] = useState(false);
  const [themeError, setThemeError] = useState(false);

  const [chipNav, setChipNav] = useState({ atStart: true, atEnd: false });

  const chipTrackRef = useRef(null);
  const requestIdRef = useRef(0);
  const themeCacheRef = useRef(new Map()); // themeId -> destinations

  useDragScroll(chipTrackRef);

  // ---- chip scroll state --------------------------------------------------

  const updateChipNav = useCallback(() => {
    const el = chipTrackRef.current;

    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);

    setChipNav({
      atStart: el.scrollLeft <= 4,
      atEnd: maxScroll <= 0 || el.scrollLeft >= maxScroll - 4,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateChipNav);

    return () => window.removeEventListener("resize", updateChipNav);
  }, [updateChipNav]);

  useEffect(() => {
    updateChipNav();
  }, [themes, updateChipNav]);

  // ---- data ---------------------------------------------------------------

  // Themes (filter chips)
  useEffect(() => {
    let cancelled = false;

    async function fetchThemes() {
      try {
        const res = await getThemes();

        if (cancelled) return;

        setThemes(Array.isArray(res?.data) ? res.data : []);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch themes:", error);
        setThemes([]);
      }
    }

    fetchThemes();

    return () => {
      cancelled = true;
    };
  }, []);

  // All domestic destinations (default view)
  useEffect(() => {
    let cancelled = false;

    async function fetchAllDestinations() {
      try {
        setAllLoading(true);
        setAllError(false);

        const res = await api.get(
          `/destinations/category/${DOMESTIC_CATEGORY_ID}`,
        );

        if (cancelled) return;

        setAllDestinations(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch destinations:", error);
        setAllDestinations([]);
        setAllError(true);
      } finally {
        if (!cancelled) setAllLoading(false);
      }
    }

    fetchAllDestinations();

    return () => {
      cancelled = true;
    };
  }, []);

  // Destinations of one theme (latest request wins, results are cached)
  const loadThemeDestinations = useCallback(async (themeId) => {
    const requestId = ++requestIdRef.current;

    const cached = themeCacheRef.current.get(themeId);

    if (cached) {
      setThemeError(false);
      setThemeDestinations(cached);
      setThemeLoading(false);
      return;
    }

    try {
      setThemeLoading(true);
      setThemeError(false);

      const list = await getDestinationsByTheme(DOMESTIC_CATEGORY_ID, themeId);

      if (requestId !== requestIdRef.current) return;

      const safeList = Array.isArray(list) ? list : [];

      themeCacheRef.current.set(themeId, safeList);
      setThemeDestinations(safeList);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error("Failed to fetch destinations:", error);
      setThemeDestinations([]);
      setThemeError(true);
    } finally {
      if (requestId === requestIdRef.current) setThemeLoading(false);
    }
  }, []);

  // ---- actions ------------------------------------------------------------

  // Clear the selected theme -> show every destination again
  const resetFilter = () => {
    requestIdRef.current += 1; // ignore any theme request still in flight
    setActiveTheme(null);
  };

  const handleThemeClick = (id) => {
    // Clicking the selected chip again clears the filter -> all destinations
    if (id === activeTheme) {
      resetFilter();
      return;
    }

    setActiveTheme(id);
    loadThemeDestinations(id);
  };

  const scrollChips = (dir) => {
    chipTrackRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  // ---- what to show -------------------------------------------------------

  const isAll = activeTheme === null;
  const destinations = isAll ? allDestinations : themeDestinations;
  const isLoading = isAll ? allLoading : themeLoading;
  const hasError = isAll ? allError : themeError;

  const activeThemeName = isAll
    ? ""
    : (themes.find((theme) => theme.id === activeTheme)?.name ?? "");

  return (
    <section
      id="all-destinations"
      className="overflow-x-clip bg-white py-[clamp(2rem,5vw,4rem)]"
    >
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        <Heading
          heading="Explore destinations that"
          highlight="inspire"
          subheading="From serene beaches to majestic mountains, find places that match your vibe."
          className="mb-6 sm:mb-8"
        />

        {/* Theme filter chips (no "All" chip: nothing selected = all destinations) */}
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

          {/* Reset: only visible while a theme filter is selected */}
          {!isAll && (
            <button
              type="button"
              onClick={resetFilter}
              className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 py-2.5 font-inter text-[13.5px] font-medium text-slate-800 transition-colors duration-200 hover:border-slate-900"
            >
              <SlidersHorizontal size={16} />
              Reset
            </button>
          )}
        </div>

        {/* Header line */}
        <div className="mt-8 flex items-end justify-between border-b border-slate-200 pb-2 lg:mt-10">
          <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {isAll ? "All Destinations" : `${activeThemeName} Destinations`}
          </span>

          {!isLoading && !hasError && destinations.length > 0 && (
            <span className="font-inter text-sm text-slate-500">
              {destinations.length}{" "}
              {destinations.length === 1 ? "destination" : "destinations"}
            </span>
          )}
        </div>

        {/* Loading spinner */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-[320px] flex-col items-center justify-center gap-4"
          >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="font-inter text-sm font-medium text-slate-500">
              Loading destinations…
            </p>
          </div>
        )}

        {!isLoading && hasError && (
          <div className="mt-8 rounded-md border border-red-200 bg-red-50 p-8 text-center font-inter text-red-700">
            We could not load destinations right now. Please try again later.
          </div>
        )}

        {!isLoading && !hasError && destinations.length === 0 && (
          <div className="mt-8 rounded-md border border-slate-200 bg-white p-8 text-center font-inter text-slate-600">
            {isAll
              ? "No destinations are available yet."
              : "No destinations are available for this theme yet."}
          </div>
        )}

        {/* Destination grid: 5 cards in a row on desktop, every destination is shown */}
        {!isLoading && !hasError && destinations.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                category="dom"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}