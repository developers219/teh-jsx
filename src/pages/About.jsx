import { motion } from "motion/react";
import CounterSection from "../components/ui/CounterSection";
import WhyChooseUs from "../components/home/WhyChooseUs";

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

const reveal = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1],
  },
};

export default function About() {
  return (
    <section className="bg-white font-inter">
      {/* Hero */}
      <div className="relative h-[70vh] max-h-98">
        <img
          src="https://images.unsplash.com/photo-1589779255235-85dc2a054145?fm=jpg&ixlib=rb-4.0.3&q=80&w=2000"
          alt="Skyscrapers"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/60" />
        <div className="relative mx-auto h-full max-w-7xl overflow-hidden">
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="w-full pl-5 pb-8 sm:pl-8 sm:pb-10 lg:pl-10 lg:pb-5 xl:pl-8">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 70 }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-eb text-[clamp(2.25rem,6vw,3rem)] leading-none text-white"
                >
                  About Us
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.55,
                  duration: 0.6,
                }}
                className="mt-3 font-inter text-sm text-neutral-300 sm:text-base"
              >
                Know about our journey
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">
        {/* Our Story */}
        <motion.div {...reveal} className="my-16">
          <SectionTitle
            title="Our Story"
            description="From where we began to where your journey takes you"
          />
        </motion.div>

        <motion.div
          {...reveal}
          transition={{
            ...reveal.transition,
            delay: 0.1,
          }}
          className="mt-8 grid gap-7 font-inter text-sm leading-7 text-black/65 sm:text-base sm:leading-8 md:grid-cols-2 md:gap-10 lg:gap-16"
        >
          <p className="text-justify">
            What started with a passion for discovering new places grew into a
            journey of helping people experience the world in a more meaningful
            way. Over the years, we’ve built our approach around thoughtful
            planning, destination knowledge, and a genuine understanding of what
            makes each traveller’s journey unique.
          </p>

          <p className="text-justify">
            Today, we turn that experience into carefully crafted journeys
            across India and beyond. From the first conversation to the moment
            you return home, we focus on making travel feel seamless, personal,
            and memorable — with experiences worth carrying with you long after
            the journey ends.
          </p>
        </motion.div>

        {/* Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="my-16 sm:my-20 lg:my-24"
        >
          <CounterSection />
        </motion.div>

        {/* Mission */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <motion.div {...reveal} className="flex-1">
            <SectionTitle
              title="Our Mission"
              align="left"
              description="Making every journey feel personal, seamless, and worth remembering."
            />

            <p className="my-7 font-inter text-sm leading-7 text-justify text-black/65 sm:my-8 sm:text-base sm:leading-8">
              Our mission is to make meaningful travel more accessible through
              thoughtfully planned journeys built around each traveller. We
              bring together destination expertise, carefully chosen
              experiences, transparent planning, and dependable support to take
              the stress out of travel — so you can spend less time worrying
              about the details and more time enjoying the journey.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div {...reveal} className="flex-1">
            <SectionTitle
              title="Our Vision"
              description="To inspire people to see more of the world, to have meaningful journey."
              align="left"
            />

            <p className="my-7  font-inter text-sm leading-7 text-justify text-black/65 sm:my-8 sm:text-base sm:leading-8">
              We aspire to create a travel experience where every journey feels
              thoughtfully considered, effortless, and deeply personal. As we
              grow, we remain committed to building lasting relationships with
              our travellers while making every experience more memorable.
            </p>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="-mt-16 lg:mt-0"
        >
          <WhyChooseUs />
        </motion.div>
      </div>
    </section>
  );
}