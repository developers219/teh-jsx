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
     SCROLL
  ============================================================ */

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;

      const rect = section.getBoundingClientRect();

      /*
        Exact position where this section begins.
      */
      const sectionTop = window.scrollY + rect.top;

      /*
        There are 2 transitions:

        IMAGE 1 → IMAGE 2
        IMAGE 2 → IMAGE 3

        Each transition gets 100vh.
      */
      const transitionDistance = window.innerHeight * 2;

      const scrolled = window.scrollY - sectionTop;

      const progress = Math.max(0, Math.min(scrolled / transitionDistance, 1));

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

    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  /* ============================================================
     TRANSITION

     0 → 1 = IMAGE 1 → IMAGE 2
     1 → 2 = IMAGE 2 → IMAGE 3
  ============================================================ */

  const storyProgress = scrollProgress * (steps.length - 1);

  /*
    Which image is currently on top.
  */
  const currentIndex = Math.min(Math.floor(storyProgress), steps.length - 1);

  /*
    Progress of the current transition.

    IMAGE 1 → IMAGE 2
      0 → 1

    IMAGE 2 → IMAGE 3
      0 → 1
  */
  const localProgress =
    currentIndex >= steps.length - 1 ? 0 : storyProgress - currentIndex;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white"
      style={{
        height: "300vh",
      }}
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

                    /*
                      CURRENT TEXT

                      Moves upward as the current image
                      moves upward.
                    */
                    if (index === currentIndex) {
                      translateY = -localProgress * 80;

                      opacity = 1 - localProgress;
                    }

                    /*
                      NEXT TEXT

                      Comes from below.
                    */
                    if (index === currentIndex + 1) {
                      translateY = 80 - localProgress * 80;

                      opacity = localProgress;
                    }

                    /*
                      FINAL TEXT
                    */
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

                          zIndex: index === currentIndex + 1 ? 20 : 10,
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
              RIGHT SIDE — EXACT OVERLAY
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
              /*
                ==================================================
                EVERY IMAGE HAS THE SAME POSITION
                ==================================================

                Image 1
                    ↓
                Image 2
                    ↓
                Image 3

                They are stacked exactly on top
                of each other.
              */

              let y = 0;

              let blur = 0;

              let scale = 1;

              /*
                ==================================================
                IMAGE 1
                ==================================================
              */

              if (index === 0) {
                if (currentIndex === 0) {
                  /*
                    Image 1 acts like a page.

                    It moves completely UP.
                  */

                  y = -localProgress * 100;

                  blur = 0;

                  scale = 1;
                } else {
                  /*
                    Image 1 has already left.
                  */

                  y = -100;

                  blur = 0;

                  scale = 1;
                }
              }

              /*
                ==================================================
                IMAGE 2
                ==================================================
              */

              if (index === 1) {
                /*
                  FIRST TRANSITION

                  Image 1 is moving away.

                  Image 2 does NOT move.

                  It is already sitting behind Image 1.
                */

                if (currentIndex === 0) {
                  y = 0;

                  /*
                    This is the important blur effect.

                    At the beginning:

                      blur = 14px

                    As Image 1 moves away:

                      blur = 0px
                  */

                  blur = 14 - localProgress * 14;

                  scale = 1.035 - localProgress * 0.035;
                }

                /*
                  SECOND TRANSITION

                  Image 2 is now the top page.

                  It moves UP exactly like Image 1.
                */

                if (currentIndex === 1) {
                  y = -localProgress * 100;

                  blur = 0;

                  scale = 1;
                }

                /*
                  Image 2 has finished.
                */

                if (currentIndex >= 2) {
                  y = -100;

                  blur = 0;

                  scale = 1;
                }
              }

              /*
                ==================================================
                IMAGE 3
                ==================================================
              */

              if (index === 2) {
                /*
                  Image 3 is completely hidden
                  underneath Images 1 and 2.
                */

                if (currentIndex === 0) {
                  y = 0;

                  blur = 14;

                  scale = 1.035;
                }

                /*
                  IMAGE 2 MOVES UP

                  Image 3 is revealed underneath.
                */

                if (currentIndex === 1) {
                  y = 0;

                  blur = 14 - localProgress * 14;

                  scale = 1.035 - localProgress * 0.035;
                }

                /*
                  Final state.
                */

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
                    /*
                      =================================================
                      STACK ORDER
                      =================================================

                      01 = TOP
                      02 = MIDDLE
                      03 = BOTTOM
                    */

                    zIndex: steps.length - index,

                    /*
                      IMPORTANT:

                      No opacity.

                      No fade.

                      No crossfade.

                      The top image physically moves away
                      and reveals the image underneath.
                    */

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

      <div className="lg:hidden">
        {steps.map((step) => (
          <div
            key={step.number}
            className="
              min-h-screen
              bg-white
              flex flex-col flex-col-reverse
            "
          >
            {/* IMAGE */}

            <div
              className="
                relative
                h-[70vh]
                w-full
                overflow-hidden
              "
            >
              <img
                src={step.image}
                alt={step.imageAlt}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            </div>

            {/* TEXT */}

            <div
              className="
                bg-white
                px-7
                py-14
                sm:px-10
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-4
                "
              >
                <span
                  className="
                    text-[11px]
                    tracking-[0.2em]
                    text-[#607080]
                  "
                >
                  {step.number}
                </span>

                <span
                  className="
                    h-px
                    w-8
                    bg-[#aeb5bc]
                  "
                />

                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    text-[#526171]
                  "
                >
                  {step.eyebrow}
                </span>
              </div>

              <h2
                className="
                  mt-8
                  text-right
                  font-serif
                  text-[38px]
                  font-normal
                  leading-[1.1]
                  tracking-[-0.02em]
                  text-[#171b22]
                "
              >
                {step.title}
              </h2>

              <p
                className="
                  mt-6
                  ml-auto
                  max-w-[520px]
                  text-right
                  font-mont
                  text-[15px]
                  leading-[1.85]
                  text-[#66717d]
                "
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
