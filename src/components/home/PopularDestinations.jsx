// import { useEffect, useMemo, useState } from "react";
// import { motion } from "motion/react";
// import Alert from "@mui/material/Alert";
// import Skeleton from "@mui/material/Skeleton";
// import DestinationCard from "../ui/DestinationCard";
// import api from "../../services/api";
// import SectionHeader from "./SectionHeader";
// function PopularDestinations() {
//   const [destinations, setDestinations] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//   useEffect(() => {
//     async function fetchDestinations() {
//       try {
//         setIsLoading(true);
//         setErrorMessage("");
//         const response = await api.get("/destinations");
//         setDestinations(response.data.data);
//       } catch (error) {
//         setErrorMessage("Trending destinations could not be loaded right now.");
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchDestinations();
//   }, []);
//   /*
//    * Show exactly up to 3 destinations.
//    *
//    * Featured destinations get priority.
//    * If there are fewer than 3 featured destinations,
//    * fill the remaining slots with normal destinations.
//    */
//   const trendingDestinations = useMemo(() => {
//     const featured = destinations.filter(
//       (destination) => destination.isFeatured
//     );
//     const nonFeatured = destinations.filter(
//       (destination) => !destination.isFeatured
//     );
//     return [...featured, ...nonFeatured].slice(0, 3);
//   }, [destinations]);
//   console.log(trendingDestinations);
//   return (
//     <section className="bg-white px-6 py-20 lg:px-8">
//       <div className="mx-auto w-full max-w-7xl">
//         {/* ================= SECTION HEADER ================= */}

//         <SectionHeader
//           title="Trending Destinations"
//           description="Discover our most popular destinations and start planning your next journey."
//         />

//         {/* ================= LOADING ================= */}

//         {isLoading ? (
//           <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
//             {Array.from({ length: 3 }).map((_, index) => (
//               <Skeleton
//                 key={index}
//                 variant="rounded"
//                 height={430}
//                 animation="wave"
//                 sx={{
//                   borderRadius: "24px",
//                 }}
//               />
//             ))}
//           </div>
//         ) : null}

//         {/* ================= ERROR ================= */}

//         {!isLoading && errorMessage ? (
//           <Alert severity="error" className="mt-12">
//             {errorMessage}
//           </Alert>
//         ) : null}

//         {/* ================= DESTINATION CARDS ================= */}

//         {!isLoading && !errorMessage && trendingDestinations.length > 0 ? (
//           <div className="overflow-hidden mt-12">
//             <motion.div
//               className="flex w-max gap-6"
//               animate={{
//                 x: ["0%", "-50%"],
//               }}
//               transition={{
//                 x: {
//                   repeat: Infinity,
//                   repeatType: "loop",
//                   duration: 15,
//                   ease: "linear",
//                 },
//               }}
//             >
//               {[...trendingDestinations, ...trendingDestinations].map(
//                 (destination) => (
//                   <DestinationCard
//                     key={destination.id}
//                     destination={destination}
//                   />
//                 )
//               )}
//             </motion.div>
//           </div>
//         ) : null}

//         {/* ================= NO DESTINATIONS ================= */}

//         {!isLoading && !errorMessage && trendingDestinations.length === 0 ? (
//           <div className="mt-12 text-center text-sm text-slate-500">
//             No destinations available right now.
//           </div>
//         ) : null}
//       </div>
//     </section>
//   );
// }
// export default PopularDestinations;
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Faroe Islands",
    description:
      "Dramatic cliffs, quiet villages and endless Atlantic horizons. Discover one of Europe's most untouched destinations, where nature takes center stage.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90",
  },
  {
    id: 2,
    name: "Santorini",
    description:
      "Whitewashed villages carved into volcanic cliffs, deep blue waters and sunsets that turn the Aegean into a painting.",
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2200&q=90",
  },
  {
    id: 3,
    name: "Kyoto",
    description:
      "Ancient temples, lantern-lit streets and gardens shaped by centuries of Japanese tradition.",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2200&q=90",
  },
  {
    id: 4,
    name: "Patagonia",
    description:
      "Wild mountains, turquoise lakes and enormous open landscapes. Patagonia is an invitation to disappear into the wilderness.",
    imageUrl:
      "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=2200&q=90",
  },
  {
    id: 5,
    name: "Amalfi Coast",
    description:
      "Cliffside towns, winding coastal roads and Mediterranean waters. Experience the timeless charm of Italy's coastline.",
    imageUrl:
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=2200&q=90",
  },
  {
    id: 6,
    name: "Iceland",
    description:
      "Glaciers, black sand beaches, waterfalls and volcanic landscapes create a world that feels beautifully otherworldly.",
    imageUrl:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=2200&q=90",
  },
];

