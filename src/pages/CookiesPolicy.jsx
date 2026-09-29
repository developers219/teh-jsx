import React, { useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";

const CookiesPolicy = () => {
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
                Cookies Policy
              </h1>

              {/* Content */}
              <div className="max-w-4xl mt-6 font-mont space-y-5 text-sm leading-7 text-slate-600 sm:text-base">
                <p>
                  Travel Empire Holidays uses cookies and similar technologies
                  on its website to improve your browsing experience, understand
                  website usage, and provide relevant content and services.
                </p>

                <p>
                  Cookies are small text files stored on your device when you
                  visit our website. They may help us remember your preferences,
                  maintain website functionality, and understand how visitors
                  interact with our pages.
                </p>

                <p>
                  We may use essential, analytics, functional, and marketing
                  cookies depending on how our website and services are used.
                  These technologies help us improve website performance and
                  understand general visitor activity.
                </p>

                <p>
                  You can manage or disable cookies through your browser
                  settings. However, disabling certain cookies may affect some
                  features or functionality of the website.
                </p>
              </div>
            </div>

          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default CookiesPolicy;