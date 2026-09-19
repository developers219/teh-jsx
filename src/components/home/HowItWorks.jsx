import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    eyebrow: "START WITH YOUR IDEA",
    title: "Share your travel idea",
    description:
      "Tell us where you want to go, when you want to travel, who you’re travelling with, and what kind of experience you have in mind.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Traveller planning a holiday",
  },
  {
    number: "02",
    eyebrow: "MADE FOR YOU",
    title: "Get a curated plan",
    description:
      "Our travel experts turn your ideas into a thoughtfully planned journey with handpicked stays, experiences, routes, and the right pace.",
    image:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Traveller exploring a destination",
  },
  {
    number: "03",
    eyebrow: "READY TO GO",
    title: "Confirm and travel",
    description:
      "Once everything feels right, we take care of the arrangements and stay with you through the journey so you can simply enjoy the trip.",
    image:
      "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Couple enjoying a holiday",
  },
];

function HowItWorks() {
  const sectionRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  /* ============================================================
     DESKTOP SCROLL
  ============================================================ */

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();

      const sectionTop = window.scrollY + rect.top;

      /*
        Desktop animation:
        2 transitions × 100vh
      */
      const transitionDistance = window.innerHeight * 2;

      const scrolled = window.scrollY - sectionTop;

      const progress = Math.max(
        0,
        Math.min(scrolled / transitionDistance, 1)
      );

      setScrollProgress(progress);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  /* ============================================================
     TRANSITION
  ============================================================ */

  const storyProgress = scrollProgress * (steps.length - 1);

  const currentIndex = Math.min(
    Math.floor(storyProgress),
    steps.length - 1
  );

  const localProgress =
    currentIndex >= steps.length - 1
      ? 0
      : storyProgress - currentIndex;

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        bg-white

        /* MOBILE */
        h-auto

        /* DESKTOP */
        lg:h-[300vh]
      "
    >
      {/* ========================================================
          DESKTOP
      ========================================================= */}

      <div
        className="
          sticky
          top-0
          hidden
          h-screen
          w-full
          overflow-hidden
          lg:block
        "
      >
        <div
          className="
            grid
            h-full
            w-full
            grid-cols-2
          "
        >
          {/* ======================================================
              LEFT SIDE — TEXT
          ====================================================== */}

          <div
            className="
              relative
              flex
              h-full
              items-center
              bg-white
            "
          >
            <div
              className="
                flex
                w-full
                justify-end
                px-10
                sm:px-14
                md:px-16
                lg:px-14
                xl:px-20
                2xl:px-24
              "
            >
              <div
                className="
                  w-full
                  max-w-[650px]
                  pr-0
                  lg:pr-8
                  xl:pr-12
                "
              >
                {/* =================================================
                    HOW IT WORKS LABEL
                ================================================== */}

                <div
                  className="
                    mb-10
                    flex
                    justify-end
                  "
                >
                  <div className="w-fit">
                    <div
                      className="
                        h-px
                        w-full
                        bg-[#1f2937]
                      "
                    />

                    <div
                      className="
                        px-3
                        py-2
                        text-center
                        text-[11px]
                        font-normal
                        uppercase
                        tracking-[0.2em]
                        text-[#374151]
                        font-mont
                      "
                    >
                      How It Works
                    </div>

                    <div
                      className="
                        h-px
                        w-full
                        bg-[#1f2937]
                      "
                    />
                  </div>
                </div>

                {/* =================================================
                    TEXT STACK
                ================================================== */}

                <div
                  className="
                    relative
                    min-h-[430px]
                    overflow-hidden
                  "
                >
                  {steps.map((step, index) => {
                    let translateY = 80;
                    let opacity = 0;

                    if (index === currentIndex) {
                      translateY = -localProgress * 80;
                      opacity = 1 - localProgress;
                    }

                    if (index === currentIndex + 1) {
                      translateY = 80 - localProgress * 80;
                      opacity = localProgress;
                    }

                    if (
                      index === steps.length - 1 &&
                      currentIndex === steps.length - 1
                    ) {
                      translateY = 0;
                      opacity = 1;
                    }

                    return (
                      <div
                        key={step.number}
                        className="
                          absolute
                          right-0
                          top-0
                          w-full
                          text-right
                          will-change-transform
                        "
                        style={{
                          transform: `translateY(${translateY}px)`,
                          opacity,
                          zIndex:
                            index === currentIndex + 1
                              ? 20
                              : 10,
                        }}
                      >
                        {/* STEP INFO */}

                        <div
                          className="
                            mb-7
                            flex
                            items-center
                            justify-end
                            gap-4
                            font-mont
                          "
                        >
                          <span
                            className="
                              text-[11px]
                              font-normal
                              tracking-[0.22em]
                              text-[#607080]
                            "
                          >
                            {step.number}
                          </span>

                          <span
                            className="
                              h-px
                              w-10
                              bg-[#aeb5bc]
                            "
                          />

                          <span
                            className="
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-[0.22em]
                              text-[#526171]
                            "
                          >
                            {step.eyebrow}
                          </span>
                        </div>

                        {/* TITLE */}

                        <h2
                          className="
                            ml-auto
                            max-w-[620px]
                            text-[40px]
                            font-normal
                            leading-[1.08]
                            tracking-[-0.025em]
                            text-[#171b22]

                            sm:text-[46px]
                            md:text-[50px]
                            lg:text-[48px]
                            xl:text-[56px]
                          "
                        >
                          {step.title}
                        </h2>

                        {/* DESCRIPTION */}

                        <p
                          className="
                            ml-auto
                            mt-7
                            max-w-[520px]
                            text-[15px]
                            font-normal
                            leading-[1.85]
                            text-[#66717d]

                            sm:text-[16px]
                            font-mont
                          "
                        >
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================
              RIGHT SIDE — IMAGE
          ====================================================== */}

          <div
            className="
              relative
              h-full
              w-full
              overflow-hidden
            "
          >
            {steps.map((step, index) => {
              let y = 0;
              let blur = 0;
              let scale = 1;

              /* IMAGE 1 */

              if (index === 0) {
                if (currentIndex === 0) {
                  y = -localProgress * 100;
                  blur = 0;
                  scale = 1;
                } else {
                  y = -100;
                  blur = 0;
                  scale = 1;
                }
              }

              /* IMAGE 2 */

              if (index === 1) {
                if (currentIndex === 0) {
                  y = 0;
                  blur = 14 - localProgress * 14;
                  scale = 1.035 - localProgress * 0.035;
                }

                if (currentIndex === 1) {
                  y = -localProgress * 100;
                  blur = 0;
                  scale = 1;
                }

                if (currentIndex >= 2) {
                  y = -100;
                  blur = 0;
                  scale = 1;
                }
              }

              /* IMAGE 3 */

              if (index === 2) {
                if (currentIndex === 0) {
                  y = 0;
                  blur = 14;
                  scale = 1.035;
                }

                if (currentIndex === 1) {
                  y = 0;
                  blur = 14 - localProgress * 14;
                  scale = 1.035 - localProgress * 0.035;
                }

                if (currentIndex >= 2) {
                  y = 0;
                  blur = 0;
                  scale = 1;
                }
              }

              return (
                <img
                  key={step.number}
                  src={step.image}
                  alt={step.imageAlt}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    will-change-transform
                  "
                  style={{
                    zIndex: steps.length - index,
                    opacity: 1,
                    transform: `translate3d(0, ${y}%, 0) scale(${scale})`,
                    filter: `blur(${blur}px)`,
                    transition: "filter 40ms linear",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE
      ========================================================= */}

      <div
        className="
          block
          w-full
          overflow-visible

          lg:hidden
        "
      >
        {steps.map((step) => (
          <article
            key={step.number}
            className="
              flex
              w-full
              flex-col
              bg-white
            "
          >
            {/* =================================================
                IMAGE
            ================================================== */}

            <div
              className="
                relative
                h-[58vh]
                min-h-[360px]
                max-h-[620px]
                w-full
                overflow-hidden
              "
            >
              <img
                src={step.image}
                alt={step.imageAlt}
                className="
                  block
                  h-full
                  w-full
                  object-cover
                "
              />
            </div>

            {/* =================================================
                TEXT
            ================================================== */}

            <div
              className="
                w-full
                bg-white
                px-5
                py-12

                sm:px-10
                sm:py-14
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-3
                "
              >
                <span
                  className="
                    text-[10px]
                    tracking-[0.2em]
                    text-[#607080]
                  "
                >
                  {step.number}
                </span>

                <span
                  className="
                    h-px
                    w-7
                    bg-[#aeb5bc]
                  "
                />

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.18em]
                    text-[#526171]
                  "
                >
                  {step.eyebrow}
                </span>
              </div>

              <h2
                className="
                  mt-7
                  text-right
                  font-serif
                  text-[34px]
                  font-normal
                  leading-[1.1]
                  tracking-[-0.02em]
                  text-[#171b22]

                  min-[360px]:text-[37px]
                  sm:text-[42px]
                "
              >
                {step.title}
              </h2>

              <p
                className="
                  mt-5
                  ml-auto
                  max-w-[560px]
                  text-right
                  font-mont
                  text-[14px]
                  leading-[1.75]
                  text-[#66717d]

                  min-[360px]:text-[15px]
                  sm:mt-6
                  sm:text-[16px]
                "
              >
                {step.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;