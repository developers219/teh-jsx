import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Heading from "../ui/Heading";
import Carousel from "../ui/Carousel";
import api from "../../services/api";

// Shown only when the CMS sent no image for a destination
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=90";

// Background refresh: CMS me image/destination badalte hi live site par aa jaye
const REFRESH_MS = 60_000;

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

function DestinationTile({ destination, category = "dom" }) {
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

      <div className="relative flex min-h-[15%] w-full items-center justify-center break-words bg-linear-to-t from-black/30 to-transparent px-2 py-2 text-center text-sm font-semibold leading-tight text-white backdrop-blur-xs min-[400px]:text-base sm:text-lg lg:text-xl">
        {name}
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Trending() {
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const mobileScrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch trending (featured) domestic destinations
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
          (destination) => Number(destination.categoryId) === 1,
        );

        warnMissingImages(filtered, "Trending destinations");

        // same data as before -> no re-render
        setTrendingDestinations((previous) =>
          JSON.stringify(previous) === JSON.stringify(filtered)
            ? previous
            : filtered,
        );
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Failed to fetch trending destinations:", error);

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

  // Mobile / tablet scroll thumb
  useEffect(() => {
    const container = mobileScrollRef.current;

    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }

      setScrollProgress(container.scrollLeft / maxScroll);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [trendingDestinations]);

  return (
    <section className="overflow-x-clip bg-white py-[clamp(2rem,5vw,4rem)]">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        <Heading
          heading="Trending"
          highlight="destinations"
          subheading="Discover our most popular destinations and start planning your next journey."
          className="mb-4 sm:mb-6"
        />

        {/* Desktop carousel */}
        {!loading && trendingDestinations.length > 0 && (
          <div className="hidden lg:block">
            <Carousel
              items={trendingDestinations}
              desktopItems={4}
              tabletItems={2}
              mobileItems={1}
              gap={20}
              renderItem={(destination) => (
                <DestinationTile destination={destination} category="dom" />
              )}
            />
          </div>
        )}

        {/* Mobile + tablet: swipe row */}
        {!loading && trendingDestinations.length > 0 && (
          <div className="lg:hidden">
            <div
              ref={mobileScrollRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 sm:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {trendingDestinations.map((destination) => (
                <div
                  key={destination.id || destination._id}
                  className="w-[calc(50%-6px)] min-w-0 shrink-0 snap-start sm:w-[calc((100%-32px)/3)]"
                >
                  <DestinationTile destination={destination} category="dom" />
                </div>
              ))}
            </div>

            {trendingDestinations.length > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="relative h-[3px] w-[100px] overflow-hidden rounded-full bg-slate-200 sm:w-[120px]">
                  <div
                    className="absolute left-0 top-0 h-full w-[25%] rounded-full bg-slate-900"
                    style={{
                      transform: `translateX(${scrollProgress * 300}%)`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex gap-3 overflow-hidden sm:gap-4 lg:gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[300px] w-[calc(50%-6px)] shrink-0 animate-pulse rounded bg-slate-100 sm:w-[calc((100%-32px)/3)] lg:w-auto lg:flex-1"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && trendingDestinations.length === 0 && (
          <div className="py-10 text-center font-inter text-slate-500">
            No trending destinations available.
          </div>
        )}
      </div>
    </section>
  );
}