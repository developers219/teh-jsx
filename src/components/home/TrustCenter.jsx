import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import tc1 from "../../assets/images/tc1.png";
import tc2 from "../../assets/images/tc2.png";
import tc3 from "../../assets/images/tc3.png";
import tc4 from "../../assets/images/tc4.png";

// const stories = [
//   {
//     label: "PREFERRED HOTEL PARTNERS",
//     title: "VIP Perks and Upgrades Await",
//     description:
//       "Indulge in exclusive VIP upgrades at our preferred hotel partners. Enjoy complimentary room upgrades, late check-outs, welcome amenities, and more — all designed to enhance your stay and ensure unforgettable moments.",
//     image: tc1,
//   },
//   {
//     label: "CRUISE PARTNERS",
//     title: "Ultra-Small Luxury Cruises And More",
//     description:
//       "Experience the intimacy and exclusivity of boutique ships, offering personalized service, gourmet dining, and access to hidden ports that larger vessels can't reach.",
//     image: tc2,
//   },
//   {
//     label: "EXPERIENCE PARTNERS",
//     title: "Early Access To The Newest Tours",
//     description:
//       "From private guided tours of iconic landmarks to behind-the-scenes cultural experiences, our privileged connections grant you unparalleled opportunities to explore in style.",
//     image: tc3,
//   },
//   {
//     label: "HYPER-PERSONALIZATION",
//     title: "Bespoke Travel Tailored To You",
//     description:
//       "Your journey should be as unique as you are. That's why we craft bespoke travel experiences tailored to your style, interests, and personality.",
//     image: tc4,
//   },
// ];

const stories = [
  {
    label: "TRUSTED PARTNERSHIPS",
    title: "Trusted Travel Network",
    description:
      "We work with established travel partners and trusted service providers, using long-standing relationships to secure dependable experiences and competitive value from booking to return.",
    image: tc1,
  },

  {
    label: "PERSONAL SUPPORT",
    title: "Someone Always Has Your Back",
    description:
      "When plans change or the unexpected happens, our team stays connected to assist, guide, and help you find the right way forward.",
    image: tc2,
  },

  {
    label: "RELATIONSHIPS THAT LAST",
    title: "Relationships That Speak for Us",
    description:
      "Trust is earned over time. Returning travellers, referrals, and families who continue to travel with us are the relationships we value most.",
    image: tc3,
  },

  {
    label: "TRAVEL WITH PURPOSE",
    title: "Memories Over Transactions",
    description:
      "We’re not focused on simply selling a holiday. We care about creating journeys people remember, talk about, and come back to experience again.",
    image: tc4,
  },
];

