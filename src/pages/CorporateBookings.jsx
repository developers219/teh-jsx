import { ArrowUpRight, Phone } from "lucide-react";
import Carousel from "../components/corporate-bookings/Carousel";
import SectionHeader from "../components/home/SectionHeader";
import WhyUs from "../components/corporate-bookings/WhyUs";
import CorporateReviews from "../components/corporate-bookings/CorporateReviews";

export default function CorporateBookings() {
  return (
    <section className="bg-white">
      <div>
        <Carousel />
      </div>
      <div className="my-16 max-w-7xl mx-auto">
        <div>
          <SectionHeader
            title={"Corporate Bookings"}
            description={
              "Bring your team together. We’ll take care of the journey."
            }
          />
          <div className="flex justify-center gap-5 mt-8">
            <button className="flex items-center gap-2 rounded-full bg-black px-6 py-3 font-mont text-sm text-white cursor-pointer">
              Get Your Custom Itinerary
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </button>

            <a
              href="tel:+911234567890"
              className="flex items-center gap-2 rounded-full border border-black px-6 py-3 font-mont text-sm text-black cursor-pointer"
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
    </section>
  );
}
