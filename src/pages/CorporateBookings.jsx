import { useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import Carousel from "../components/corporate-bookings/Carousel";
import SectionHeader from "../components/home/SectionHeader";
import WhyUs from "../components/corporate-bookings/WhyUs";
import CorporateReviews from "../components/corporate-bookings/CorporateReviews";
import CorporateTourForm from "../components/forms/CorporateTourForm";

export default function CorporateBookings() {
  const [isCorporateTourOpen, setIsCorporateTourOpen] = useState(false);

  return (
    <section className="bg-white">
      <div>
        <Carousel />
      </div>

      <div className="my-16 mx-auto max-w-7xl">
        <div>
          <SectionHeader
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
              className="flex cursor-pointer items-center gap-2 rounded-full bg-black px-6 py-3 font-mont text-sm text-white"
            >
              Get Your Custom Itinerary
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </button>

            {/* Talk to a Travel Expert */}
            <a
              href="tel:+911234567890"
              className="flex cursor-pointer items-center gap-2 rounded-full border border-black px-6 py-3 font-mont text-sm text-black"
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