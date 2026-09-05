import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2200&q=90",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2200&q=90",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=90",
  },
  {
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2200&q=90",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState("right");

  /*
   * Automatically change image every 5 seconds.
   *
   * Direction alternates:
   * 1 → image comes from right
   * 2 → image comes from left
   * 3 → image comes from right
   * 4 → image comes from left
   */

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection((prevDirection) =>
        prevDirection === "right" ? "left" : "right"
      );

      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /*
   * Allow clicking the small indicators.
   */

  const goToSlide = (index) => {
    if (index === activeSlide) return;

    setDirection(index > activeSlide ? "right" : "left");
    setActiveSlide(index);
  };

  return (
    



      <section className="relative h-[520px] w-full overflow-hidden sm:h-[570px] md:h-[620px] lg:h-[680px] xl:h-[700px]">

        {/* =====================================================
            BACKGROUND SLIDES
        ====================================================== */}

        {slides.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <div
              key={index}
              className={`absolute inset-0 overflow-hidden transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isActive
                  ? "z-10 translate-x-0"
                  : direction === "right"
                  ? "z-0 -translate-x-full"
                  : "z-0 translate-x-full"
              }`}
            >

              {/* IMAGE */}

              <img
                src={slide.image}
                alt="Domestic destination in India"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* =================================================
                  DARK OVERLAY
              ================================================== */}

              <div className="absolute inset-0 bg-black/25" />

              {/* LEFT DARK GRADIENT */}

              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

              {/* BOTTOM GRADIENT */}

              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            </div>
          );
        })}

        {/* =====================================================
            FIXED TEXT CONTENT

            IMPORTANT:
            This does NOT move with the images.
            Only the background image changes.
        ====================================================== */}

        <div className="absolute inset-0 z-20">

          <div className="mx-auto flex h-full w-full max-w-7xl items-center px-5 sm:px-8 lg:px-12 xl:px-16">

            <div className="max-w-3xl">

              {/* SMALL LABEL */}

              {/* <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-md">

                <span className="h-2 w-2 rounded-full bg-white" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white sm:text-sm">
                  Explore India
                </span>

              </div> */}

              {/* MAIN HEADING */}

              <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Domestic Destinations
              </h1>

              {/* SUBHEADING */}

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg md:text-xl">
                Discover the incredible beauty of India — from
                peaceful mountains and tropical beaches to royal
                cities, cultural escapes and unforgettable journeys.
              </p>

              {/* CTA */}

              <div className="mt-7">

                <a
                  href="/destinations"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-2xl"
                >
                  Explore Destinations

                  <span className="text-lg leading-none">
                    →
                  </span>
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            SMALL SLIDE INDICATORS

            No arrows
            No page number
        ====================================================== */}

        <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">

          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Show destination image ${index + 1}`}
              className={`rounded-full transition-all duration-500 ${
                activeSlide === index
                  ? "h-1.5 w-7 bg-white"
                  : "h-1.5 w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}

        </div>

      </section>

      

     
          



    

      

  );
}