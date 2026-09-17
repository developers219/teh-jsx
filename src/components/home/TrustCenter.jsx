import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const stories = [
  {
    label: "PREFERRED HOTEL PARTNERS",
    title: "VIP Perks and Upgrades Await",
    description:
      "Indulge in exclusive VIP upgrades at our preferred hotel partners. Enjoy complimentary room upgrades, late check-outs, welcome amenities, and more — all designed to enhance your stay and ensure unforgettable moments.",
    image:
      "https://cdn.prod.website-files.com/6773e7b69a04c1b58ee88b3f/67798caae2ec11c30e82d106_hotels.webp",
    side: "left",
  },

  {
    label: "CRUISE PARTNERS",
    title: "Ultra-Small Luxury Cruises And More",
    description:
      "Experience the intimacy and exclusivity of boutique ships, offering personalized service, gourmet dining, and access to hidden ports that larger vessels can't reach.",
    image:
      "https://cdn.prod.website-files.com/6773e7b69a04c1b58ee88b3f/677990325176730ce8a42e43_ponant.jpg",
    side: "right",
  },

  {
    label: "EXPERIENCE PARTNERS",
    title: "Early Access To The Newest Tours",
    description:
      "From private guided tours of iconic landmarks to behind-the-scenes cultural experiences, our privileged connections grant you unparalleled opportunities to explore in style.",
    image:
      "https://cdn.prod.website-files.com/6773e7b69a04c1b58ee88b3f/67758c25a8f9e53f7e824113_Trade_Trade_SGL%20Show-069%20copy.jpg",
    side: "left",
  },

  {
    label: "HYPER-PERSONALIZATION",
    title: "Bespoke Travel Tailored To You",
    description:
      "Your journey should be as unique as you are. That's why we craft bespoke travel experiences tailored to your style, interests, and personality.",
    image:
      "https://cdn.prod.website-files.com/6773e7b69a04c1b58ee88b3f/67784ec0519e1de131e9f727_pexels-mikegiugliano-2940654.jpg",
    side: "right",
  },
];

