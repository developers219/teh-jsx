// import { Globe2, Headset, MapPinned, SlidersHorizontal } from "lucide-react";
import Carousel from "../ui/Carousel";
import { Heading } from "../ui/Heading";

/* ---------------------------------------------------------------
   OLD IMAGE ICONS (commented, so they can be switched back if required)
   1) Uncomment these imports
   2) In `reasons`, uncomment the `img` lines
   3) In <ReasonIcon /> below, use the <img> version instead of the icon
---------------------------------------------------------------- */
import wcu1 from "../../assets/images/wcu1.png";
import wcu2 from "../../assets/images/wcu2.png";
import wcu3 from "../../assets/images/wcu3.png";
import wcu4 from "../../assets/images/wcu4.png";

const reasons = [
  {
    title: "Expertise That Makes Travel Easier",
    img: wcu1,
    // icon: Globe2,
    description:
      "20+ years of collective travel experience helps us plan smarter, recommend better, and anticipate the details that can make a journey smoother.",
  },
  {
    title: "Designed Around You",
    img: wcu2,
    // icon: SlidersHorizontal,
    description:
      "Your holiday is built around your preferences, pace, comfort, and budget — giving you a journey that feels personal rather than pre-packaged.",
  },
  {
    title: "Support Beyond the Booking",
    img: wcu3,
    // icon: Headset,
    description:
      "From planning to your return home, our team stays connected to help you navigate changes, questions, and unexpected situations with confidence.",
  },
  {
    title: "Experiences Worth Coming Home With",
    img: wcu4,
    // icon: MapPinned,
    description:
      "We go beyond the standard sightseeing checklist to help you discover memorable places, meaningful experiences, and moments you’ll want to remember.",
  },
];

/* ---------------------------------------------------------------
   ICON OF A CARD (one place to change it for all screen sizes)
   boxClass : size of the icon box (small screens / sm and up)
   iconSize : size of the icon (only used by the lucide icon version)
---------------------------------------------------------------- */
function ReasonIcon({ reason, boxClass }) {
  // ---- NEW: lucide icon ----
  // const Icon = reason.icon;

  // return (
  //   <div
  //     className={`flex shrink-0 items-center justify-center rounded-full bg-beige text-white ${boxClass}`}
  //   >
  //     <Icon size={iconSize} strokeWidth={1.75} />
  //   </div>
  // );

  // ---- OLD: image icon ----
  return <img src={reason.img} alt={reason.title} className={boxClass} />;
}

/* ---------------------------------------------------------------
   ONE CARD (same card for every screen size)
   mobile  : p-5, small icon
   tablet  : p-6, big icon
   desktop : p-8, centred content
---------------------------------------------------------------- */
function ReasonCard({ reason }) {
  return (
    <div className="flex h-full flex-col justify-around gap-3 rounded-2xl border border-black/10 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 sm:p-6 lg:items-center lg:p-8 lg:shadow-xl">
      <ReasonIcon reason={reason} boxClass="size-16 sm:size-24" />

      <h3 className="font-eb text-base font-bold leading-5 text-black lg:text-lg">
        {reason.title}
      </h3>

      <p className="font-inter text-sm leading-5 text-black/80 lg:mt-3 lg:text-black/85">
        {reason.description}
      </p>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className=" bg-white px-4 py-16 sm:px-6 md:mt-0 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* =========================
            SECTION HEADER
        ========================== */}
        <div className="mx-auto max-w-3xl text-center">
          <Heading
            compact
            heading="Why choose"
            highlight="us?"
            subheading="Travel planning that feels effortless, from the first idea to the moment you return home."
            className="items-center text-center"
          />
        </div>

        {/* =========================
            CARDS (carousel)
            desktop : all 4 cards visible (no arrows needed)
            tablet  : 2 cards + arrows
            mobile  : 1 card + arrows + swipe
        ========================== */}
        <div className="mx-auto mt-10 max-w-6xl sm:mt-12">
          <Carousel
            items={reasons}
            desktopItems={4}
            tabletItems={2}
            mobileItems={1}
            gap={16}
            showArrows={true}
            renderItem={(reason) => <ReasonCard reason={reason} />}
          />
        </div>
      </div>
    </section>
  );
}