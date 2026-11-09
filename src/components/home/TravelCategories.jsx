import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

import api from "../../services/api";
import Carousel from "../ui/Carousel";
import { Heading } from "../ui/Heading";

/* =========================================================
   FALLBACK DESTINATIONS
   Used only when the backend fails or returns nothing.
========================================================= */

const FALLBACK_DOMESTIC = [
  {
    name: "MANALI",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "KERALA",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "UDAIPUR",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "DARJEELING",
    image:
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?q=80&w=1170&auto=format&fit=crop",
  },
  {
    name: "AGRA",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85",
  },
];

const FALLBACK_INTERNATIONAL = [
  {
    name: "MALDIVES",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "DUBAI",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "THAILAND",
    image:
      "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "SINGAPORE",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "PARIS",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",
  },
];

// Shown only when the CMS sent no image for a destination
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=90";

// Background refresh: CMS me image/destination badalte hi live site par aa jaye
const REFRESH_MS = 60_000;

/* =========================================================
   HELPERS
========================================================= */

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

// Backend list (array, maybe wrapped) or null
function readList(result) {
  if (result.status !== "fulfilled") return null;

  const data = result.value?.data?.data;
  const list = Array.isArray(data)
    ? data
    : (data?.destinations ?? data?.items ?? null);

  return Array.isArray(list) && list.length > 0 ? list : null;
}

/* =========================================================
   DESTINATION CARD
   Height follows the width (aspect ratio), so the cards look
   right on every screen size.
========================================================= */

function DestinationTile({ destination, category }) {
  const name = getDestinationName(destination);

  // Fallback items have no slug -> open the category page
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

/* =========================================================
   ONE SECTION: HEADING + CAROUSEL
========================================================= */

function DestinationSection({
  heading,
  subheading,
  highlight,
  destinations,
  category,
}) {
  return (
    <div className="w-full">
      <Heading
        heading={heading}
        highlight={highlight}
        subheading={subheading}
        className="mb-2"
      />

      <Carousel
        items={destinations}
        desktopItems={5}
        tabletItems={3}
        mobileItems={2}
        gap={16}
        showArrows={true}
        arrowsVariant="top"
        renderItem={(destination) => (
          <DestinationTile destination={destination} category={category} />
        )}
      />
    </div>
  );
}

/* =========================================================
   LOADING SKELETON (same columns as the carousel: 2 / 3 / 5)
========================================================= */

function SectionSkeleton() {
  return (
    <div className="w-full">
      <Skeleton variant="text" width={280} height={48} />
      <Skeleton variant="text" width={220} height={28} className="mb-8" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            className={`!aspect-[3/4] !h-auto !rounded-xl sm:!rounded-2xl ${
              index >= 3 ? "hidden lg:block" : index >= 2 ? "hidden sm:block" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function TravelCategories() {
  const [domesticDestinations, setDomesticDestinations] =
    useState(FALLBACK_DOMESTIC);
  const [internationalDestinations, setInternationalDestinations] = useState(
    FALLBACK_INTERNATIONAL,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    // Applies one category. A failed background refresh keeps what is on screen.
    const applyList = (setter, result, fallback, silent, label) => {
      if (silent && result.status !== "fulfilled") return;

      const list = readList(result) ?? fallback;

      if (list !== fallback) {
        const noImage = list.filter((item) => !getCmsImage(item));

        if (noImage.length) {
          console.warn(
            `${label} destinations WITHOUT CMS image (default image shown):`,
            noImage,
          );
        }
      }

      // same data as before -> no re-render
      setter((previous) =>
        JSON.stringify(previous) === JSON.stringify(list) ? previous : list,
      );
    };

    const fetchDestinations = async ({ silent = false } = {}) => {
      // `_t` = throw-away param so browser / CDN can never serve an old copy
      const params = { _t: Date.now() };

      // 1 = Domestic, 2 = International
      const [domesticRes, internationalRes] = await Promise.allSettled([
        api.get("/destinations/category/1", {
          signal: controller.signal,
          params,
        }),
        api.get("/destinations/category/2", {
          signal: controller.signal,
          params,
        }),
      ]);

      if (controller.signal.aborted) return;

      applyList(
        setDomesticDestinations,
        domesticRes,
        FALLBACK_DOMESTIC,
        silent,
        "Domestic",
      );
      applyList(
        setInternationalDestinations,
        internationalRes,
        FALLBACK_INTERNATIONAL,
        silent,
        "International",
      );
    };

    (async () => {
      await fetchDestinations();

      if (!controller.signal.aborted) setIsLoading(false);
    })();

    // Live: refresh when the tab gets focus back and every REFRESH_MS
    const refresh = () => {
      if (document.visibilityState === "visible") {
        fetchDestinations({ silent: true });
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

  return (
    <section className="bg-white py-[clamp(2rem,5vw,4rem)] font-alex">
      <div className="mx-auto w-full max-w-7xl space-y-[clamp(1.6rem,5vw,4rem)] px-2 sm:px-4 lg:px-6 xl:px-0">
        {isLoading ? (
          <>
            <SectionSkeleton />
            <SectionSkeleton />
          </>
        ) : (
          <>
            {/* ===============================
                DOMESTIC
            ================================ */}

            <DestinationSection
              heading="India Your "
              highlight="Way"
              subheading="Handpicked Indian getaways for every mood and travel style."
              destinations={domesticDestinations}
              category="dom"
            />

            {/* ===============================
                INTERNATIONAL
            ================================ */}

            <DestinationSection
              heading="Around the "
              highlight="World"
              subheading="Explore the world. Collect moments. Create stories worth sharing."
              destinations={internationalDestinations}
              category="intl"
            />
          </>
        )}
      </div>
    </section>
  );
}

export default TravelCategories;