function TrustCenter() {
  const sectionRef = useRef(null);
  const lastScrollY = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [finalExitProgress, setFinalExitProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();

      const scrollInside = Math.max(-rect.top, 0);

      const viewportHeight = window.innerHeight;

      const currentScrollY = window.scrollY;

      const scrollDirection = currentScrollY >= lastScrollY.current ? 1 : -1;

      lastScrollY.current = currentScrollY;

      setDirection(scrollDirection);

      /*
       * -----------------------------------------
       * NORMAL STORIES
       * -----------------------------------------
       *
       * 0 → 1 = Story 1
       * 1 → 2 = Story 2
       * 2 → 3 = Story 3
       * 3 → 4 = Story 4
       */

      const normalStoryIndex = Math.min(
        stories.length - 1,
        Math.floor(scrollInside / viewportHeight),
      );

      setActiveIndex(normalStoryIndex);

      /*
       * -----------------------------------------
       * FINAL EXIT
       * -----------------------------------------
       *
       * Story 4 has finished its normal
       * viewport at 4 × viewportHeight.
       *
       * From 4 → 5:
       *
       * 4th text moves UP completely.
       */

      const finalExitStart = stories.length * viewportHeight;

      const finalExitDistance = scrollInside - finalExitStart;

      if (normalStoryIndex === stories.length - 1) {
        const progress = Math.max(
          0,
          Math.min(1, finalExitDistance / viewportHeight),
        );

        setFinalExitProgress(progress);
      } else {
        setFinalExitProgress(0);
      }
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const activeStory = stories[activeIndex];

  /*
   * ==========================================================
   * TEXT ANIMATION
   * ==========================================================
   *
   * When scrolling DOWN:
   *
   * new text enters from BOTTOM
   *              ↓
   *            CENTER
   *
   * old text exits to TOP
   *              ↑
   *
   * When scrolling UP:
   *
   * new text enters from TOP
   *              ↓
   *            CENTER
   *
   * old text exits to BOTTOM
   *
   * IMAGE DOES NOT START YET.
   */

  const textVariants = {
    enter: (dir) => ({
      y: dir === 1 ? "100vh" : "-100vh",
      opacity: 0,
      filter: "blur(14px)",
    }),

    center: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
    },

    exit: (dir) => ({
      y: dir === 1 ? "-100vh" : "100vh",
      opacity: 0,
      filter: "blur(14px)",
    }),
  };

  /*
   * ==========================================================
   * IMAGE ANIMATION
   * ==========================================================
   *
   * IMPORTANT:
   *
   * Image transition has a DELAY.
   *
   * Text begins first.
   *
   * Then image begins blending.
   *
   * The image container itself never moves.
   */

  const imageVariants = {
    enter: {
      opacity: 0,
    },

    center: {
      opacity: 1,
    },

    exit: {
      opacity: 0,
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{
        height: `${(stories.length + 1) * 100}vh`,
      }}
    >
      {/* =====================================================
        STICKY VIEWPORT
    ====================================================== */}
      <div className="sticky top-14 sm:top-28 h-fit xl:h-screen overflow-hidden bg-white">
        {/* =====================================================
          CONTENT WRAPPER

          Desktop:
          image centered + text on either side

          Tablet / Mobile:
          image on top + text underneath
      ====================================================== */}
        <div
          className="
          relative
          flex
          h-fit
          xl:h-[600px]
          w-full
          flex-col
          
          px-5
          pt-8
          pb-10

          sm:px-8
          sm:pt-8

          lg:block
          lg:px-0
          lg:pt-0
          lg:pb-0
        "
        >
          {/* ===================================================
            IMAGE
        ==================================================== */}
          <div
            className="
            relative
            z-10
            h-[38vh]
            w-full
            max-w-[520px]
            shrink-0
            overflow-hidden
            rounded-[18px]
            bg-neutral-100

            sm:h-[42vh]
            sm:max-w-[560px]

            md:h-[46vh]
            md:max-w-[600px]

            lg:absolute
            lg:left-1/2
            lg:top-1/2
            lg:h-[66vh]
            lg:w-[min(42vw,450px)]
            lg:max-w-none
            lg:-translate-x-1/2
            lg:-translate-y-1/2
          "
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={activeStory.image}
                src={activeStory.image}
                alt={activeStory.title}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  delay: 0.9,

                  opacity: {
                    duration: 2.05,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
              />
            </AnimatePresence>
          </div>

          {/* ===================================================
            TEXT
        ==================================================== */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate={
                activeIndex === stories.length - 1 && finalExitProgress > 0
                  ? {
                      y: `${-finalExitProgress * 100}vh`,
                      opacity: 1 - finalExitProgress,
                      filter: `blur(${finalExitProgress * 12}px)`,
                    }
                  : "center"
              }
              exit="exit"
              transition={{
                y: {
                  duration: activeIndex === 3 ? 0.3 : 0.5,
                  ease: [0.22, 1, 0.36, 1],
                },

                opacity: {
                  duration: 0.2,
                  ease: "easeOut",
                },

                filter: {
                  duration: 0.55,
                  ease: "easeOut",
                },
              }}
              className={`
              z-20
              mt-7
              w-full
              max-w-[560px]
              shrink-0

              sm:mt-8
              sm:max-w-[600px]

              md:mt-9
              md:max-w-[650px]

              lg:absolute
              lg:top-1/2
              lg:mt-0
              lg:w-[calc(50%_-_30px)]
              lg:max-w-[440px]
              lg:-translate-y-1/2

              ${
                activeStory.side === "left"
                  ? "lg:left-[5%] xl:left-[7%]"
                  : "lg:right-[0%] xl:right-[5%]"
              }
            `}
            >
              {/* =================================================
                LABEL
            ================================================== */}
              <div className="mb-4 sm:mb-5 lg:mb-6">
                <span
                  className="
                  text-[9px]
                  font-medium
                  font-mont
                  uppercase
                  tracking-[6px]
                  text-neutral-500

                  sm:text-[10px]

                  lg:text-[11px]
                "
                >
                  {activeStory.label}
                </span>
              </div>

              {/* =================================================
                TITLE
            ================================================== */}
              <h2
                className="
                max-w-[560px]
                text-[32px]
                font-normal
                leading-[1.06]
                tracking-[-0.045em]
                text-[#25272b]

                sm:text-[38px]

                md:text-[44px]

                lg:max-w-[470px]
                lg:text-[52px]

                xl:text-[56px]
              "
              >
                {activeStory.title}
              </h2>

              {/* =================================================
                DESCRIPTION
            ================================================== */}
              <p
                className="
                mt-5
                max-w-[560px]
                text-[13px]
                font-mont
                leading-[1.7]
                tracking-[0.01em]
                text-gray-600

                sm:mt-6
                sm:text-[14px]

                md:text-[15px]

                lg:mt-7
                lg:max-w-[400px]
                lg:text-[16px]
                lg:leading-[1.75]
              "
              >
                {activeStory.description}
              </p>

              {/* =================================================
                LOGOS
            ================================================== */}
              {activeStory.logos && (
                <div
                  className="
                  mt-6
                  flex
                  max-w-[560px]
                  flex-wrap
                  gap-x-6
                  gap-y-3

                  sm:mt-7
                  sm:gap-x-8
                  sm:gap-y-4

                  lg:mt-8
                  lg:max-w-[350px]
                  lg:gap-y-5
                "
                >
                  {activeStory.logos.map((logo) => (
                    <div
                      key={logo}
                      className="
                      flex
                      h-[24px]
                      items-center
                      text-[10px]
                      font-medium
                      tracking-[0.12em]
                      text-neutral-600

                      sm:h-[28px]
                      sm:text-[11px]

                      lg:text-[12px]
                    "
                    >
                      {logo}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ===================================================
            STORY INDICATOR
        ==================================================== */}
          <div
            className="
            absolute
            bottom-5
            left-1/2
            z-30
            flex
            -translate-x-1/2
            items-center
            gap-2

            sm:bottom-6

            lg:bottom-8
          "
          >
            {stories.map((_, index) => (
              <div
                key={index}
                className="
                h-[3px]
                rounded-full
                bg-neutral-900
                transition-all
                duration-500
              "
                style={{
                  width: activeIndex === index ? "28px" : "8px",
                  opacity: activeIndex === index ? 1 : 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
    // <section
    //   ref={sectionRef}
    //   className="relative bg-white"
    //   style={{
    //     height: `${(stories.length + 1) * 100}vh`,
    //   }}
    // >
    //   {/* =====================================================
    //       STICKY VIEWPORT
    //   ====================================================== */}

    //   <div className="sticky top-0 h-screen overflow-hidden bg-white">
    //     {/* ===================================================
    //         FIXED IMAGE AREA

    //         THIS POSITION NEVER CHANGES.
    //     ==================================================== */}

    //     <div
    //       className="
    //         absolute
    //         left-1/2
    //         top-1/2
    //         z-10
    //         h-[58vh]
    //         w-[min(42vw,450px)]
    //         -translate-x-1/2
    //         -translate-y-1/2
    //         overflow-hidden
    //         rounded-[18px]
    //         bg-neutral-100
    //         sm:h-[62vh]
    //         lg:h-[66vh]
    //       "
    //     >
    //       <AnimatePresence initial={false}>
    //         <motion.img
    //           key={activeStory.image}
    //           src={activeStory.image}
    //           alt={activeStory.title}
    //           variants={imageVariants}
    //           initial="enter"
    //           animate="center"
    //           exit="exit"
    //           transition={{
    //             /*
    //              * TEXT HAS ALREADY STARTED
    //              * BEFORE THIS BEGINS.
    //              */
    //             delay: 0.9,

    //             opacity: {
    //               duration: 2.05,
    //               ease: [0.22, 1, 0.36, 1],
    //             },
    //           }}
    //           className="
    //             absolute
    //             inset-0
    //             h-full
    //             w-full
    //             object-cover
    //           "
    //         />
    //       </AnimatePresence>
    //     </div>

    //     {/* ===================================================
    //         TEXT
    //     ==================================================== */}

    //     <AnimatePresence mode="wait" custom={direction}>
    //       <motion.div
    //         key={activeIndex}
    //         custom={direction}
    //         variants={textVariants}
    //         initial="enter"
    //         animate={
    //           activeIndex === stories.length - 1 && finalExitProgress > 0
    //             ? {
    //                 y: `${-finalExitProgress * 100}vh`,
    //                 opacity: 1 - finalExitProgress,
    //                 filter: `blur(${finalExitProgress * 12}px)`,
    //               }
    //             : "center"
    //         }
    //         exit="exit"
    //         transition={{
    //           /*
    //            * TEXT MOVES FIRST
    //            */
    //           y: {
    //             duration: activeIndex === 3 ? 0.3 : 0.5,
    //             ease: [0.22, 1, 0.36, 1],
    //           },

    //           opacity: {
    //             duration: 0.2,
    //             ease: "easeOut",
    //           },

    //           filter: {
    //             duration: 0.55,
    //             ease: "easeOut",
    //           },
    //         }}
    //         className={`
    //           absolute
    //           top-1/2
    //           z-20
    //           w-[calc(50%_-_30px)]
    //           max-w-[440px]
    //           -translate-y-1/2

    //           ${
    //             activeStory.side === "left"
    //               ? "left-[5%] lg:left-[7%]"
    //               : "right-[0%] lg:right-[5%]"
    //           }
    //         `}
    //       >
    //         {/* =================================================
    //             LABEL
    //         ================================================== */}

    //         <div className="mb-6">
    //           <span
    //             className="
    //               text-[10px]
    //               font-medium
    //               uppercase
    //               tracking-[0.25em]
    //               text-neutral-500
    //               sm:text-[11px]
    //             "
    //           >
    //             {activeStory.label}
    //           </span>
    //         </div>

    //         {/* =================================================
    //             TITLE
    //         ================================================== */}

    //         <h2
    //           className="
    //             max-w-[470px]
    //             text-[38px]
    //             font-normal
    //             leading-[1.04]
    //             tracking-[-0.045em]
    //             text-[#25272b]

    //             sm:text-[44px]

    //             lg:text-[52px]

    //             xl:text-[56px]
    //           "
    //         >
    //           {activeStory.title}
    //         </h2>

    //         {/* =================================================
    //             DESCRIPTION
    //         ================================================== */}

    //         <p
    //           className="
    //             mt-7
    //             max-w-[400px]
    //             text-[14px]
    //             font-normal
    //             leading-[1.75]
    //             tracking-[0.01em]
    //             text-[#6d6d70]

    //             sm:text-[15px]

    //             lg:text-[16px]
    //           "
    //         >
    //           {activeStory.description}
    //         </p>

    //         {/* =================================================
    //             LOGOS
    //         ================================================== */}

    //         {activeStory.logos && (
    //           <div
    //             className="
    //               mt-8
    //               flex
    //               max-w-[350px]
    //               flex-wrap
    //               gap-x-8
    //               gap-y-5
    //             "
    //           >
    //             {activeStory.logos.map((logo) => (
    //               <div
    //                 key={logo}
    //                 className="
    //                   flex
    //                   h-[28px]
    //                   items-center
    //                   text-[12px]
    //                   font-medium
    //                   tracking-[0.12em]
    //                   text-neutral-600
    //                 "
    //               >
    //                 {logo}
    //               </div>
    //             ))}
    //           </div>
    //         )}
    //       </motion.div>
    //     </AnimatePresence>

    //     {/* ===================================================
    //         STORY INDICATOR
    //     ==================================================== */}

    //     {/* <div
    //       className="
    //         absolute
    //         bottom-8
    //         left-1/2
    //         z-30
    //         flex
    //         -translate-x-1/2
    //         items-center
    //         gap-2
    //       "
    //     > */}
    //     {stories.map((_, index) => (
    //       <div
    //         key={index}
    //         className="
    //             h-[3px]
    //             rounded-full
    //             bg-neutral-900
    //             transition-all
    //             duration-500
    //           "
    //         style={{
    //           width: activeIndex === index ? "28px" : "8px",

    //           opacity: activeIndex === index ? 1 : 0.2,
    //         }}
    //       />
    //     ))}
    //   </div>
    //   {/* </div> */}
    // </section>
  );
}

export default TrustCenter;
