import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Phone } from "lucide-react";
import RequestCallback from "../ui/RequestCallback";

const WHATSAPP_NUMBER = "919211215500";
const SLIDE_INTERVAL = 5000;
const SLIDE_DURATION = 1.2;
const SWIPE_THRESHOLD = 50; // px

// "next" = new slide enters from the right, "prev" = from the left
const SLIDE_VARIANTS = {
  enter: (direction) => ({
    x: direction === "next" ? "100%" : "-100%",
    zIndex: 2,
  }),
  center: { x: 0, zIndex: 2 },
  exit: (direction) => ({
    x: direction === "next" ? "-100%" : "100%",
    zIndex: 1,
  }),
};

// Same size as the About Us hero: 70% of the screen height, but never taller
// than 24.5rem (392px). The image always covers the whole box (object-cover),
// on every screen size. The navbar (fixed, transparent at the top) sits on it.
const HERO_SIZE = "h-[70vh] max-h-98 min-h-[21rem]";

// Both CTA buttons: side by side on every screen size, label on one line
const BUTTON_BASE =
  "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 py-2.5 text-center font-inter text-[11px] font-semibold leading-tight text-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-1 min-[360px]:text-xs min-[400px]:px-3 min-[400px]:text-[13px] sm:w-64 sm:flex-none sm:gap-2 sm:px-7 sm:py-3 sm:text-sm";

// WhatsApp outline icon
function WhatsAppIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

/*
 * Destination hero (props from the backend: slides, name, desc).
 * Size + image behaviour are the same as the About Us hero:
 *  - height: 70vh, max 24.5rem (392px) on every screen size
 *  - the image fills the whole box (object-cover), no bars on any screen
 *  - content (title, text, buttons) at the bottom, inside the image
 * Slider works with 1 image (static) or many images (auto + dots + swipe).
 * Buttons stay side by side on every screen size.
 */
export default function Hero({ slides = [], name, desc }) {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState("next");
  const [failedImages, setFailedImages] = useState([]); // broken image urls

  const touchStartX = useRef(null);
  const reduceMotion = useReducedMotion();

  // Backend images (duplicates + broken urls removed)
  const images = useMemo(() => {
    const list = slides?.map((slide) => slide?.image).filter(Boolean) || [];

    return [...new Set(list)].filter((image) => !failedImages.includes(image));
  }, [slides, failedImages]);

  const imageCount = images.length;
  const current = imageCount ? activeSlide % imageCount : 0;

  // Auto slide every 5 seconds. Depends on activeSlide, so the timer
  // restarts after a manual change (dot click / swipe).
  useEffect(() => {
    if (imageCount <= 1) return undefined;

    const timer = setTimeout(() => {
      setDirection("next");
      setActiveSlide((prev) => (prev + 1) % imageCount);
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timer);
  }, [imageCount, activeSlide]);

  // Preload the next image so it is ready before it slides in
  useEffect(() => {
    if (imageCount < 2) return;

    const preload = new Image();
    preload.src = images[(current + 1) % imageCount];
  }, [images, imageCount, current]);

  // Handle manual slide navigation
  const goToSlide = (index) => {
    if (index === current) return;

    setDirection(index > current ? "next" : "prev");
    setActiveSlide(index);
  };

  const step = (delta) => {
    if (imageCount < 2) return;

    setDirection(delta > 0 ? "next" : "prev");
    setActiveSlide((current + delta + imageCount) % imageCount);
  };

  // Swipe on touch screens
  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const distance = event.changedTouches[0].clientX - touchStartX.current;

    touchStartX.current = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;

    step(distance < 0 ? 1 : -1);
  };

  const handleImageError = (image) => {
    setFailedImages((prev) => (prev.includes(image) ? prev : [...prev, image]));
  };

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full overflow-hidden bg-slate-950 text-white ${HERO_SIZE}`}
    >
      {/* Backend background image slider: always fills the whole hero */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {/* initial={false}: the first image is shown without a slide-in */}
        <AnimatePresence initial={false} custom={direction}>
          {imageCount > 0 && (
            <motion.div
              key={images[current]}
              custom={direction}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: reduceMotion ? 0 : SLIDE_DURATION,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="absolute inset-0 overflow-hidden"
            >
              <img
                src={images[current]}
                alt=""
                draggable={false}
                decoding="async"
                onError={() => handleImageError(images[current])}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dark overlay: stronger at the bottom (text) and a bit at the top (navbar) */}
      <div className="absolute inset-0 z-20 bg-linear-to-t from-black/80 via-black/20 to-black/55" />

      {/* Hero content: INSIDE the image, bottom aligned (below the navbar) */}
      <div className="absolute inset-x-0 bottom-0 top-20 z-30 lg:top-24">
        <div className="mx-auto flex h-full w-full max-w-7xl items-end px-4 lg:px-6 xl:px-0">
          <div className="flex w-full flex-col justify-end gap-3 pb-7 sm:gap-4 sm:pb-8 lg:gap-5 lg:pb-9">
            {/* Text */}
            <div
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}
              className="flex w-full flex-col gap-1.5 px-0 sm:gap-2 sm:px-2 lg:gap-3"
            >
              {/* Backend destination name */}
              <h1 className="line-clamp-2 max-w-3xl break-words font-cg text-2xl font-bold capitalize leading-tight sm:text-4xl lg:text-5xl">
                {name}
              </h1>

              {/* Backend destination description */}
              {desc && (
                <p className="line-clamp-2 max-w-2xl font-inter text-[13px] leading-5 text-slate-200 sm:line-clamp-3 sm:text-base sm:leading-7">
                  {desc}
                </p>
              )}
            </div>

            {/* CTA buttons: always side by side, on every screen size */}
            <div className="flex w-full items-stretch gap-2 px-0 sm:gap-3 sm:px-2">
              {/* Request Callback */}
              <button
                type="button"
                onClick={() => setIsCallbackOpen(true)}
                className={`${BUTTON_BASE} cursor-pointer bg-white hover:bg-slate-100`}
              >
                <Phone
                  size={16}
                  strokeWidth={2}
                  className="size-3.5 shrink-0 min-[400px]:size-4"
                />
                Request a callback
              </button>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BUTTON_BASE} bg-yellow-400 hover:bg-yellow-300`}
              >
                <span className="shrink-0 [&>svg]:size-4 min-[400px]:[&>svg]:size-[18px]">
                  <WhatsAppIcon size={18} />
                </span>
                Chat With Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators (only when there is more than one image) */}
      {imageCount > 1 && (
        <div className="absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 items-center sm:bottom-1 lg:bottom-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Show destination image ${index + 1}`}
              aria-current={current === index}
              className="group flex cursor-pointer items-center justify-center p-1.5"
            >
              <span
                className={`block h-1.5 rounded-full shadow-sm transition-all duration-500 ${
                  current === index
                    ? "w-7 bg-white"
                    : "w-1.5 bg-white/60 group-hover:bg-white"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Request Callback Popup */}
      <RequestCallback isOpen={isCallbackOpen} setIsOpen={setIsCallbackOpen} />
    </section>
  );
}