import SectionHeader from "./SectionHeader";

const reasons = [
  {
    title: "Expert-planned itineraries",
    description:
      "Every trip is shaped by destination specialists who understand timing, local routes, trusted stays, and realistic travel flow.",
  },
  {
    title: "Transparent pricing",
    description:
      "Clear package details help travelers understand what is included before they book, with no confusing last-minute surprises.",
  },
  {
    title: "Reliable travel support",
    description:
      "From planning questions to on-trip assistance, our team stays reachable so customers feel supported at every stage.",
  },
  {
    title: "Curated local experiences",
    description:
      "We combine famous landmarks with meaningful local activities so every journey feels personal, balanced, and memorable.",
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
                  bg-beige
                  p-8
                  shadow-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-beigeD
                "
              >
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
                  rounded-2xl
                  border
                  border-black/10
                  bg-beige
                  p-6
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-beigeD
                "
              >
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
                    bg-beige
                    p-5
                    shadow-lg
                  "
                >
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