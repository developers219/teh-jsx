import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import Escapeora from "../assets/images/logo.png";

const CONTACT_PHONE_DISPLAY = "+91 92112 15500";
const CONTACT_PHONE_TEL = "+919211215500";

const NAV_LINKS = [
  { to: "/destinations/dom", label: "Domestic Destinations" },
  { to: "/destinations/intl", label: "International Destinations" },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

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
          <Link to="/" onClick={closeMenu} className="shrink-0">
            <img
              src={Escapeora}
              alt="Escapeora"
              className="w-28 object-contain sm:w-32 md:w-40"
              
            />
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-[clamp(0.25rem,2vw,2rem)] rounded-full bg-black/30 px-8 py-3 font-bold backdrop-blur-sm lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="cursor-pointer text-sm transition-opacity hover:opacity-70"
                >
                  {link.label}
                </Link>
              </li>
            ))}
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
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={closeMenu}
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  onClick={closeMenu}
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
