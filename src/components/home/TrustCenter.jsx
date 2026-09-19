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

  /*
   * ==========================================================
   * DESKTOP TRANSITION SETTINGS
   * ==========================================================
   */

  const TEXT_TRANSITION_DURATION = 0.5;
  const TEXT_EASE = [0.22, 1, 0.36, 1];
  const IMAGE_TRANSITION_DURATION = 2.05;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const currentScrollY = window.scrollY;

      const scrollDirection = currentScrollY >= lastScrollY.current ? 1 : -1;

      lastScrollY.current = currentScrollY;

      setDirection(scrollDirection);

      /*
       * ==========================================================
       * SECTION ENTRY
       * ==========================================================
       */

      const sectionEntered = Math.max(viewportHeight - rect.top, 0);

      /*
       * ==========================================================
       * NORMAL STORIES
       * ==========================================================
       */

      const normalStoryIndex = Math.min(
        stories.length - 1,
        Math.floor(sectionEntered / viewportHeight),
      );

      setActiveIndex(normalStoryIndex);

      /*
       * ==========================================================
       * FINAL EXIT
       * ==========================================================
       */

      const finalExitStart = stories.length * viewportHeight;

      const finalExitDistance = sectionEntered - finalExitStart;

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
   * DESKTOP TEXT ANIMATION
   * ==========================================================
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
   * DESKTOP IMAGE ANIMATION
   * ==========================================================
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
    <>
      {/* =========================================================
          DESKTOP VERSION
          Hidden below XL
      ========================================================= */}

      <section
        ref={sectionRef}
        className="relative hidden bg-white xl:block"
        style={{
          height: `${(stories.length + 1) * 100}vh`,
        }}
      >
        <div className="sticky top-14 h-fit overflow-hidden bg-white sm:top-28 xl:h-screen">
          <div
            className="
              relative
              flex
              h-fit
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
              xl:h-[600px]
            "
          >
            {/* IMAGE */}

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
                      duration: IMAGE_TRANSITION_DURATION,
                      ease: TEXT_EASE,
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

            {/* TEXT */}

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
                    duration: TEXT_TRANSITION_DURATION,
                    ease: TEXT_EASE,
                  },

                  opacity: {
                    duration: TEXT_TRANSITION_DURATION,
                    ease: TEXT_EASE,
                  },

                  filter: {
                    duration: TEXT_TRANSITION_DURATION,
                    ease: TEXT_EASE,
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
                <div className="mb-4 sm:mb-5 lg:mb-6">
                  <span
                    className="
                      font-mont
                      text-[9px]
                      font-medium
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

                <p
                  className="
                    mt-5
                    max-w-[560px]
                    font-mont
                    text-[13px]
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

            {/* STORY INDICATOR */}

            {/* <div
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
            </div> */}
          </div>
        </div>
      </section>

      {/* =========================================================
          MOBILE / TABLET VERSION

          IMAGE 1
          TEXT 1

          IMAGE 2
          TEXT 2

          IMAGE 3
          TEXT 3

          IMAGE 4
          TEXT 4

          No sticky
          No AnimatePresence
          No scroll-controlled animation

          Visible below XL
      ========================================================= */}

      <section
        className="
          block
          w-full
          bg-white
          px-4
          py-12
          sm:px-6
          sm:py-16
          xl:hidden
        "
      >
        <div className="mx-auto w-full max-w-none">
          {stories.map((story, index) => (
            <article
              key={story.image}
              className={`
                w-full
                ${index !== 0 ? "mt-16 sm:mt-20" : ""}
              `}
            >
              {/* IMAGE */}

              <div
                className="
                  relative
                  w-full
                  overflow-hidden
                  rounded-[18px]
                  bg-neutral-100
                  aspect-[4/3]
                  sm:aspect-[16/10]
                "
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>

              {/* TEXT */}

              <div
                className="
                  mt-7
                  w-full
                  px-1
                  sm:mt-9
                  sm:px-2
                "
              >
                {/* LABEL */}

                <div className="mb-4 sm:mb-5">
                  <span
                    className="
                      font-mont
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[5px]
                      text-neutral-500
                      sm:text-[10px]
                      sm:tracking-[6px]
                    "
                  >
                    {story.label}
                  </span>
                </div>

                {/* TITLE */}

                <h1
                  className="
                    w-full
                    font-normal
                    leading-[1.06]
                    tracking-[-0.045em]
                    text-[#25272b]
                    text-[clamp(2rem,4vw,2.5rem)]
                    sm:leading-[1.05]
                  "
                >
                  {story.title}
                </h1>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-5
                    w-full
                    font-mont
                    text-[13px]
                    leading-[1.7]
                    tracking-[0.01em]
                    text-gray-600
                    sm:mt-6
                    sm:max-w-[700px]
                    sm:text-[15px]
                    sm:leading-[1.75]
                  "
                >
                  {story.description}
                </p>

                {/* LOGOS */}

                {story.logos && (
                  <div
                    className="
                      mt-6
                      flex
                      w-full
                      flex-wrap
                      gap-x-6
                      gap-y-3
                      sm:mt-7
                      sm:gap-x-8
                      sm:gap-y-4
                    "
                  >
                    {story.logos.map((logo) => (
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
                        "
                      >
                        {logo}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default TrustCenter;
