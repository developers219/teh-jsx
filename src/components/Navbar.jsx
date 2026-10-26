import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
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

function getDestinationImage(destination) {
  return (
    destination?.images?.[0]?.imageUrl ||
    destination?.imageUrl ||
    destination?.image ||
    destination?.src ||
    destination?.path ||
    destination?.thumbnail ||
    destination?.bannerImage ||
    DEFAULT_IMAGE
  );
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

/* ---------------- DROPDOWN LIST ---------------- */

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
  // mobile accordion: "dom" | "intl" | null
  const [mobileMenu, setMobileMenu] = useState(null);

  const [destinations, setDestinations] = useState({ dom: [], intl: [] });
  const [isLoadingDest, setIsLoadingDest] = useState(true);

  const closeTimer = useRef(null);

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

    const fetchDestinations = async () => {
      const [domRes, intlRes] = await Promise.allSettled([
        api.get("/destinations/category/1", { signal: controller.signal }),
        api.get("/destinations/category/2", { signal: controller.signal }),
      ]);

      if (controller.signal.aborted) return;

      setDestinations({
        dom: pickList(domRes),
        intl: pickList(intlRes),
      });
      setIsLoadingDest(false);
    };

    fetchDestinations();

    return () => controller.abort();
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
    setMobileMenu(null);
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 w-full font-mont text-white transition-all duration-300 ${
        isScrolled
          ? "bg-black/70 py-3 shadow-lg backdrop-blur-md"
          : "bg-linear-to-b from-black/70 via-black/30 to-transparent py-5"
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

          {/* Desktop navigation */}
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

        {/* Mobile menu */}
        {isOpen && (
          <div className="absolute left-1/2 top-full mt-4 w-[98%] -translate-x-1/2 rounded-2xl bg-black/50 p-3 backdrop-blur-md lg:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isExpanded = mobileMenu === link.key;
                const items = destinations[link.key];

                return (
                  <li key={link.key}>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileMenu(isExpanded ? null : link.key)
                      }
                      className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition hover:bg-white/10"
                      aria-expanded={isExpanded}
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="mx-2 mb-2 rounded-xl bg-white/5">
                        <ul className="max-h-[220px] overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.4)_transparent]">
                          {isLoadingDest && (
                            <li className="px-3 py-2 text-sm text-white/70">
                              Loading...
                            </li>
                          )}

                          {!isLoadingDest && items.length === 0 && (
                            <li className="px-3 py-2 text-sm text-white/70">
                              No destinations available
                            </li>
                          )}

                          {!isLoadingDest &&
                            items.map((destination, index) => (
                              <li
                                key={
                                  destination?.id ?? destination?.slug ?? index
                                }
                              >
                                <Link
                                  to={getDestinationPath(destination, link.key)}
                                  onClick={closeAll}
                                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10"
                                >
                                  <img
                                    src={getDestinationImage(destination)}
                                    alt=""
                                    loading="lazy"
                                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                                  />
                                  <span className="truncate">
                                    {getDestinationName(destination)}
                                  </span>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}

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