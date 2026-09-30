import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cb1 from "../../assets/images/cb1.png";
import cb2 from "../../assets/images/cb2.png";
import cb3 from "../../assets/images/cb3.png";
import cb4 from "../../assets/images/cb4.png";
import cb5 from "../../assets/images/cb5.png";
import cb6 from "../../assets/images/cb6.png";

const slides = [
  {
    title: "Team Getaways",
    img: cb1,
  },
  {
    title: "Corporate Offsites",
    img: cb2,
  },
  {
    title: "Team Retreats",
    img: cb3,
  },
  {
    title: "Incentive Trips",
    img: cb4,
  },
  {
    title: "Conference Trips",
    img: cb5,
  },
  {
    title: "Celebration Trips",
    img: cb6,
  },
];

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-[#F5F3EA]">
      <div className="px-5 lg:px-0">
        {/* Main Slide */}
        <div className="relative h-[55vh] min-h-[450px] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === activeIndex
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="h-full w-full object-cover object-bottom"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/25" />

              {/* Title */}
              <div className="absolute bottom-8 left-8 w-full max-w-7xl mx-auto lg:bottom-12 lg:left-12">
                <p className="mb-2 font-mont text-sm uppercase tracking-[0.2em] text-white/80">
                  Corporate Travel
                </p>

                <h2 className="font-cg text-5xl text-white md:text-6xl lg:text-7xl">
                  {slide.title}
                </h2>
              </div>
            </div>
          ))}

          {/* Navigation */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