function TrustCenter() {
  const sectionRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  /*
   * Motion tracks the scroll progress of THIS section.
   *
   * 0 = section starts entering viewport
   * 1 = section completely leaves viewport
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /*
   * ------------------------------------------------------------
   * STORY PROGRESS
   * ------------------------------------------------------------
   *
   * We only use the first 50% of the section's scroll progress.
   *
   * 0.000  -> Story 1
   * 0.125  -> Story 2
   * 0.250  -> Story 3
   * 0.375  -> Story 4
   * 0.500  -> Story 4 remains visible
   *
   * After 0.5 the stories stop changing and the entire section
   * simply scrolls away.
   */
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (window.innerWidth < 1024) return;

    /*
     * Clamp the animation area between 0 and 0.5.
     */
    const storyProgress = Math.min(Math.max(latest, 0), 0.5);

    /*
     * Convert 0 -> 0.5 into 0 -> 1.
     */
    const normalizedProgress = storyProgress / 0.5;

    /*
     * Four stories.
     *
     * 0.00 - 0.249 -> Story 1
     * 0.25 - 0.499 -> Story 2
     * 0.50 - 0.749 -> Story 3
     * 0.75 - 1.00  -> Story 4
     */
    const index = Math.min(
      stories.length - 1,
      Math.floor(normalizedProgress * stories.length),
    );

    setActiveIndex(index);
  });

  const activeStory = stories[activeIndex];

  return (
    <>
      {/* =========================================================
          DESKTOP
          ========================================================= */}

      <section
        ref={sectionRef}
        className="
          relative
          hidden
          h-[200vh]
          w-full
          bg-white
          lg:block
        "
      >
        {/* =======================================================
            STICKY VIEWPORT
            ======================================================= */}

        <div
          className="
            sticky
            top-0
            flex
            h-screen
            w-full
            items-center
            justify-center
            overflow-hidden
            bg-white
            px-8
            xl:px-12
          "
        >
          {/* =====================================================
              MAIN CONTAINER
              ===================================================== */}

          <div
            className="
              flex
              w-full
              max-w-[1150px]
              items-center
              justify-center
              gap-12
              xl:max-w-[1250px]
              xl:gap-20
              2xl:max-w-[1350px]
              2xl:gap-24
            "
          >
            {/* =================================================
                IMAGE
                ================================================= */}

            <div
              className="
                relative
                h-[520px]
                w-[430px]
                shrink-0
                overflow-hidden
                rounded-[18px]
                bg-neutral-100
                xl:h-[580px]
                xl:w-[470px]
                2xl:h-[620px]
                2xl:w-[500px]
              "
            >
              {stories.map((story, index) => (
                <motion.img
                  key={story.image}
                  src={story.image}
                  alt={story.title}
                  initial={false}
                  animate={{
                    opacity: index === activeIndex ? 1 : 0,
                    scale: index === activeIndex ? 1 : 1.04,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    scale: {
                      duration: 0.8,
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
              ))}
            </div>

            {/* =================================================
                TEXT
                ================================================= */}

            <div
              className="
                relative
                flex
                w-full
                max-w-[460px]
                flex-col
                justify-center
                xl:max-w-[500px]
                2xl:max-w-[540px]
              "
            >
              {stories.map((story, index) => (
                <motion.div
                  key={story.title}
                  initial={false}
                  animate={{
                    opacity: index === activeIndex ? 1 : 0,
                    y:
                      index === activeIndex
                        ? 0
                        : index < activeIndex
                          ? -70
                          : 70,
                    filter: index === activeIndex ? "blur(0px)" : "blur(12px)",
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`
                    ${
                      index === activeIndex
                        ? "relative"
                        : "pointer-events-none absolute inset-0"
                    }
                  `}
                >
                  {/* LABEL */}

                  <div className="mb-6">
                    <span
                      className="
                        font-mont
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[6px]
                        text-neutral-500
                      "
                    >
                      {story.label}
                    </span>
                  </div>

                  {/* TITLE */}

                  <h2
                    className="
                      max-w-[520px]
                      text-[48px]
                      font-normal
                      leading-[1.06]
                      tracking-[-0.045em]
                      text-[#25272b]
                      xl:text-[54px]
                      2xl:text-[60px]
                    "
                  >
                    {story.title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p
                    className="
                      mt-7
                      max-w-[440px]
                      font-mont
                      text-[15px]
                      leading-[1.75]
                      tracking-[0.01em]
                      text-gray-600
                      xl:text-[16px]
                    "
                  >
                    {story.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* =====================================================
              PROGRESS INDICATOR
              ===================================================== */}

          <div
            className="
              absolute
              bottom-10
              left-1/2
              flex
              -translate-x-1/2
              items-center
              gap-2
            "
          >
            {stories.map((_, index) => (
              <motion.div
                key={index}
                className="h-[2px] bg-neutral-300"
                animate={{
                  width: index === activeIndex ? 40 : 16,
                  backgroundColor: index === activeIndex ? "white" : "white",
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          MOBILE / TABLET
          ========================================================= */}

      <section
        className="
          block
          w-full
          bg-white
          px-4
          py-12
          lg:hidden
          sm:px-6
          sm:py-16
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
                  aspect-[4/3]
                  w-full
                  overflow-hidden
                  rounded-[18px]
                  bg-neutral-100
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
                    text-[clamp(2rem,4vw,3rem)]
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
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default TrustCenter;
