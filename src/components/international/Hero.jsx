import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import RequestCallback from "../ui/RequestCallback";
import api from "../../services/api";

/* ---------------------------------------------------------------
   BACKEND
   Everything on this hero (text, fonts, colours, buttons, images)
   comes from the backend.  Request:
     GET /hero-sections?page=international
   Change HERO_ENDPOINT / HERO_PAGE if your endpoint is different.
   Anything the backend does not send falls back to the DEFAULTS below.
---------------------------------------------------------------- */
const HERO_ENDPOINT = "/page-heroes";
const HERO_PAGE = "international";

const DEFAULT_WHATSAPP_NUMBER = "919211215500";

const DEFAULTS = {
  title: "International Destinations",
  subtitle:
    "Discover the incredible beauty of India — from peaceful mountains and tropical beaches to royal cities, cultural escapes and unforgettable journeys.",
  callbackLabel: "Request a callback",
  whatsappLabel: "Chat With Us",
};

const DEFAULT_SLIDES = [
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=2200&q=90", // Santorini, Greece
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2200&q=90", // Dubai, UAE
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2200&q=90", // Kyoto, Japan
  "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=2200&q=90", // Bangkok, Thailand
];

const SLIDE_INTERVAL = 5000;

// WhatsApp logo as an outline icon (follows the button text colour)
function WhatsAppIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

/* ---------------------------------------------------------------
   READING + CLEANING THE BACKEND DATA
---------------------------------------------------------------- */

// First non-empty value of `keys` (also looks inside data.style / data.styles)
function readField(data, keys) {
  for (const source of [data, data?.style, data?.styles]) {
    if (!source || typeof source !== "object") continue;

    for (const key of keys) {
      const value = source[key];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return value;
      }
    }
  }

  return undefined;
}

const readText = (data, keys) => {
  const value = readField(data, keys);
  return value === undefined ? "" : String(value).trim();
};

// "#fff", "rgb(...)", "hsl(...)" or a colour name
function cleanColor(value) {
  const text = String(value ?? "").trim();

  return /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([\d\s.,%/-]+\)|[a-z]+)$/i.test(text)
    ? text
    : undefined;
}

