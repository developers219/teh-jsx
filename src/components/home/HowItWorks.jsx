import { useEffect, useRef, useState } from "react";
import Hiw1 from "../../assets/images/hiw1.mp4";
import Hiw2 from "../../assets/images/hiw2.mp4";
import Hiw3 from "../../assets/images/hiw3.mp4";
import Hiw4 from "../../assets/images/hiw4.mp4";

const steps = [
  {
    number: "01",
    eyebrow: "START WITH A CONVERSATION",
    title: "Tell us what you have in mind",
    description:
      "Share your destination, occasion, pace, or simply the kind of journey you’re looking for. We listen, ask the right questions, and understand what matters to you.",
    image: Hiw1,
    imageAlt: "Traveller planning a personalised journey",
  },
  {
    number: "02",
    eyebrow: "WE CURATE",
    title: "Every detail, thoughtfully chosen",
    description:
      "Our travel experts personally research and handpick exceptional stays, experiences, routes, restaurants, guides, and local discoveries — nothing chosen simply because it’s part of a package.",
    image: Hiw2,
    imageAlt: "Traveller exploring a curated destination",
  },
  {
    number: "03",
    eyebrow: "YOUR ITINERARY TAKES SHAPE",
    title: "A journey designed around you",
    description:
      "We create a 100% customised itinerary around your pace, preferences, and the experiences you want to remember. We refine every detail with you until it feels unmistakably yours.",
    image: Hiw3,
    imageAlt: "Couple enjoying a personalised travel experience",
  },
  {
    number: "04",
    eyebrow: "YOU SIMPLY TRAVEL",
    title: "Everything is taken care of",
    description:
      "From reservations and transfers to experiences and on-trip arrangements, everything is taken care of. Your journey is ready — all that remains is to experience it.",
    image: Hiw4,
    imageAlt: "Traveller enjoying a relaxing holiday",
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
        There are 2 transitions:

        IMAGE 1 → IMAGE 2
        IMAGE 2 → IMAGE 3

        Each transition gets 100vh.
      */
      // const transitionDistance = window.innerHeight * 2;
      const transitionDistance = window.innerHeight * (steps.length - 1);

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

  /*
    Which image is currently on top.
  */
  const currentIndex = Math.min(Math.floor(storyProgress), steps.length - 1);

  const localProgress =
    currentIndex >= steps.length - 1 ? 0 : storyProgress - currentIndex;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white"
      style={{
        height: `${steps.length * 100}vh`,
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

                {/* =================================================
    TEXT STACK
================================================== */}

                <div className="relative h-[520px] overflow-hidden">
                  {steps.map((step, index) => {
                    let translateY = 100;
                    let opacity = 0;

                    /*
      CURRENT STEP
      Moves upward and disappears.
    */
                    if (
                      index === currentIndex &&
                      currentIndex < steps.length - 1
                    ) {
                      translateY = -localProgress * 100;
                      opacity = 1 - localProgress;
                    }

                    /*
      NEXT STEP
      Enters from below.
    */
                    if (
                      index === currentIndex + 1 &&
                      currentIndex < steps.length - 1
                    ) {
                      translateY = 100 - localProgress * 100;
                      opacity = localProgress;
                    }

                    /*
      FINAL STEP
      Once reached, keep it completely visible.
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
          inset-x-0
          top-1/8
          w-full
          text-right
          will-change-transform
        "
                        style={{
                          transform: `translate3d(0, ${translateY}%, 0)`,
                          opacity,
                          pointerEvents: opacity > 0.5 ? "auto" : "none",
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

              /*
    ==================================================
    CURRENT STEP
    ==================================================

    The current video behaves like a page.

    It moves UP and reveals the next video underneath.
  */

              if (index === currentIndex) {
                y = -localProgress * 100;

                blur = 0;
                scale = 1;
              }

              /*
    ==================================================
    NEXT STEP
    ==================================================

    The next video is already underneath the
    current video.

    It stays in place while the current video
    moves away.

    It starts blurred/smaller and becomes clear
    as it is revealed.
  */

              if (index === currentIndex + 1) {
                y = 0;

                blur = 14 - localProgress * 14;

                scale = 1.035 - localProgress * 0.035;
              }

              /*
    ==================================================
    FUTURE STEPS
    ==================================================

    Anything beyond the immediate next step
    remains underneath, blurred and slightly scaled.
  */

              if (index > currentIndex + 1) {
                y = 0;

                blur = 14;

                scale = 1.035;
              }

              /*
    ==================================================
    PREVIOUS STEPS
    ==================================================

    Videos that have already been revealed
    have moved completely out of the viewport.
  */

              if (index < currentIndex) {
                y = -100;

                blur = 0;

                scale = 1;
              }

              /*
    ==================================================
    FINAL STEP
    ==================================================

    Once the last video is reached, keep it fixed
    and completely visible.
  */

              if (currentIndex === steps.length - 1) {
                if (index === currentIndex) {
                  y = 0;

                  blur = 0;

                  scale = 1;
                } else {
                  y = -100;
                  blur = 0;
                  scale = 1;
                }
              }

              /*
    ==================================================
    STACK ORDER
    ==================================================

    Current video:
      highest

    Next video:
      underneath current

    Everything else:
      underneath
  */

              const zIndex =
                index === currentIndex
                  ? 30
                  : index === currentIndex + 1
                    ? 20
                    : 10;

              return (
                <video
                  key={step.number}
                  src={step.image}
                  className="
        absolute
        inset-0
        h-full
        w-full
        aspect-square
        object-cover
        will-change-transform
      "
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    zIndex,
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
              
              bg-white
            "
          >
            {/* =================================================
                IMAGE
            ================================================== */}

            <div
              className="
                relative
                h-[50vh]
                w-full
                overflow-hidden
              "
            >
              {/* <img
                src={step.image}
                alt={step.imageAlt}
                className="
                  block
                  h-full
                  w-full
                  object-cover
                "
              /> */}
              <video
                src={step.image}
                className="
    absolute
    inset-0
    h-full
    w-full
    aspect-square
    object-cover
    will-change-transform
  "
                autoPlay
                loop
                muted
                playsInline
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
