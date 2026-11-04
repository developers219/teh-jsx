import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import RequestCallback from "../ui/RequestCallback";

const WHATSAPP_NUMBER = "919211215500";
const SLIDE_INTERVAL = 5000;

// Both CTA buttons: side by side on every screen size, label on one line
const BUTTON_BASE =
  "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 py-3.5 text-center font-inter text-[11px] font-semibold leading-tight text-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-1 min-[360px]:text-xs min-[400px]:px-3 min-[400px]:text-[13px] sm:w-64 sm:flex-none sm:gap-2 sm:px-7 sm:text-sm";

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

export default function Hero({ slides = [], name, desc }) {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState("right");

  // Backend images
  const images = slides?.map((slide) => slide?.image).filter(Boolean) || [];

  // Auto slide every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setDirection((prev) => (prev === "right" ? "left" : "right"));

      setActiveSlide((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [images.length]);

  // Handle manual slide navigation
  const goToSlide = (index) => {
    if (index === activeSlide) return;

    setDirection(index > activeSlide ? "right" : "left");
    setActiveSlide(index);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 px-5 pb-10 pt-36 text-white sm:px-6 sm:pb-8 sm:pt-44 lg:px-8">
      {/* Backend background image slider */}
      {images.map((image, index) => {
        const isActive = index === activeSlide;

        return (
          <div
            key={image}
            aria-hidden="true"
            className={`absolute inset-0 overflow-hidden transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isActive
                ? "z-10 translate-x-0"
                : direction === "right"
                  ? "z-0 -translate-x-full"
                  : "z-0 translate-x-full"
            }`}
          >
            <img
              src={image}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        );
      })}

      {/* Dark overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/50 to-black/60" />

      {/* Hero content */}
      <div className="relative z-30 mx-auto max-w-7xl">
        {/* Backend destination name */}
        <h1 className="mt-4 min-h-[1.25em] max-w-3xl break-words font-cg text-3xl font-bold capitalize min-[400px]:text-4xl sm:text-5xl">
          {name}
        </h1>

        {/* Backend destination description */}
        {desc && (
          <p className="mt-3 max-w-2xl font-inter text-base leading-7 text-slate-200 sm:mt-4 sm:text-lg sm:leading-8">
            {desc}
          </p>
        )}

        {/* CTA buttons: always side by side, on every screen size */}
        <div className="mt-6 flex items-stretch gap-2 sm:gap-3">
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

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Show destination image ${index + 1}`}
              className={`cursor-pointer rounded-full transition-all duration-500 ${
                activeSlide === index
                  ? "h-1.5 w-7 bg-white"
                  : "h-1.5 w-1.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

      {/* Request Callback Popup */}
      <RequestCallback isOpen={isCallbackOpen} setIsOpen={setIsCallbackOpen} />
    </section>
  );
}