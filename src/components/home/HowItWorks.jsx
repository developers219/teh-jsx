import { useEffect, useState } from "react";

const steps = [
  {
    number: "01",
    eyebrow: "START WITH YOUR IDEA",
    title: "Share your travel idea",
    description:
      "Tell us where you want to go, when you want to travel, who you’re travelling with, and what kind of experience you have in mind.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Traveller planning a holiday",
  },
  {
    number: "02",
    eyebrow: "MADE FOR YOU",
    title: "Get a curated plan",
    description:
      "Our travel experts turn your ideas into a thoughtfully planned journey with handpicked stays, experiences, routes, and the right pace.",
    image:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Traveller exploring a destination",
  },
  {
    number: "03",
    eyebrow: "READY TO GO",
    title: "Confirm and travel",
    description:
      "Once everything feels right, we take care of the arrangements and stay with you through the journey so you can simply enjoy the trip.",
    image:
      "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Couple enjoying a holiday",
  },
];

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-how-step]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.howStep);
            setActiveStep(index);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "-5% 0px -55% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-white">
      {/* =========================================================
          DESKTOP
      ========================================================== */}

      <div className="grid w-full grid-cols-1 lg:grid-cols-2">

        {/* =======================================================
            LEFT SIDE - TEXT
        ======================================================== */}

        <div className="relative bg-white">
          <div className="sticky top-0 flex h-screen items-center">

            <div
              className="
                flex
                w-full
                justify-end
                px-10
                sm:px-14
                md:px-16
                lg:px-14
                xl:px-20
                2xl:px-24
              "
            >
              <div
                className="
                  w-full
                  max-w-[650px]
                  pr-0
                  lg:pr-8
                  xl:pr-12
                "
              >

                {/* TOP SMALL LABEL */}

                <div className="mb-10 flex justify-end">
                  <div className="w-fit">

                    <div className="h-px w-full bg-[#1f2937]" />

                    <div
                      className="
                        px-3
                        py-2
                        text-center
                        text-[11px]
                        font-normal
                        uppercase
                        tracking-[0.2em]
                        text-[#374151]
                      "
                    >
                      How It Works
                    </div>

                    <div className="h-px w-full bg-[#1f2937]" />

                  </div>
                </div>

                {/* ACTIVE CONTENT */}

                <div className="relative min-h-[350px]">

                  {steps.map((step, index) => (
                    <div
                      key={step.number}
                      className={`
                        absolute
                        right-0
                        top-0
                        w-full
                        text-right

                        transition-all
                        duration-[800ms]
                        ease-[cubic-bezier(0.22,1,0.36,1)]

                        ${
                          activeStep === index
                            ? "translate-y-0 opacity-100"
                            : "pointer-events-none translate-y-[30px] opacity-0"
                        }
                      `}
                    >

                      {/* STEP NUMBER */}

                      <div className="mb-7 flex items-center justify-end gap-4">

                        <span
                          className="
                            text-[11px]
                            font-normal
                            tracking-[0.22em]
                            text-[#607080]
                          "
                        >
                          {step.number}
                        </span>

                        <span className="h-px w-10 bg-[#aeb5bc]" />

                        <span
                          className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.22em]
                            text-[#526171]
                          "
                        >
                          {step.eyebrow}
                        </span>

                      </div>

                      {/* TITLE */}

                      <h2
                        className="
                          ml-auto
                          max-w-[620px]
                          font-serif
                          text-[40px]
                          font-normal
                          leading-[1.08]
                          tracking-[-0.025em]
                          text-[#171b22]

                          sm:text-[46px]
                          md:text-[50px]
                          lg:text-[48px]
                          xl:text-[56px]
                        "
                      >
                        {step.title}
                      </h2>

                      {/* DESCRIPTION */}

                      <p
                        className="
                          ml-auto
                          mt-7
                          max-w-[520px]
                          font-serif
                          text-[15px]
                          font-normal
                          leading-[1.85]
                          text-[#66717d]

                          sm:text-[16px]
                        "
                      >
                        {step.description}
                      </p>

                    </div>
                  ))}

                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =======================================================
            RIGHT SIDE - IMAGE
        ======================================================== */}

        <div className="relative">

          {/* STICKY IMAGE */}

          <div
            className="
              sticky
              top-0
              z-10
              hidden
              h-screen
              w-full
              overflow-hidden
              lg:block
            "
          >

            {steps.map((step, index) => (
              <img
                key={step.number}
                src={step.image}
                alt={step.imageAlt}
                className={`
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover

                  transition-all
                  duration-[1000ms]
                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  ${
                    activeStep === index
                      ? "scale-100 opacity-100"
                      : "scale-[1.04] opacity-0"
                  }
                `}
              />
            ))}

          </div>

          {/* =================================================
              SCROLL TRIGGERS
          ================================================== */}

          {steps.map((step, index) => (
            <div
              key={step.number}
              data-how-step={index}
              className="relative min-h-[55vh] lg:min-h-[55vh]"
            >

              {/* MOBILE */}

              <div className="lg:hidden">

                {/* IMAGE */}

                <div className="relative h-[70vh] w-full overflow-hidden">

                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="h-full w-full object-cover"
                  />

                </div>

                {/* TEXT */}

                <div className="bg-white px-7 py-14 sm:px-10">

                  <div className="flex items-center justify-end gap-4">

                    <span className="text-[11px] tracking-[0.2em] text-[#607080]">
                      {step.number}
                    </span>

                    <span className="h-px w-8 bg-[#aeb5bc]" />

                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#526171]">
                      {step.eyebrow}
                    </span>

                  </div>

                  <h2
                    className="
                      mt-8
                      text-right
                      font-serif
                      text-[38px]
                      font-normal
                      leading-[1.1]
                      tracking-[-0.02em]
                      text-[#171b22]
                    "
                  >
                    {step.title}
                  </h2>

                  <p
                    className="
                      mt-6
                      ml-auto
                      max-w-[520px]
                      text-right
                      font-serif
                      text-[15px]
                      leading-[1.85]
                      text-[#66717d]
                    "
                  >
                    {step.description}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;