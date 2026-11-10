import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Heading } from "../ui/Heading";
import api from "../../services/api";

// Shown only when the CMS sent no image for a destination
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=90";

// Background refresh: CMS me image/destination badalte hi live site par aa jaye
const REFRESH_MS = 60_000;

// Same gap as HomeThemes / ExploreByPeople
const GAP = "clamp(0.25rem,2vw,1rem)";

// Cards visible in one row: mobile 2, tablet 3, desktop 4
function getVisibleSlides() {
  if (typeof window === "undefined") return 4;

  const width = window.innerWidth;

  if (width < 640) return 2;
  if (width < 1024) return 3;
  return 4;
}

// ---------------------------------------------------------------------------
// Image helpers (same logic as home TravelCategories / Themes)
// ---------------------------------------------------------------------------

function getDestinationName(destination) {
  return (
    destination?.name ||
    destination?.title ||
    destination?.destinationName ||
    destination?.city ||
    "Destination"
  );
}

/* ---------------------------------------------------------
   Finds the image of a backend destination, whatever the
   field is called or however it is nested:
     imageUrl / image / images[0].imageUrl / banner: { url } ...
   Anything that looks like an image link is picked up.
--------------------------------------------------------- */

const IMAGE_FILE = /\.(png|jpe?g|webp|avif|gif|svg)(\?.*)?$/i;
const IMAGE_KEY_HINT = /image|img|photo|picture|banner|cover|thumb|hero|media/i;
const KNOWN_KEYS = [
  "images",
  "imageUrl",
  "image_url",
  "image",
  "thumbnail",
  "bannerImage",
  "banner",
  "coverImage",
  "cover_image",
  "photo",
  "picture",
];

const looksLikeUrl = (text) =>
  /^(https?:)?\/\//i.test(text) ||
  text.startsWith("/") ||
  text.startsWith("data:image");

const keyRank = (key) => {
  const index = KNOWN_KEYS.indexOf(key);
  return index === -1 ? 99 : index;
};

const isPrimary = (item) =>
  Boolean(
    item &&
      typeof item === "object" &&
      (item.isPrimary ||
        item.isMain ||
        item.isCover ||
        item.isDefault ||
        item.primary),
  );

function findImage(value, depth = 0, keyHint = false) {
  if (value === null || value === undefined || depth > 3) return "";

  if (typeof value === "string") {
    const text = value.trim();

    if (!text) return "";
    if (IMAGE_FILE.test(text)) return text;

    // link without a file extension: only trusted under an "image"-like key
    return keyHint && looksLikeUrl(text) ? text : "";
  }

  if (Array.isArray(value)) {
    const ordered = [...value].sort(
      (a, b) => Number(isPrimary(b)) - Number(isPrimary(a)),
    );

    for (const item of ordered) {
      const url = findImage(item, depth + 1, keyHint);
      if (url) return url;
    }

    return "";
  }

  if (typeof value === "object") {
    const entries = Object.entries(value).sort(
      ([a], [b]) => keyRank(a) - keyRank(b),
    );

    for (const [key, child] of entries) {
      const url = findImage(child, depth + 1, keyHint || IMAGE_KEY_HINT.test(key));
      if (url) return url;
    }
  }

  return "";
}

