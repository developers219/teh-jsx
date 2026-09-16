import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import Escapeora from "../assets/images/logo.png";

const CONTACT_PHONE_DISPLAY = "+91 90000 00000";
const CONTACT_PHONE_TEL = "+919000000000";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isScrolled ? (
        /* =====================================================
           TOP NAVBAR — TRANSPARENT / WHITE
        ===================================================== */
        <motion.nav
          className="fixed inset-0 z-40 text-white/80 font-medium"
          key="top-navbar"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex">
            <div className="p-4 px-12">Menu</div>
            <Link to={"/"} className="flex-1 cursor-pointer">
              <div className="flex-1 border-x p-4 border-[#333333]/50 flex items-center justify-center">
                <img
                  src={Escapeora}
                  alt="Escapeora"
                  className="w-28 h-auto object-contain"
                />
              </div>
            </Link>

            <div>
              <Link
                to={"tel:+915785162122"}
                className="p-4 px-12 block h-full w-full"
              >
                +915785162122
              </Link>
            </div>
          </div>
          <div className="flex text-white/80 text-lg border-y border-[#333333]/50">
            <div className="flex-1 border-r border-[#333333]/50">
              <Link
                to={"/destinations/dom"}
                className="p-4 block h-full w-full text-center"
              >
                Domestic Destinations
              </Link>
            </div>
            <div className="flex-1">
              <Link
                to={"/destinations/intl"}
                className="p-4 block h-full w-full text-center"
              >
                International Destinations
              </Link>
            </div>
          </div>
        </motion.nav>
      ) : (
        // <motion.nav

        //   className="fixed inset-x-0 top-0 z-50 text-white"
        // >
        //   <div className="flex items-center border-b border-white/20">
        //     {/* LOGO */}
        //     <Link to="/" className="flex items-center px-8 py-5 lg:px-12">
        //       <img
        //         src={Escapeora}
        //         alt="Escapeora"
        //         className="h-auto w-28 object-contain"
        //       />
        //     </Link>

        //     {/* DESTINATIONS */}
        //     <div className="ml-auto flex items-center">
        //       <Link
        //         to="/destinations/dom"
        //         className="border-l border-white/20 px-7 py-5 text-sm font-medium transition-colors hover:bg-white/10"
        //       >
        //         Domestic
        //       </Link>

        //       <Link
        //         to="/destinations/intl"
        //         className="border-l border-white/20 px-7 py-5 text-sm font-medium transition-colors hover:bg-white/10"
        //       >
        //         International
        //       </Link>

        //       {/* PHONE */}
        //       <a
        //         href={`tel:${CONTACT_PHONE_TEL}`}
        //         className="border-l border-white/20 px-8 py-5 text-sm font-medium transition-colors hover:bg-white/10 lg:px-12"
        //       >
        //         {CONTACT_PHONE_DISPLAY}
        //       </a>
        //     </div>
        //   </div>
        // </motion.nav>
        /* =====================================================
           SCROLLED NAVBAR — WHITE
        ===================================================== */
        <motion.nav
          key="scrolled-navbar"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-x-0 top-0 z-50 bg-white text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="mx-auto flex h-[76px] max-w-7xl items-center px-6 lg:px-8">
            {/* LOGO */}
            <Link to="/" className="flex items-center">
              <img
                src={Escapeora}
                alt="Escapeora"
                className="h-auto w-28 object-contain bg-black"
              />
            </Link>

            {/* RIGHT SIDE */}
            <div className="ml-auto flex h-full items-center">
              {/* DOMESTIC */}
              <Link
                to="/destinations/dom"
                className="group relative flex h-full items-center px-6 text-sm font-medium transition-colors hover:text-black"
              >
                Domestic Destinations
                <span className="absolute bottom-0 left-6 right-6 h-[2px] origin-left scale-x-0 bg-neutral-900 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>

              {/* INTERNATIONAL */}
              <Link
                to="/destinations/intl"
                className="group relative flex h-full items-center px-6 text-sm font-medium transition-colors hover:text-black"
              >
                International Destinations
                <span className="absolute bottom-0 left-6 right-6 h-[2px] origin-left scale-x-0 bg-neutral-900 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>

              {/* PHONE */}
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="ml-3 flex items-center rounded-full border border-neutral-900/20 px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-neutral-900 hover:text-white"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default Navbar;
