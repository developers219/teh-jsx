import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Escapeora from "../assets/images/logo.png";
import DarkEscapeora from "../assets/images/logo-dark.png";

const CONTACT_PHONE_DISPLAY = "+91 90000 00000";
const CONTACT_PHONE_TEL = "+919000000000";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent page scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isScrolled ? (
          /* =====================================================
             TOP NAVBAR — TRANSPARENT / WHITE
          ===================================================== */
          <motion.nav
            key="top-navbar"
            className="fixed inset-x-0 top-0 z-40 font-medium text-white/80"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{
              y: -100,
              opacity: 0,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-center">
              {/* MOBILE MENU */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className="flex items-center justify-center p-4 px-5 md:hidden"
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>

              {/* DESKTOP MENU */}
              <div
                className="hidden p-4 px-12 md:block"
                onClick={() => setIsMenuOpen(true)}
              >
                Menu
              </div>

              {/* LOGO */}
              <Link
                to="/"
                className="flex flex-1 cursor-pointer items-center justify-center md:border-x md:border-[#333333]/50"
              >
                <div className="p-4">
                  <img
                    src={Escapeora}
                    alt="Escapeora"
                    className="w-24 object-contain sm:w-28 md:w-48"
                  />
                </div>
              </Link>

              {/* PHONE */}
              <div className="shrink-0">
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="block p-4 px-5 text-sm sm:px-8 md:px-12 md:text-base"
                >
                  <span className="hidden sm:inline">
                    {CONTACT_PHONE_DISPLAY}
                  </span>

                  <span className="sm:hidden">Call Us</span>
                </a>
              </div>
            </div>

            {/* DESKTOP DESTINATIONS */}
            <div className="hidden border-y border-[#333333]/50 text-lg md:flex">
              <div className="flex-1 border-r border-[#333333]/50">
                <Link
                  to="/destinations/dom"
                  className="block w-full p-4 text-center"
                >
                  Domestic Destinations
                </Link>
              </div>

              <div className="flex-1">
                <Link
                  to="/destinations/intl"
                  className="block w-full p-4 text-center"
                >
                  International Destinations
                </Link>
              </div>
            </div>
          </motion.nav>
        ) : (
          /* =====================================================
             SCROLLED NAVBAR — WHITE
          ===================================================== */
          <motion.nav
            key="scrolled-navbar"
            initial={{
              y: -100,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -100,
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-x-0 top-0 z-50 bg-white text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          >
            <div className="mx-auto flex h-[68px] max-w-7xl items-center px-4 sm:h-[76px] sm:px-6 lg:px-8">
              {/* MOBILE MENU */}

              {/* LOGO */}
              <Link to="/" className="flex items-center">
                <img
                  src={DarkEscapeora}
                  alt="Escapeora"
                  className="h-auto w-24 object-contain sm:w-28 md:w-48"
                />
              </Link>

              {/* RIGHT SIDE — DESKTOP */}
              <div className="ml-auto hidden h-full items-center md:flex">
                {/* DOMESTIC */}
                <Link
                  to="/destinations/dom"
                  className="group relative flex h-full items-center px-4 text-sm font-medium transition-colors hover:text-black lg:px-6"
                >
                  Domestic Destinations
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] origin-left scale-x-0 bg-neutral-900 transition-transform duration-300 group-hover:scale-x-100 lg:left-6 lg:right-6" />
                </Link>

                {/* INTERNATIONAL */}
                <Link
                  to="/destinations/intl"
                  className="group relative flex h-full items-center px-4 text-sm font-medium transition-colors hover:text-black lg:px-6"
                >
                  International Destinations
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] origin-left scale-x-0 bg-neutral-900 transition-transform duration-300 group-hover:scale-x-100 lg:left-6 lg:right-6" />
                </Link>

                {/* PHONE */}
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="ml-2 flex items-center rounded-full border border-neutral-900/20 px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-neutral-900 hover:text-white lg:ml-3 lg:px-5"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </div>

              {/* MOBILE PHONE */}
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="ml-auto rounded-full border border-neutral-900/20 px-4 py-2 text-xs font-medium sm:px-5 sm:text-sm md:hidden"
              >
                <span className="hidden xs:inline">
                  {CONTACT_PHONE_DISPLAY}
                </span>

                <span className="xs:hidden">Call Us</span>
              </a>
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className="flex items-center justify-center p-2 md:hidden"
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* =========================================================
          MOBILE FULL SCREEN MENU
      ========================================================= */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex min-h-screen flex-col bg-neutral-950 text-white"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* MOBILE MENU HEADER */}
            <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/15 px-5 sm:h-[76px] sm:px-6">
              {/* LOGO */}
              <Link to="/" onClick={closeMenu}>
                <img
                  src={Escapeora}
                  alt="Escapeora"
                  className="w-24 object-contain sm:w-28 bg-black"
                />
              </Link>

              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 hover:bg-white hover:text-neutral-950"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* MENU CONTENT */}
            <motion.div
              initial={{
                y: 70,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 70,
                opacity: 0,
              }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-1 flex-col items-center justify-center px-6"
            >
              <nav className="flex w-full max-w-md flex-col items-center text-center">
                {/* DOMESTIC */}
                <Link
                  to="/destinations/dom"
                  onClick={closeMenu}
                  className="group relative py-3 text-2xl font-medium tracking-tight transition-opacity duration-300 hover:opacity-60 sm:text-3xl"
                >
                  Domestic Destinations
                  <span className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
                </Link>

                {/* INTERNATIONAL */}
                <Link
                  to="/destinations/intl"
                  onClick={closeMenu}
                  className="group relative py-3 text-2xl font-medium tracking-tight transition-opacity duration-300 hover:opacity-60 sm:text-3xl"
                >
                  International Destinations
                  <span className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
                </Link>

                {/* DIVIDER */}
                <div className="my-7 h-px w-16 bg-white/20" />

                {/* PHONE */}
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  onClick={closeMenu}
                  className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-white hover:text-neutral-950 sm:px-8 sm:text-base"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </nav>
            </motion.div>

            {/* BOTTOM TEXT */}
            <motion.div
              initial={{
                y: 30,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 30,
                opacity: 0,
              }}
              transition={{
                duration: 0.45,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="shrink-0 px-6 pb-6 text-center text-xs tracking-widest text-white/40 uppercase"
            >
              Escapeora
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