function PopularDestinations() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /*
   * Instead of giving every slide its own animation,
   * calculate ONE continuous slide position.
   *
   * 0    = first destination
   * 1    = second destination
   * 2    = third destination
   * etc.
   */
  const slidePosition = useTransform(
    scrollYProgress,
    [0, 1],
    [0, destinations.length - 1]
  );

  useMotionValueEvent(slidePosition, "change", (latest) => {
    const index = Math.round(latest);

    setActiveIndex(Math.max(0, Math.min(destinations.length - 1, index)));
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-black"
      style={{
        height: `${destinations.length * 100}vh`,
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* =====================================================
            DESTINATION IMAGES
        ===================================================== */}

        {destinations.map((destination, index) => (
          <DestinationImage
            key={destination.id}
            destination={destination}
            index={index}
            slidePosition={slidePosition}
          />
        ))}

        {/* =====================================================
            OVERLAYS
        ===================================================== */}

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/20 to-black/10" />

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* =====================================================
            COUNTER
        ===================================================== */}

        <DestinationCounter
          activeIndex={activeIndex}
          total={destinations.length}
        />

        {/* =====================================================
            CONTENT
        ===================================================== */}

        {destinations.map((destination, index) => (
          <DestinationContent
            key={destination.id}
            destination={destination}
            index={index}
            slidePosition={slidePosition}
          />
        ))}

        {/* =====================================================
            BOTTOM
        ===================================================== */}

        <div className="absolute bottom-8 left-8 z-40 flex items-center gap-4 text-white lg:left-12">
          <span className="text-[9px] uppercase tracking-[0.35em] text-white/60">
            Destinations
          </span>

          <div className="h-px w-20 bg-white/30">
            <motion.div
              className="h-full origin-left bg-white"
              style={{
                scaleX: scrollYProgress,
              }}
            />
          </div>

          <span className="font-mono text-[10px] text-white/60">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(destinations.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   IMAGE
========================================================= */

function DestinationImage({ destination, index, slidePosition }) {
  /*
   * Every image has a position relative to the SAME
   * continuously moving slide track.
   *
   * index 0:
   *   slidePosition 0 → center
   *   slidePosition 1 → -100vh
   *
   * index 1:
   *   slidePosition 0 → +100vh
   *   slidePosition 1 → center
   */

  const y = useTransform(
    slidePosition,
    [index - 1, index, index + 1],
    ["100%", "0%", "-100%"]
  );

  /*
   * Slight image zoom while entering/leaving.
   */
  const scale = useTransform(
    slidePosition,
    [index - 1, index, index + 1],
    [1.12, 1, 1.08]
  );

  /*
   * Fade only when sufficiently away from the viewport.
   */
  const opacity = useTransform(
    slidePosition,
    [index - 1.15, index - 0.85, index + 0.85, index + 1.15],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{
        y,
        opacity,
        zIndex: 5,
      }}
    >
      <motion.img
        src={destination.imageUrl}
        alt={destination.name}
        className="h-full w-full object-cover"
        style={{
          scale,
        }}
      />
    </motion.div>
  );
}

/* =========================================================
   CONTENT
========================================================= */

function DestinationContent({ destination, index, slidePosition }) {
  /*
   * Content moves exactly with its image.
   */
  const y = useTransform(
    slidePosition,
    [index - 1, index, index + 1],
    ["100%", "0%", "-100%"]
  );

  /*
   * Content fades a little faster than image.
   */
  const opacity = useTransform(
    slidePosition,
    [index - 0.75, index - 0.25, index + 0.25, index + 0.75],
    [0, 1, 1, 0]
  );

  /*
   * Tiny scale gives the content a more editorial feel.
   */
  const scale = useTransform(
    slidePosition,
    [index - 1, index, index + 1],
    [0.97, 1, 0.98]
  );

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center"
      style={{
        y,
        opacity,
        scale,
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="ml-auto max-w-2xl lg:mr-[5%]">
          {/* LABEL */}

          <div className="mb-5 flex items-center gap-4 text-white/80">
            <span className="h-px w-10 bg-white/80" />

            <span className="text-[10px] uppercase tracking-[0.45em]">
              Destination of the week
            </span>
          </div>

          {/* TITLE */}

          <h2
            className="text-6xl font-thin leading-[0.88] tracking-[-0.045em] text-white sm:text-7xl lg:text-[7.5rem]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            {destination.name}
          </h2>

          {/* DESCRIPTION */}

          <p className="mt-7 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
            {destination.description}
          </p>

          {/* BUTTONS */}

          <div className="mt-9 flex flex-wrap gap-3">
            {/* WHITE BUTTON */}

            <button className="group relative flex h-12 items-center overflow-hidden rounded-full bg-white px-6 text-xs font-semibold uppercase tracking-[0.12em] text-black">
              <span className="transition-transform duration-500">
                Explore More
              </span>

              <ArrowUpRight
                size={15}
                className="ml-3 transition-transform duration-500 group-hover:rotate-45"
              />
            </button>

            {/* GLASS BUTTON */}

            <button className="group flex h-12 items-center rounded-full border border-white/30 bg-white/20 px-5 text-xs uppercase tracking-[0.1em] text-white backdrop-blur-md transition-colors hover:bg-white/30">
              Explore {destination.name}
              <ArrowUpRight
                size={15}
                className="ml-3 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   COUNTER
========================================================= */

function DestinationCounter({ activeIndex, total }) {
  const number = String(activeIndex + 1).padStart(2, "0");

  return (
    <div className="absolute left-7 top-24 z-40 lg:left-12 lg:top-28 size-48">
      <div
        className="flex h-[110px]  font-serif text-[6rem] leading-none tracking-[-0.06em] text-white/80 lg:text-[7rem]"
        style={{ fontFamily: "Cormorant Garamond" }}
      >
        <span>0</span>

        <div className="relative h-[1em]">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={number[1]}
              initial={{
                y: "100%",
              }}
              animate={{
                y: "0%",
              }}
              exit={{
                y: "-100%",
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block"
            >
              {number[1]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default PopularDestinations;
