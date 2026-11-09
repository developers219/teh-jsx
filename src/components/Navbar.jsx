import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import Escapeora from "../assets/images/logo.png";
import api from "../services/api";

const CONTACT_PHONE_DISPLAY = "+91 92112 15500";
const CONTACT_PHONE_TEL = "+919211215500";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=200&q=70";

// key = state key / route segment, categoryId = backend category id
const NAV_LINKS = [
  {
    key: "dom",
    to: "/destinations/dom",
    label: "Domestic Destinations",
    categoryId: 1,
  },
  {
    key: "intl",
    to: "/destinations/intl",
    label: "International Destinations",
    categoryId: 2,
  },
];

/* ---------------- HELPERS ---------------- */

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

function warnMissingImages(list, label) {
  const noImage = list.filter((item) => !getCmsImage(item));

  if (noImage.length) {
    console.warn(`${label} WITHOUT CMS image (default image shown):`, noImage);
  }
}

function getDestinationPath(destination, category) {
  return destination?.slug
    ? `/destinations/${category}/${destination.slug}`
    : `/destinations/${category}`;
}

function pickList(result) {
  if (result.status !== "fulfilled") return [];
  const list = result.value?.data?.data;
  return Array.isArray(list) ? list : [];
}

/* ---------------- DROPDOWN LIST (desktop only) ---------------- */

function DestinationList({ items, category, onNavigate, loading }) {
  return (
    <div className="w-72 overflow-hidden rounded-2xl bg-black/80 text-white shadow-xl backdrop-blur-md">
      {/* 5 items visible (5 x 52px = 260px), baaki scroll */}
      <ul className="max-h-[260px] overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.4)_transparent]">
        {loading && (
          <li className="px-3 py-3 text-sm text-white/70">Loading...</li>
        )}

        {!loading && items.length === 0 && (
          <li className="px-3 py-3 text-sm text-white/70">
            No destinations available
          </li>
        )}

        {!loading &&
          items.map((destination, index) => {
            const name = getDestinationName(destination);

            return (
              <li key={destination?.id ?? destination?.slug ?? index}>
                <Link
                  to={getDestinationPath(destination, category)}
                  onClick={onNavigate}
                  className="flex h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  <img
                    src={getDestinationImage(destination)}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      // CMS link broken -> default image instead of a broken icon
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                  <span className="truncate">{name}</span>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

/* ---------------- NAVBAR ---------------- */

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // desktop hover dropdown: "dom" | "intl" | null
  const [activeMenu, setActiveMenu] = useState(null);

  const [destinations, setDestinations] = useState({ dom: [], intl: [] });
  const [isLoadingDest, setIsLoadingDest] = useState(true);

  const closeTimer = useRef(null);
  const navRef = useRef(null);
  const { pathname } = useLocation();

  // /packages/<slug> (package details) par navbar hamesha compact rahe
  const keepCompact = /^\/packages\/[^/]+\/?$/.test(pathname);
  const isCompact = isScrolled || keepCompact;

  // navbar ki asli height CSS variable me (pages isse spacer set karte hain)
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const update = () =>
      document.documentElement.style.setProperty(
        "--nav-height",
        `${el.offsetHeight}px`,
      );

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  /* scroll effect */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* backend se destinations (same as TravelCategories) */
  useEffect(() => {
    const controller = new AbortController();

    // silent = true -> background refresh (menu me jo hai wahi rehta hai)
    const fetchDestinations = async ({ silent = false } = {}) => {
      // `_t` = throw-away param so browser / CDN can never serve an old copy
      const params = { _t: Date.now() };

      const [domRes, intlRes] = await Promise.allSettled([
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

      if (!silent) {
        warnMissingImages(pickList(domRes), "Navbar domestic destinations");
        warnMissingImages(pickList(intlRes), "Navbar international destinations");
      }

      setDestinations((previous) => {
        const next = {
          // a failed background refresh keeps what is already in the menu
          dom:
            silent && domRes.status !== "fulfilled"
              ? previous.dom
              : pickList(domRes),
          intl:
            silent && intlRes.status !== "fulfilled"
              ? previous.intl
              : pickList(intlRes),
        };

        // same data as before -> no re-render
        return JSON.stringify(previous) === JSON.stringify(next)
          ? previous
          : next;
      });

      setIsLoadingDest(false);
    };

    fetchDestinations();

    // Latest CMS data when the tab gets focus back
    const refresh = () => {
      if (document.visibilityState === "visible") {
        fetchDestinations({ silent: true });
      }
    };

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      controller.abort();
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  /* hover handlers (chhota delay taaki mouse move karte time dropdown band na ho) */
  const openMenu = (key) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(key);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const closeAll = () => {
    clearTimeout(closeTimer.current);
    setActiveMenu(null);
    setIsOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-40 w-full font-eb text-white transition-all duration-300 ${
        isCompact
          ? "bg-black/70 py-3 shadow-lg backdrop-blur-md"
          : "bg-linear-to-b from-black/70 via-black/30 to-transparent py-3"
      }`}
    >
      <div className="relative mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-0">
        <div className="flex w-full items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={closeAll} className="shrink-0">
            <img
              src={Escapeora}
              alt="Escapeora"
              className="w-28 object-contain sm:w-32 md:w-40"
            />
          </Link>

          {/* Desktop navigation (hover dropdown only here) */}
          <ul className="hidden items-center gap-[clamp(0.25rem,2vw,2rem)] rounded-full bg-black/30 px-8 py-3 font-bold backdrop-blur-sm lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeMenu === link.key;

              return (
                <li
                  key={link.key}
                  className="relative"
                  onMouseEnter={() => openMenu(link.key)}
                  onMouseLeave={scheduleClose}
                  onFocus={() => openMenu(link.key)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      scheduleClose();
                    }
                  }}
                >
                  <Link
                    to={link.to}
                    onClick={closeAll}
                    className="cursor-pointer text-sm transition-opacity hover:opacity-70"
                    aria-haspopup="true"
                    aria-expanded={isActive}
                  >
                    {link.label}
                  </Link>

                  {/* Dropdown (pt-4 ek invisible bridge hai, hover break nahi hota) */}
                  {isActive && (
                    <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4">
                      <DestinationList
                        items={destinations[link.key]}
                        category={link.key}
                        onNavigate={closeAll}
                        loading={isLoadingDest}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="hidden cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-black/30 px-8 py-3 text-sm font-bold backdrop-blur-sm transition duration-300 hover:bg-black/50 lg:flex"
          >
            <Phone size={16} />
            {CONTACT_PHONE_DISPLAY}
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="cursor-pointer rounded-full bg-black/30 p-2 backdrop-blur-sm lg:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu: no dropdown, only two links that open the page directly */}
        {isOpen && (
          <div className="absolute left-1/2 top-full mt-4 w-[98%] -translate-x-1/2 rounded-2xl bg-black/50 p-3 backdrop-blur-md lg:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.to}
                    onClick={closeAll}
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  onClick={closeAll}
                  className="flex w-full items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-left text-sm font-semibold transition"
                >
                  <Phone size={16} />
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;