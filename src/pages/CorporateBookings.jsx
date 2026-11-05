import { useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import Carousel from "../components/corporate-bookings/Carousel";
import WhyUs from "../components/corporate-bookings/WhyUs";
import CorporateReviews from "../components/corporate-bookings/CorporateReviews";
import CorporateTourForm from "../components/forms/CorporateTourForm";

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

  return (
    <section className="bg-white font-inter">
      <div>
        <Carousel />
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