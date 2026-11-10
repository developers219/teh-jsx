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

// Height model (same idea as the home hero, herotemp):
//  - below lg (phones / tablets): the hero is as tall as the image itself
//    (its real width / height ratio), so the WHOLE image is shown and the text
//    sits on top of it. min-h-[16rem] keeps room for the text: if the image
//    would be shorter than that, the hero grows a little (small side crop).
//  - lg and up (desktop): fixed banner, same size as the About Us hero:
//    70vh, max 24.5rem (392px). The image covers it (object-cover), so a
//    wide banner shows only a strip of the image - raise lg:max-h-98 to show more.
// The navbar (fixed, transparent at the top) sits on the image.
const MIN_RATIO = 0.8;
const MAX_RATIO = 2.4;
const DEFAULT_RATIO = 16 / 9;
const HERO_SIZE =
  "aspect-(--hero-ratio) min-h-[16rem] lg:aspect-auto lg:h-[70vh] lg:max-h-98 lg:min-h-[21rem]";

// Both CTA buttons: side by side on every screen size, label on one line.
// Text size, padding and gap scale smoothly with the screen width.
const BUTTON_BASE =
  "inline-flex min-w-0 flex-1 items-center justify-center gap-[clamp(0.375rem,1vw,0.5rem)] whitespace-nowrap rounded-full px-[clamp(0.5rem,2vw,1.75rem)] py-[clamp(0.625rem,1.2vw,0.75rem)] text-center font-inter text-[clamp(0.6875rem,2.6vw,0.875rem)] font-semibold leading-tight text-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-1 sm:w-64 sm:flex-none";

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
 *  - phones / tablets (< lg): hero height = the image's own ratio, so the whole
 *    image is shown (like the home hero), text + buttons on top of it
 *  - desktop (lg+): banner like the About Us hero (70vh, max 24.5rem),
 *    image covers it
 *  - content (title, text, buttons) at the bottom, inside the image
 * Slider works with 1 image (static) or many images (auto + dots + swipe).
 * Buttons stay side by side on every screen size.
 */
export default function Hero({ slides = [], name, desc }) {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState("next");
  const [failedImages, setFailedImages] = useState([]); // broken image urls
  const [imageRatio, setImageRatio] = useState(null); // width / height of the 1st image

  const touchStartX = useRef(null);
  const reduceMotion = useReducedMotion();

  // Backend images (duplicates + broken urls removed)
  const images = useMemo(() => {
    const list = slides?.map((slide) => slide?.image).filter(Boolean) || [];

    return [...new Set(list)].filter((image) => !failedImages.includes(image));
  }, [slides, failedImages]);

  const imageCount = images.length;
  const current = imageCount ? activeSlide % imageCount : 0;

  // Phones / tablets: hero height = ratio of the first image (whole image shown).
  // Other images with a different ratio just cover the same box.
  const firstImage = images[0];

  useEffect(() => {
    if (!firstImage) return undefined;

    let isActive = true;
    const probe = new Image();

    probe.onload = () => {
      if (isActive && probe.naturalWidth && probe.naturalHeight) {
        setImageRatio(probe.naturalWidth / probe.naturalHeight);
      }
    };
    probe.src = firstImage;

    return () => {
      isActive = false;
    };
  }, [firstImage]);

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

  const ratio = Math.min(
    Math.max(imageRatio || DEFAULT_RATIO, MIN_RATIO),
    MAX_RATIO,
  );

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ "--hero-ratio": ratio }}
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
          <div className="flex w-full flex-col justify-end gap-[clamp(0.75rem,1.5vw,1.25rem)] pb-[clamp(1.5rem,3vw,2.25rem)]">
            {/* Text */}
            <div
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}
              className="flex w-full flex-col gap-[clamp(0.375rem,1vw,0.75rem)] px-0 sm:px-2"
            >
              {/* Backend destination name: fluid size, 24px -> 48px */}
              <h1 className="line-clamp-2 max-w-3xl break-words font-cg text-[clamp(1.5rem,5vw,3rem)] font-bold capitalize leading-tight">
                {name}
              </h1>

              {/* Backend destination description */}
              {desc && (
                <p className="line-clamp-2 max-w-2xl font-inter text-[clamp(0.875rem,2.2vw,1.125rem)] leading-[1.6] text-slate-200 sm:line-clamp-3">
                  {desc}
                </p>
              )}
            </div>

            {/* CTA buttons: always side by side, on every screen size */}
            <div className="flex w-full items-stretch gap-[clamp(0.5rem,1.2vw,0.75rem)] px-0 sm:px-2">
              {/* Request Callback */}
              <button
                type="button"
                onClick={() => setIsCallbackOpen(true)}
                className={`${BUTTON_BASE} cursor-pointer bg-white hover:bg-slate-100`}
              >
                <Phone
                  size={16}
                  strokeWidth={2}
                  className="size-[clamp(0.875rem,2.6vw,1rem)] shrink-0"
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
                <span className="shrink-0 [&>svg]:size-[clamp(1rem,3vw,1.125rem)]">
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