// "/uploads/a.jpg" -> "https://<cms-domain>/uploads/a.jpg"
function toAbsoluteUrl(url) {
  if (!url || /^(https?:)?\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  try {
    return new URL(url, new URL(api.defaults.baseURL).origin).href;
  } catch {
    return url;
  }
}

// Image sent by the CMS ("" when there is none)
function getCmsImage(destination) {
  return toAbsoluteUrl(findImage(destination));
}

function getDestinationImage(destination) {
  return getCmsImage(destination) || DEFAULT_IMAGE;
}

// Backend data (array, or wrapped in { destinations } / { items }) -> array
function toList(data) {
  if (Array.isArray(data)) return data;

  const wrapped = data?.destinations ?? data?.items;

  return Array.isArray(wrapped) ? wrapped : [];
}

function warnMissingImages(list, label) {
  const noImage = list.filter((item) => !getCmsImage(item));

  if (noImage.length) {
    console.warn(
      `${label} WITHOUT CMS image (default image shown):`,
      noImage,
    );
  }
}

// ---------------------------------------------------------------------------
// Destination card (aspect ratio keeps it right on every screen size)
// ---------------------------------------------------------------------------

function DestinationTile({ destination, category = "intl" }) {
  const name = getDestinationName(destination);

  const path = destination?.slug
    ? `/destinations/${category}/${destination.slug}`
    : `/destinations/${category}`;

  return (
    <Link
      to={path}
      className="group relative flex aspect-[3/4] w-full cursor-pointer items-end overflow-hidden rounded-xl shadow-sm sm:rounded-2xl"
    >
      <img
        src={getDestinationImage(destination)}
        alt={name}
        loading="lazy"
        draggable={false}
        onError={(e) => {
          // CMS link broken -> default image instead of a broken icon
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_IMAGE;
        }}
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-115"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/30 to-transparent" />

      {/* Destination name: fluid size, 14px (phones) -> 20px (large screens) */}
      <div className="relative flex min-h-[15%] w-full items-center justify-center break-words bg-linear-to-t from-black/30 to-transparent px-2 py-2 text-center font-alex text-[clamp(0.875rem,1.8vw,1.25rem)] font-bold leading-tight text-white backdrop-blur-xs">
        {name}
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main component  (carousel: same engine as HomeThemes / ExploreByPeople)
// ---------------------------------------------------------------------------

export default function Trending() {
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewSlides, setViewSlides] = useState(getVisibleSlides);
  const [step, setStep] = useState(0);

  const trackRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);

  // Fetch trending (featured) international destinations
  useEffect(() => {
    const controller = new AbortController();

    // silent = true -> spinner / empty state nahi dikhata (background refresh)
    const fetchTrendingDestinations = async ({ silent = false } = {}) => {
      try {
        if (!silent) setLoading(true);

        const res = await api.get("/destinations/featured", {
          signal: controller.signal,
          // `_t` = throw-away param so browser / CDN can never serve an old copy
          params: { _t: Date.now() },
        });

        if (controller.signal.aborted) return;

        const filtered = toList(res.data?.data).filter(
          (destination) => Number(destination.categoryId) === 2,
        );

        warnMissingImages(filtered, "Trending international destinations");

        // same data as before -> no re-render
        setTrendingDestinations((previous) =>
          JSON.stringify(previous) === JSON.stringify(filtered)
            ? previous
            : filtered,
        );
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error(
          "Failed to fetch trending international destinations:",
          error,
        );

        // A failed background refresh keeps what is already on screen
        if (!silent) setTrendingDestinations([]);
      } finally {
        if (!silent && !controller.signal.aborted) setLoading(false);
      }
    };

    fetchTrendingDestinations();

    // Live: refresh when the tab gets focus back and every REFRESH_MS
    const refresh = () => {
      if (document.visibilityState === "visible") {
        fetchTrendingDestinations({ silent: true });
      }
    };

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, REFRESH_MS);

    return () => {
      controller.abort();
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      window.clearInterval(timer);
    };
  }, []);

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => setViewSlides(getVisibleSlides());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cards per row depend ONLY on the screen (mobile 2 / tablet 3 / desktop 4).
  // With few destinations the cards keep the same size (they do not stretch).
  const visibleSlides = viewSlides;
  const maxIndex = Math.max(trendingDestinations.length - visibleSlides, 0);

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
  }, [trendingDestinations.length, visibleSlides, loading]);

  // Keep the active slide valid when the layout changes
  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const next = () => setActiveIndex((current) => Math.min(current + 1, maxIndex));
  const prev = () => setActiveIndex((current) => Math.max(current - 1, 0));

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

  const cardStyle = {
    flex: "0 0 auto",
    width: `calc((100% - ${visibleSlides - 1} * ${GAP}) / ${visibleSlides})`,
  };

  return (
    <section className="overflow-x-clip bg-white py-[clamp(2rem,5vw,4rem)]">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        {/* Heading + arrows: exactly like HomeThemes.
            Arrows are positioned absolutely, so they never add any height. */}
        <div className="relative">
          <Heading
            compact
            heading="Trending"
            highlight="destinations"
            subheading="Discover our most popular destinations and start planning your next journey."
          />

          {!loading && maxIndex > 0 && (
            <div className="absolute bottom-0 right-0 flex gap-[clamp(0.25rem,2vw,0.5rem)]">
              <button
                type="button"
                onClick={prev}
                disabled={activeIndex === 0}
                aria-label="Previous destinations"
                className="cursor-pointer rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition duration-300 hover:text-blue-200 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={next}
                disabled={activeIndex >= maxIndex}
                aria-label="Next destinations"
                className="cursor-pointer rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition duration-300 hover:text-blue-200 disabled:cursor-default disabled:opacity-40 disabled:hover:text-white"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Loading skeleton (single row) */}
        {loading && (
          <div className="flex" style={{ gap: GAP }}>
            {Array.from({ length: viewSlides }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: "0 0 auto",
                  width: `calc((100% - ${viewSlides - 1} * ${GAP}) / ${viewSlides})`,
                }}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {/* Carousel viewport */}
        {!loading && trendingDestinations.length > 0 && (
          <div
            className="-mx-2 overflow-x-clip px-2 sm:-mx-4 sm:px-4 lg:-mx-6 lg:px-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              animate={{ x: -(activeIndex * step) }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div ref={trackRef} className="flex" style={{ gap: GAP }}>
                {trendingDestinations.map((destination) => (
                  <div
                    key={destination.id || destination._id}
                    style={cardStyle}
                  >
                    <DestinationTile destination={destination} category="intl" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Empty state */}
        {!loading && trendingDestinations.length === 0 && (
          <div className="py-10 text-center font-inter text-[clamp(0.875rem,2vw,1rem)] text-slate-500">
            No trending destinations available.
          </div>
        )}
      </div>
    </section>
  );
}