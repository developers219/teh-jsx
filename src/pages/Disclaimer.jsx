import React, { useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";

const Disclaimer = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top Black Area */}
      <section className="bg-black h-18 lg:h-40"></section>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="w-full pt-10 pb-16"
      >
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="rounded-xl bg-white px-6 py-10 shadow-[0_4px_25px_rgba(0,0,0,0.04)] sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            
            {/* Heading */}
            <div className="mb-12">
              <h1 className="font-cg text-4xl text-center font-medium tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Disclaimer
              </h1>

              {/* Content */}
              <div className="max-w-4xl mt-6 font-mont space-y-5 text-sm leading-7 text-slate-600 sm:text-base">
                <p>
                  Travel Empire Holidays provides the information on this website
                  for general travel purposes. While we make reasonable efforts
                  to keep the information accurate and updated, we do not
                  guarantee that all details, including prices, availability,
                  itineraries, destinations, or travel requirements, are complete
                  or current.
                </p>

                <p>
                  Information provided on this website may change without prior
                  notice. Travel Empire Holidays is not responsible for any loss
                  or inconvenience arising from reliance on information that may
                  become outdated or inaccurate.
                </p>

                <p>
                  Our website may contain links to third-party websites and
                  services. We are not responsible for the accuracy, content,
                  availability, or policies of external websites.
                </p>

                <p>
                  Any third-party links, offers, products, or services displayed
                  on our website do not necessarily constitute an endorsement by
                  Travel Empire Holidays.
                </p>
              </div>
            </div>

          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default Disclaimer;