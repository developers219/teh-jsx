import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Phone } from "lucide-react";
import Carousel from "../components/ui/Carousel";
import WhyUs from "../components/corporate-bookings/WhyUs";
import CorporateReviews from "../components/corporate-bookings/CorporateReviews";
import CorporateTourForm from "../components/forms/CorporateTourForm";
import cb1 from "../assets/images/cb1.png";
import cb2 from "../assets/images/cb2.png";
import cb3 from "../assets/images/cb3.png";
// import cb4 from "../assets/images/cb4.png";
import cb5 from "../assets/images/cb5.png";
import cb6 from "../assets/images/cb6.png";

/*
 * Hero slides. The hero looks like the Careers hero (full width, 70vh up to
 * max-h-98, dark gradient, title + subtitle at the bottom left) and slides
 * with the website's own ui/Carousel and its "overlay" arrows.
 */
const slides = [
  { id: "team-getaways", title: "Team Getaways", img: cb1 },
  { id: "corporate-offsites", title: "Corporate Offsites", img: cb2 },
  { id: "team-retreats", title: "Team Retreats", img: cb3 },
  // { id: "incentive-trips", title: "Incentive Trips", img: cb4 },
  { id: "conference-trips", title: "Conference Trips", img: cb5 },
  { id: "celebration-trips", title: "Celebration Trips", img: cb6 },
];

const AUTOPLAY_MS = 5000;

/*
 * Section heading in the website font:
 * title = font-eb, description = font-inter
 */
function SectionTitle({ title, description, align = "center" }) {
  const alignmentClass =
    align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-3xl ${alignmentClass}`}>
      <h2 className="font-eb text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.12] text-slate-950">
        {title}
      </h2>

      {description && (
        <p className="mt-4 font-inter text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export default function CorporateBookings() {
  const [isCorporateTourOpen, setIsCorporateTourOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-play: next slide every 5s (back to the first after the last one).
  // The timer restarts whenever the slide changes, also when the visitor
  // uses the arrows or swipes.
  useEffect(() => {
    const timer = setTimeout(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      AUTOPLAY_MS,
    );

    return () => clearTimeout(timer);
  }, [activeSlide]);

  return (
    <section className="bg-white font-inter">
      {/* Hero (same look as the Careers hero) */}
      <div className="group relative h-[70vh] max-h-98 overflow-hidden bg-black">
        <Carousel
          items={slides}
          gap={0}
          desktopItems={1}
          tabletItems={1}
          mobileItems={1}
          fillHeight
          arrowsVariant="overlay"
          className="group"
          index={activeSlide}
          onIndexChange={setActiveSlide}
          renderItem={(slide, slideIndex) => {
            const isActive = slideIndex === activeSlide;

            return (
              <div className="relative h-full w-full">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="absolute inset-0 h-full w-full object-cover object-bottom"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/60" />

                <div className="relative mx-auto h-full max-w-7xl overflow-hidden">
                  <div className="absolute inset-0 z-10 flex items-end text-white">
                    <div className="w-full pb-8 pl-5 pr-16 sm:pb-10 sm:pl-8 sm:pr-20 lg:pb-5 lg:pl-10 xl:pl-8">
                      <div className="overflow-hidden">
                        <motion.h2
                          initial={false}
                          animate={{ y: isActive ? 0 : 70 }}
                          transition={{
                            delay: isActive ? 0.2 : 0,
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="font-eb text-[clamp(2rem,4vw,3rem)]"
                        >
                          {slide.title}
                        </motion.h2>
                      </div>

                      <motion.p
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : 15,
                        }}
                        transition={{
                          delay: isActive ? 0.45 : 0,
                          duration: 0.6,
                        }}
                        className="font-inter text-base text-neutral-300"
                      >
                        Corporate Travel
                      </motion.p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>

      <div className="my-16 mx-auto max-w-7xl">
        <div>
          <SectionTitle
            title={"Corporate Bookings"}
            description={
              "Bring your team together. We’ll take care of the journey."
            }
          />

          <div className="mt-8 flex justify-center gap-5">
            {/* Get Your Custom Itinerary */}
            <button
              type="button"
              onClick={() => setIsCorporateTourOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-black px-6 py-3 font-inter text-sm text-white"
            >
              Enquire Now
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </button>

            {/* Talk to a Travel Expert */}
            <a
              href="tel:+911234567890"
              className="flex cursor-pointer items-center gap-2 rounded-full border border-black px-6 py-3 font-inter text-sm text-black"
            >
              <Phone size={16} strokeWidth={1.8} />
              Talk to a Travel Expert
            </a>
          </div>

          <div className="my-16">
            <WhyUs />
          </div>

          <div className="my-16">
            <CorporateReviews />
          </div>
        </div>
      </div>

      {/* Corporate Tour Popup */}
      <CorporateTourForm
        isOpen={isCorporateTourOpen}
        setIsOpen={setIsCorporateTourOpen}
      />
    </section>
  );
}