// "Playfair Display" -> '"Playfair Display", serif'
function cleanFont(value, generic) {
  const text = String(value ?? "").trim();

  if (!/^[\w\s,'"-]{1,80}$/.test(text)) return undefined;

  return text.includes(",")
    ? text
    : `"${text.replace(/["']/g, "")}", ${generic}`;
}

// 48 / "48" / "48px" -> fluid size that shrinks on small screens; "3rem" is kept
function cleanFontSize(value) {
  const text = String(value ?? "").trim();
  const match = /^(\d+(?:\.\d+)?)(px)?$/i.exec(text);

  if (match) {
    const max = Number(match[1]);
    const min = Math.max(22, Math.round(max * 0.6));

    return `clamp(${min}px, ${(max / 12.8).toFixed(2)}vw, ${max}px)`;
  }

  return /^\d+(\.\d+)?(rem|em|vw)$/i.test(text) ? text : undefined;
}

function cleanWeight(value) {
  const text = String(value ?? "")
    .trim()
    .toLowerCase();

  return /^([1-9]00|bold|bolder|normal|lighter)$/.test(text) ? text : undefined;
}

// 0.6 or 60 -> 0.6
function cleanOpacity(value) {
  const number = Number(value);

  if (value === undefined || value === "" || Number.isNaN(number)) return null;

  return Math.min(Math.max(number > 1 ? number / 100 : number, 0), 1);
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

const IMAGE_LIST_KEYS = [
  "images",
  "slides",
  "backgroundImages",
  "bannerImages",
  "gallery",
  "media",
];
const IMAGE_SINGLE_KEYS = [
  "imageUrl",
  "image_url",
  "image",
  "backgroundImage",
  "bannerImage",
  "mediaUrl",
];
const VIDEO_FILE = /\.(mp4|webm|mov)(\?.*)?$/i;

function itemUrl(item) {
  if (typeof item === "string") return item.trim();

  if (item && typeof item === "object") {
    if (String(item.mediaType ?? item.type ?? "").toLowerCase() === "video") {
      return "";
    }

    return String(
      item.imageUrl ||
        item.image_url ||
        item.url ||
        item.src ||
        item.path ||
        item.image ||
        item.mediaUrl ||
        "",
    ).trim();
  }

  return "";
}

// Slider images from a list field or a single image field
function collectImages(data) {
  for (const key of IMAGE_LIST_KEYS) {
    if (!Array.isArray(data?.[key])) continue;

    const urls = [...data[key]]
      .sort((a, b) => Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0))
      .map(itemUrl)
      .filter((url) => url && !VIDEO_FILE.test(url))
      .map(toAbsoluteUrl);

    if (urls.length) return urls;
  }

  for (const key of IMAGE_SINGLE_KEYS) {
    const url = itemUrl(data?.[key]);

    if (url && !VIDEO_FILE.test(url)) return [toAbsoluteUrl(url)];
  }

  return [];
}

// Backend record -> the values this hero uses
function normalizeHero(data) {
  return {
    title: readText(data, ["title", "heading", "headline"]),
    subtitle: readText(data, [
      "subtitle",
      "subheading",
      "subheadline",
      "description",
    ]),
    callbackLabel: readText(data, [
      "callbackLabel",
      "callbackButtonText",
      "primaryButtonText",
      "primaryButtonLabel",
      "callLabel",
    ]),
    whatsappLabel: readText(data, [
      "whatsappLabel",
      "whatsappButtonText",
      "secondaryButtonText",
      "secondaryButtonLabel",
    ]),
    whatsappNumber: readText(data, [
      "whatsappNumber",
      "whatsapp",
      "whatsappPhone",
    ]).replace(/\D/g, ""),

    titleFont: cleanFont(
      readField(data, [
        "titleFont",
        "headingFont",
        "headlineFont",
        "titleFontFamily",
        "headingFontFamily",
        "fontFamily",
        "font",
      ]),
      "serif",
    ),
    titleSize: cleanFontSize(
      readField(data, [
        "titleSize",
        "headingSize",
        "titleFontSize",
        "headingFontSize",
        "fontSize",
      ]),
    ),
    titleWeight: cleanWeight(
      readField(data, [
        "titleWeight",
        "headingWeight",
        "titleFontWeight",
        "fontWeight",
      ]),
    ),
    titleColor: cleanColor(
      readField(data, ["titleColor", "headingColor", "textColor", "color"]),
    ),

    subtitleFont: cleanFont(
      readField(data, [
        "subtitleFont",
        "subheadingFont",
        "descriptionFont",
        "subtitleFontFamily",
      ]),
      "sans-serif",
    ),
    subtitleSize: cleanFontSize(
      readField(data, [
        "subtitleSize",
        "subheadingSize",
        "descriptionSize",
        "subtitleFontSize",
      ]),
    ),
    subtitleColor: cleanColor(
      readField(data, ["subtitleColor", "subheadingColor", "descriptionColor"]),
    ),

    callbackBg: cleanColor(
      readField(data, [
        "callbackBgColor",
        "callbackButtonColor",
        "primaryButtonColor",
        "primaryButtonBg",
      ]),
    ),
    callbackText: cleanColor(
      readField(data, ["callbackTextColor", "primaryButtonTextColor"]),
    ),
    whatsappBg: cleanColor(
      readField(data, [
        "whatsappBgColor",
        "whatsappButtonColor",
        "secondaryButtonColor",
        "secondaryButtonBg",
      ]),
    ),
    whatsappText: cleanColor(
      readField(data, ["whatsappTextColor", "secondaryButtonTextColor"]),
    ),

    overlay: cleanOpacity(readField(data, ["overlayOpacity", "overlay"])),
    images: collectImages(data),
  };
}

// Picks the international record out of the response (object or list)
const PAGE_KEYS = [
  "page",
  "pageName",
  "pageSlug",
  "slug",
  "key",
  "type",
  "section",
  "target",
];

const matchesPage = (item) =>
  PAGE_KEYS.some(
    (key) =>
      typeof item?.[key] === "string" &&
      item[key].toLowerCase().includes(HERO_PAGE),
  );

const hasPageMarker = (item) =>
  PAGE_KEYS.some(
    (key) => typeof item?.[key] === "string" && item[key].trim() !== "",
  );

function pickHeroRecord(data) {
  const list = (Array.isArray(data) ? data : data ? [data] : []).filter(
    (item) => item && typeof item === "object" && item.status !== "inactive",
  );

  const match = list.find(matchesPage);

  if (match) return match;

  // single record with no page marker -> trust the endpoint
  if (!Array.isArray(data) && list[0] && !hasPageMarker(list[0])) {
    return list[0];
  }

  return null;
}

// Loads a Google font when the backend asks for one (system fonts are skipped)
const SYSTEM_FONTS =
  /^(arial|helvetica|times new roman|times|georgia|verdana|tahoma|courier new|serif|sans-serif|monospace|cursive|system-ui|inter|cormorant garamond|montserrat)$/i;

function useGoogleFonts(fonts) {
  const key = fonts.filter(Boolean).join("|");

  useEffect(() => {
    key.split("|").forEach((stack) => {
      const name = stack.split(",")[0].replace(/["']/g, "").trim();

      if (!name || SYSTEM_FONTS.test(name)) return;

      const id = `hero-font-${name.replace(/\W+/g, "-").toLowerCase()}`;

      if (document.getElementById(id)) return;

      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
        name,
      ).replace(/%20/g, "+")}&display=swap`;
      document.head.appendChild(link);
    });
  }, [key]);
}

/*
 * International hero: same UI as before, but fully driven by the backend.
 *  - heading / subtitle text, fonts, sizes, colours
 *  - the two button labels + colours + WhatsApp number
 *  - the slider images
 * Buttons stay side by side on every screen size.
 */
export default function Hero() {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState("right");

  const [hero, setHero] = useState(null); // null = nothing from backend
  const [isLoading, setIsLoading] = useState(true);

  // ---- backend ----
  useEffect(() => {
    const controller = new AbortController();

    const loadHero = async ({ silent = false } = {}) => {
      try {
        const res = await api.get(HERO_ENDPOINT, {
          signal: controller.signal,
          // throw-away param: browser / CDN can never answer from old cache
          params: { page: HERO_PAGE, _t: Date.now() },
        });

        if (controller.signal.aborted) return;

        const record = pickHeroRecord(res.data?.data ?? res.data);

        if (!record) {
          console.warn(
            `Hero: no "${HERO_PAGE}" record in the response of ${HERO_ENDPOINT}, default content is shown. Response:`,
            res.data,
          );
        }

        const next = record ? normalizeHero(record) : null;

        // same data as before -> no re-render
        setHero((previous) =>
          JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
        );
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        console.error("Hero could not be loaded:", error);

        // a failed background refresh keeps what is on screen
        if (!silent) setHero(null);
      } finally {
        if (!controller.signal.aborted && !silent) setIsLoading(false);
      }
    };

    loadHero();

    // Latest backend content when the tab gets focus back
    const refresh = () => {
      if (document.visibilityState === "visible") loadHero({ silent: true });
    };

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      controller.abort();
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useGoogleFonts([hero?.titleFont, hero?.subtitleFont]);

  // ---- slider ----
  const slides = hero?.images?.length ? hero.images : DEFAULT_SLIDES;
  const current = activeSlide % slides.length;

  // Auto change every 5 seconds (direction alternates right / left)
  useEffect(() => {
    if (slides.length < 2) return undefined;

    const interval = setInterval(() => {
      setDirection((prev) => (prev === "right" ? "left" : "right"));
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    if (index === current) return;

    setDirection(index > current ? "right" : "left");
    setActiveSlide(index);
  };

  // Backend still loading: empty dark hero (no flash of default text)
  if (isLoading) {
    return (
      <section
        aria-busy="true"
        className="relative min-h-[26rem] overflow-hidden bg-slate-950 px-6 pb-8 pt-44 lg:px-8"
      />
    );
  }

  const title = hero?.title || DEFAULTS.title;
  const subtitle = hero?.subtitle || DEFAULTS.subtitle;
  const callbackLabel = hero?.callbackLabel || DEFAULTS.callbackLabel;
  const whatsappLabel = hero?.whatsappLabel || DEFAULTS.whatsappLabel;
  const whatsappNumber = hero?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;

  const hasOverlayValue = hero?.overlay !== null && hero?.overlay !== undefined;

  const buttonBase =
    "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 py-3.5 text-center font-inter text-[11px] font-semibold leading-tight text-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-1 min-[360px]:text-xs min-[400px]:px-3 min-[400px]:text-[13px] sm:w-64 sm:flex-none sm:gap-2 sm:px-7 sm:text-sm";

  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 pb-8 pt-44 text-white lg:px-8">
      {/* Background slides (only the image moves) */}
      {slides.map((image, index) => {
        const isActive = index === current;

        return (
          <div
            key={`${image}-${index}`}
            aria-hidden="true"
            className={`absolute inset-0 overflow-hidden transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isActive
                ? "z-10 translate-x-0"
                : direction === "right"
                  ? "z-0 -translate-x-full"
                  : "z-0 translate-x-full"
            }`}
          >
            <img
              src={image}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        );
      })}

      {/* Dark overlay so text stays readable (opacity can come from the backend) */}
      <div
        className={`absolute inset-0 z-20 ${
          hasOverlayValue
            ? ""
            : "bg-gradient-to-t from-black/70 via-black/50 to-black/60"
        }`}
        style={
          hasOverlayValue
            ? { backgroundColor: `rgba(0,0,0,${hero.overlay})` }
            : undefined
        }
      />

      <div className="relative z-30 mx-auto max-w-7xl">
        <h1
          className="mt-4 min-h-[1.25em] max-w-3xl break-words font-cg text-4xl font-bold capitalize sm:text-5xl"
          style={{
            fontFamily: hero?.titleFont,
            fontSize: hero?.titleSize,
            fontWeight: hero?.titleWeight,
            color: hero?.titleColor,
          }}
        >
          {title}
        </h1>

        <p
          className="mt-4 max-w-2xl font-inter text-base leading-7 text-slate-200 sm:text-lg sm:leading-8"
          style={{
            fontFamily: hero?.subtitleFont,
            fontSize: hero?.subtitleSize,
            color: hero?.subtitleColor,
          }}
        >
          {subtitle}
        </p>

        {/* Two buttons: always side by side, on every screen size */}
        <div className="mt-6 flex items-stretch gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsCallbackOpen(true)}
            className={`${buttonBase} cursor-pointer bg-white hover:bg-slate-100`}
            style={{
              backgroundColor: hero?.callbackBg,
              color: hero?.callbackText,
            }}
          >
            <Phone
              size={16}
              strokeWidth={2}
              className="size-3.5 shrink-0 min-[400px]:size-4"
            />
            {callbackLabel}
          </button>

          {/* WhatsApp button */}
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonBase} bg-yellow-400 hover:bg-yellow-300`}
            style={{
              backgroundColor: hero?.whatsappBg,
              color: hero?.whatsappText,
            }}
          >
            <span className="shrink-0 [&>svg]:size-4 min-[400px]:[&>svg]:size-[18px]">
              <WhatsAppIcon size={18} />
            </span>
            {whatsappLabel}
          </a>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
          {slides.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Show destination image ${index + 1}`}
              className={`cursor-pointer rounded-full transition-all duration-500 ${
                current === index
                  ? "h-1.5 w-7 bg-white"
                  : "h-1.5 w-1.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

      <RequestCallback isOpen={isCallbackOpen} setIsOpen={setIsCallbackOpen} />
    </section>
  );
}
