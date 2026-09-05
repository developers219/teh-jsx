import whyImage from "../../assets/images/why.jpg";
const reasons = [
    {
        title: "Expert-planned itineraries",
        description: "Every trip is shaped by destination specialists who understand timing, local routes, trusted stays, and realistic travel flow.",
    },
    {
        title: "Transparent pricing",
        description: "Clear package details help travelers understand what is included before they book, with no confusing last-minute surprises.",
    },
    {
        title: "Reliable travel support",
        description: "From planning questions to on-trip assistance, our team stays reachable so customers feel supported at every stage.",
    },
    {
        title: "Curated local experiences",
        description: "We combine famous landmarks with meaningful local activities so every journey feels personal, balanced, and memorable.",
    },
];
export default function WhyChooseUs() {
    return (<section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            SECTION HEADER
        ========================== */}
        <div className="mx-auto max-w-3xl text-center">

          {/* Eyebrow */}
          {/* <div className="mb-5 inline-flex items-center rounded-full bg-cyan-50 px-4 py-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-700">
            Why Choose Us?
          </span>
        </div> */}

          {/* Heading */}
          <h2 className="text-4xl  tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Why choose us?
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Travel planning that feels effortless, from the first idea to the
            moment you return home.
          </p>
        </div>

        {/* =========================
            IMAGE + BADGES
        ========================== */}
        <div className="relative mx-auto mt-12 max-w-6xl overflow-hidden rounded-[32px]">

          {/* Main Image */}
          <img src={whyImage} alt="Beautiful travel destination" className="
              h-[560px]
              w-full
              object-cover
              sm:h-[600px]
              lg:h-[full]
            "/>

          {/* Dark Image Overlay */}
          <div className="absolute inset-0 bg-black/10"/>

          {/* =========================
            DESKTOP BADGES
        ========================== */}
          <div className="absolute bottom-6 left-6 right-6 z-10 hidden lg:block">
            <div className="grid grid-cols-4 gap-3">

              {reasons.map((reason) => (<div key={reason.title} className="
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/15
                    p-5
                    shadow-xl
                    backdrop-blur-2xl
                    hover:-translate-y-1 
                    transition-all
                    duration-300
                    hover:bg-white/25
                  ">
                  <h3 className="text-sm font-bold leading-5 text-white">
                    {reason.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/85">
                    {reason.description}
                  </p>
                </div>))}

            </div>
          </div>

          {/* =========================
            TABLET BADGES
        ========================== */}
          <div className="absolute bottom-5 left-5 right-5 z-10 hidden sm:block lg:hidden">
            <div className="grid grid-cols-2 gap-3">

              {reasons.map((reason) => (<div key={reason.title} className="
                    rounded-2xl
                    border
                    border-white/30
                    bg-white/15
                    p-4
                    shadow-xl
                    backdrop-blur-xl
                  ">
                  <h3 className="text-sm font-bold text-white">
                    {reason.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-white/85">
                    {reason.description}
                  </p>
                </div>))}

            </div>
          </div>

          {/* =========================
            MOBILE BADGES
        ========================== */}
          <div className="absolute bottom-4 left-4 right-4 z-10 sm:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1">

              {reasons.map((reason) => (<div key={reason.title} className="
                    min-w-[240px]
                    rounded-2xl
                    border
                    border-white/30
                    bg-white/15
                    p-4
                    shadow-xl
                    backdrop-blur-xl
                  ">
                  <h3 className="text-sm font-bold text-white">
                    {reason.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-white/85">
                    {reason.description}
                  </p>
                </div>))}

            </div>
          </div>

        </div>
      </div>
    </section>);
}
