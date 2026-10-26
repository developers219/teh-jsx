import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { getVideoTestimonials } from "../../services/video-testimonial.service";

const EASE = [0.22, 1, 0.36, 1];

/*
 * Page-turn animation. `custom` carries the direction
 * (1 = next, -1 = previous) to both entering and exiting pages.
 */
const spreadVariants = {
  enter: (direction) => ({
    rotateY: direction > 0 ? 8 : -8,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    rotateY: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.96,
  }),
};

function chunk(list, size) {
  const result = [];

  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }

  return result;
}

/* sm and above = open book (2 pages), below sm = 1 page at a time */
function useIsWide() {
  const query = "(min-width: 640px)";

  const [isWide, setIsWide] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const handleChange = (event) => setIsWide(event.matches);

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  return isWide;
}

/* =========================================================
   EMPTY PAGE (when the last spread has only one video)
========================================================= */

function BlankPage() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#f5f1e8] p-8 text-center">
      <p className="font-cg text-xl italic text-slate-400 sm:text-2xl">
        More stories coming soon…
      </p>
    </div>
  );
}

/* =========================================================
   SINGLE VIDEO PAGE
========================================================= */

function DiaryVideo({ testimonial, side, pageNumber, activeId, setActiveId }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const isActive = activeId === testimonial.id;

  const handleEnter = async () => {
    setActiveId(testimonial.id);
    setMuted(true);

    const video = videoRef.current;

    if (!video) return;

    try {
      video.muted = true;
      video.currentTime = 0;
      await video.play();
    } catch {
      // Browser may block playback until the visitor interacts.
    }
  };

  const handleLeave = () => {
    setActiveId(null);
    setMuted(true);

    const video = videoRef.current;

    if (!video) return;

    video.pause();
    video.currentTime = 0;
  };

  /* Click = turn sound on / off while the video is playing */
  const handleClick = () => {
    if (!isActive) {
      handleEnter();
      return;
    }

    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Watch ${testimonial.name}'s story`}
      className="relative h-full w-full cursor-pointer overflow-hidden outline-none"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Video */}
      <motion.video
        ref={videoRef}
        src={testimonial.poster ? testimonial.video : `${testimonial.video}#t=0.1`}
        poster={testimonial.poster || undefined}
        muted
        playsInline
        loop
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ scale: isActive ? 1.035 : 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      />

      {/* Paper light */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.12),transparent_20%,transparent_80%,rgba(0,0,0,.08))]" />

      {/* Dark gradient */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
        animate={{ opacity: isActive ? 1 : 0.8 }}
      />

      {/* Play indicator */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-black/20 backdrop-blur-md">
              <Play size={20} fill="white" className="ml-1 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-7">
        {(testimonial.destination || testimonial.date) && (
          <div className="mb-3 flex flex-wrap items-center gap-2 font-mont text-[9px] uppercase tracking-[0.2em] text-white/70 sm:text-[10px]">
            {testimonial.destination && <span>{testimonial.destination}</span>}

            {testimonial.destination && testimonial.date && (
              <span className="h-px w-5 bg-white/40" />
            )}

            {testimonial.date && <span>{testimonial.date}</span>}
          </div>
        )}

        {testimonial.quote && (
          <motion.p
            className="line-clamp-4 max-w-md font-cg text-lg font-medium leading-snug text-white sm:text-xl lg:text-2xl"
            animate={{ y: isActive ? 0 : 4 }}
          >
            “{testimonial.quote}”
          </motion.p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-mont text-[10px] font-medium uppercase tracking-[0.16em] text-white sm:text-xs">
            {testimonial.name}
          </span>

          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-white/70"
            >
              {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}

              <span className="font-mont text-[9px] uppercase tracking-widest">
                {muted ? "Sound off" : "Sound on"}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Page number */}
      <div
        className={`pointer-events-none absolute top-5 ${
          side === "left" ? "left-5" : "right-5"
        } font-mont text-[10px] uppercase tracking-[0.2em] text-white/60`}
      >
        {String(pageNumber).padStart(2, "0")}
      </div>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

export default function VideoTestimonials() {
  const isWide = useIsWide();
  const perSpread = isWide ? 2 : 1;

  const [testimonials, setTestimonials] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [lastPerSpread, setLastPerSpread] = useState(perSpread);

  const dragX = useMotionValue(0);

  /* Screen switched between 1-page and 2-page layout -> start from the first page */
  if (lastPerSpread !== perSpread) {
    setLastPerSpread(perSpread);
    setSpreadIndex(0);
    setActiveId(null);
  }

  /* ---------------------------------------------------------
     FETCH FROM BACKEND
  --------------------------------------------------------- */

  useEffect(() => {
    let isMounted = true;

    const fetchTestimonials = async () => {
      try {
        const list = await getVideoTestimonials();

        if (isMounted) setTestimonials(list);
      } catch (error) {
        console.error("Failed to fetch video testimonials:", error);

        if (isMounted) setTestimonials([]);
      }
    };

    fetchTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  const spreads = useMemo(
    () => chunk(testimonials, perSpread),
    [testimonials, perSpread],
  );

  const lastIndex = spreads.length - 1;

  /* ---------------------------------------------------------
     NAVIGATION
  --------------------------------------------------------- */

  const goTo = useCallback(
    (index) => {
      if (index < 0 || index > lastIndex || index === spreadIndex) return;

      setDirection(index > spreadIndex ? 1 : -1);
      setSpreadIndex(index);
      setActiveId(null);
    },
    [lastIndex, spreadIndex],
  );

  const nextPage = useCallback(
    () => goTo(spreadIndex + 1),
    [goTo, spreadIndex],
  );

  const previousPage = useCallback(
    () => goTo(spreadIndex - 1),
    [goTo, spreadIndex],
  );

  const closeDiary = useCallback(() => {
    setIsOpen(false);
    setActiveId(null);
  }, []);

  const handleDragEnd = (_, info) => {
    const threshold = 80;

    if (info.offset.x < -threshold) nextPage();
    if (info.offset.x > threshold) previousPage();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") nextPage();
      if (event.key === "ArrowLeft") previousPage();
      if (event.key === "Escape") closeDiary();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextPage, previousPage, closeDiary]);

  /* Nothing from the backend (or still loading) -> don't show an empty section */
  if (spreads.length === 0) return null;

  const currentSpread = spreads[Math.min(spreadIndex, lastIndex)];

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      {/* Background dots */}
      {/* <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#9b9487_0.7px,transparent_0.7px)] [background-size:18px_18px]" /> */}

      {/* Heading */}
      <div className="relative z-10 mx-auto mb-14 max-w-3xl text-center">
        <p className="mb-4 font-mont text-[10px] font-medium uppercase tracking-[0.35em] text-slate-500">
          Real stories from real journeys
        </p>

        <h2 className="font-cg text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-tight text-slate-900">
          Dear Diary{" "}
          {/* <span
            className="text-[1.15em] font-normal text-blue-400"
            style={{ fontFamily: '"Alex Brush", cursive' }}
          >
            Diary
          </span> */}
        </h2>

        <p className="mx-auto mt-5 max-w-xl font-mont text-sm leading-7 text-slate-500 sm:text-base">
          Every journey leaves a story behind.
          <br />
          Here are a few of ours.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= CLOSED DIARY ================= */}
        {!isOpen && (
          <motion.div
            key="closed-book"
            initial={{ opacity: 0, y: 30, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 1.05, rotateY: -85, x: -100 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative z-10 mx-auto w-full max-w-[680px]"
            style={{ perspective: 1500 }}
          >
            <motion.button
              type="button"
              onClick={() => setIsOpen(true)}
              whileHover={{ y: -8, rotateZ: -0.5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative aspect-[1.45/1] w-full cursor-pointer overflow-hidden rounded-[4px] bg-[#243a32] text-left shadow-[0_30px_70px_rgba(0,0,0,.22)]"
            >
              {/* Leather-like cover */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.08),transparent_30%),linear-gradient(135deg,#31483f,#182b25)]" />

              {/* Cover border */}
              <div className="absolute inset-5 rounded-[2px] border border-[#d7c6a0]/30 sm:inset-7" />

              {/* Spine */}
              <div className="absolute inset-y-0 left-0 w-5 bg-black/10 sm:w-7" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-100">
                <div className="mb-5 font-mont text-[9px] uppercase tracking-[0.5em] opacity-70">
                  Travel stories
                </div>

                <h3 className="font-cg text-5xl text-yellow-200 font-semibold sm:text-7xl">
                  Dear Diary
                </h3>

                <div className="mt-6 h-px w-20 bg-[#d7c6a0]/40" />

                <p className="mt-5 font-mont text-[10px] uppercase tracking-[0.3em] opacity-70">
                  Open our memories
                </p>
              </div>

              {/* Hover hint */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mont text-[9px] uppercase tracking-[0.3em] text-[#e4d6b7]/50 opacity-0 transition-opacity group-hover:opacity-100">
                Tap to open
              </div>
            </motion.button>

            {/* Shadow underneath */}
            <div className="absolute -bottom-5 left-[8%] right-[8%] -z-10 h-10 rounded-full bg-black/20 blur-2xl" />
          </motion.div>
        )}

        {/* ================= OPEN BOOK ================= */}
        {isOpen && (
          <motion.div
            key="open-book"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative z-10 mx-auto w-full max-w-[1200px]"
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeDiary}
              className="absolute -top-12 right-0 font-mont text-[10px] uppercase tracking-[0.25em] text-slate-400 transition hover:text-slate-900"
            >
              Close diary
            </button>

            {/* Book */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              style={{ x: dragX }}
              onDragEnd={handleDragEnd}
              className={`relative mx-auto cursor-grab overflow-hidden rounded-sm bg-[#f5f1e8] shadow-[0_35px_90px_rgba(0,0,0,.25)] active:cursor-grabbing ${
                isWide
                  ? "aspect-[1.45/1] w-[80%]"
                  : "aspect-[3/4] w-[88%] max-w-[420px]"
              }`}
            >
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={`${perSpread}-${spreadIndex}`}
                  custom={direction}
                  variants={spreadVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.75, ease: EASE }}
                  style={{ transformPerspective: 1800 }}
                  className="absolute inset-0"
                >
                  <div
                    className={`grid h-full w-full ${
                      isWide ? "grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {currentSpread.map((testimonial, position) => (
                      <div
                        key={testimonial.id}
                        className="relative overflow-hidden bg-[#f5f1e8]"
                      >
                        <DiaryVideo
                          testimonial={testimonial}
                          side={position === 0 ? "left" : "right"}
                          pageNumber={spreadIndex * perSpread + position + 1}
                          activeId={activeId}
                          setActiveId={setActiveId}
                        />

                        {/* Inner binding shadow */}
                        {isWide && (
                          <div
                            className={`pointer-events-none absolute inset-y-0 w-12 from-black/15 to-transparent ${
                              position === 0
                                ? "right-0 bg-gradient-to-l"
                                : "left-0 bg-gradient-to-r"
                            }`}
                          />
                        )}
                      </div>
                    ))}

                    {/* Odd number of videos -> blank right page */}
                    {isWide && currentSpread.length === 1 && (
                      <div className="relative overflow-hidden">
                        <BlankPage />
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/15 to-transparent" />
                      </div>
                    )}
                  </div>

                  {/* Center binding */}
                  {isWide && (
                    <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-black/15 shadow-[0_0_15px_rgba(0,0,0,.18)]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Navigation */}
            <div className="mt-7 flex items-center justify-between">
              <button
                type="button"
                onClick={previousPage}
                disabled={spreadIndex === 0}
                className="group flex items-center gap-3 font-mont text-[10px] uppercase tracking-[0.25em] text-slate-500 transition hover:text-slate-900 disabled:pointer-events-none disabled:opacity-20"
              >
                <ChevronLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {spreads.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === spreadIndex
                        ? "w-8 bg-slate-900"
                        : "w-1.5 bg-slate-300"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextPage}
                disabled={spreadIndex === lastIndex}
                className="group flex items-center gap-3 font-mont text-[10px] uppercase tracking-[0.25em] text-slate-500 transition hover:text-slate-900 disabled:pointer-events-none disabled:opacity-20"
              >
                Next
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>

            <p className="mt-5 text-center font-mont text-[9px] uppercase tracking-[0.25em] text-slate-400">
              {isWide
                ? "Drag the pages · Hover to watch · Click for sound"
                : "Swipe the pages · Tap to watch · Tap again for sound"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}