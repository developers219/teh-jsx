import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import RequestCallback from "../ui/RequestCallback";

const WHATSAPP_NUMBER = "919211215500";

// WhatsApp logo as an outline icon (follows the button text colour)
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

const slides = [
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2200&q=90",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2200&q=90",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=90",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2200&q=90",
];

const SLIDE_INTERVAL = 5000;

/*
 * Domestic hero — same UI as the ThemePackages hero:
 *  - same section classes / padding (pt-44 clears the fixed navbar)
 *  - same dark overlay
 *  - same heading + subtitle styles
 * The only difference: the background is a slider.
 */
export default function Hero() {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState("right");

  // Auto change every 5 seconds (direction alternates right / left)
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection((prev) => (prev === "right" ? "left" : "right"));
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    if (index === activeSlide) return;

    setDirection(index > activeSlide ? "right" : "left");
    setActiveSlide(index);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 pb-8 pt-44 text-white lg:px-8">
      {/* Background slides (only the image moves) */}
      {slides.map((image, index) => {
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

      {/* Dark overlay so text stays readable (same as ThemePackages) */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/50 to-black/60" />

      <div className="relative z-30 mx-auto max-w-7xl">
        <h1 className="mt-4 min-h-[1.25em] max-w-3xl font-cg text-4xl font-bold capitalize sm:text-5xl">
          Domestic Destinations
        </h1>

        <p className="mt-4 max-w-2xl font-inter text-lg leading-8 text-slate-200">
          Discover the incredible beauty of India — from peaceful mountains and
          tropical beaches to royal cities, cultural escapes and unforgettable
          journeys.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCallbackOpen(true)}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-inter text-sm font-semibold text-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 sm:w-64"
          >
            <Phone size={17} strokeWidth={2} />
            Request a callback
          </button>

          {/* WhatsApp button: green pill + black icon */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3.5 font-inter text-sm font-semibold text-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300  sm:w-64"
          >
            <WhatsAppIcon size={20} />
            Chat With Us
          </a>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
        {slides.map((image, index) => (
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

      <RequestCallback isOpen={isCallbackOpen} setIsOpen={setIsCallbackOpen} />
    </section>
  );
}