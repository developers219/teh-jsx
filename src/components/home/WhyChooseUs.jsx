import { Globe2, Headset, MapPinned, SlidersHorizontal } from "lucide-react";
import SectionHeader from "./SectionHeader";
import wcu1 from "../../assets/images/wcu1.png";
import wcu2 from "../../assets/images/wcu2.png";
import wcu3 from "../../assets/images/wcu3.png";
import wcu4 from "../../assets/images/wcu4.png";

const reasons = [
  {
    title: "Expertise That Makes Travel Easier",
    img: wcu1,
    description:
      "20+ years of collective travel experience helps us plan smarter, recommend better, and anticipate the details that can make a journey smoother.",
  },
  {
    title: "Designed Around You",
    img: wcu2,
    description:
      "Your holiday is built around your preferences, pace, comfort, and budget — giving you a journey that feels personal rather than pre-packaged.",
  },
  {
    title: "Support Beyond the Booking",
    img: wcu3,
    description:
      "From planning to your return home, our team stays connected to help you navigate changes, questions, and unexpected situations with confidence.",
  },
  {
    title: "Experiences Worth Coming Home With",
    img: wcu4,
    description:
      "We go beyond the standard sightseeing checklist to help you discover memorable places, meaningful experiences, and moments you’ll want to remember.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className=" bg-white px-4 py-16 sm:px-6 md:mt-0 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* =========================
            SECTION HEADER
        ========================== */}
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeader
            title="Why choose us?"
            description="Travel planning that feels effortless, from the first idea to the moment you return home."
          />
        </div>

        {/* =========================
            CARDS
        ========================== */}
        <div className="mx-auto mt-10 max-w-6xl sm:mt-12">
          {/* =========================
              DESKTOP
          ========================== */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-3">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="
                  rounded-2xl
                  border
                  border-black/10
                  flex flex-col
                  items-center
                  gap-3
                  justify-around
                  p-8
                  shadow-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  
                "
              >
                {/* <div className="p-6 bg-beige text-white text-2xl rounded-full">
                  <reason.icon size={32} />
                </div> */}
                <img src={reason.img} alt={reason.title} className="size-32" />
                <h3 className="text-lg font-bold leading-5 text-black">
                  {reason.title}
                </h3>

                <p className="mt-3 font-mont text-sm leading-5 text-black/85">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>

          {/* =========================
              TABLET
          ========================== */}
          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 lg:hidden">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="
                flex flex-col
                  rounded-2xl
                  border
                  border-black/10
                  flex flex-col
                  justify-around
                  p-6
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  
                "
              >
                <img src={reason.img} alt={reason.title} className="size-32" />
                <h3 className="text-base font-bold leading-5 text-black">
                  {reason.title}
                </h3>

                <p className="mt-2 font-mont text-sm leading-5 text-black/80">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>

          {/* =========================
              MOBILE
          ========================== */}
          <div className="sm:hidden">
            <div
              className="
                flex
                gap-3
                overflow-x-auto
                pb-4
                snap-x
                snap-mandatory
                [-ms-overflow-style:none]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="
                    min-w-[82%]
                    snap-start
                    rounded-2xl
                    border
                    border-black/10
                   flex flex-col
                  justify-around
                    p-5
                    shadow-lg
                  "
                >
                  <img
                    src={reason.img}
                    alt={reason.title}
                    className="size-16"
                  />
                  <h3 className="text-base font-bold leading-5 text-black">
                    {reason.title}
                  </h3>

                  <p className="mt-2 font-mont text-sm leading-5 text-black/80">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile scroll hint */}
            {/* <div className="mt-1 flex justify-center gap-1.5">
              {reasons.map((reason, index) => (
                <span
                  key={reason.title}
                  className={`h-1.5 rounded-full ${
                    index === 0 ? "w-6 bg-black" : "w-1.5 bg-black/20"
                  }`}
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
