import { motion } from "motion/react";
import { Sparkles, Route, Users, Headphones, ArrowUpRight } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Thoughtfully Planned",
    description:
      "Every trip is shaped around your team's plans, pace, and the kind of experience you want to create together.",
  },
  {
    icon: Route,
    title: "Seamless Journeys",
    description:
      "From getting there to moving around, we help bring the important pieces of your team trip together.",
  },
  {
    icon: Users,
    title: "Made for Teams",
    description:
      "Whether it's a quick getaway or a longer retreat, your itinerary is designed around travelling together.",
  },
  {
    icon: Headphones,
    title: "Travel Support",
    description:
      "Have questions before or during your journey? Our team is here to help keep your plans moving smoothly.",
  },
];

export default function WhyUs() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
          <div>
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="font-cg leading-[0.95] text-black text-[clamp(2rem,4vw,3rem)]"
              >
                More than a trip.
                <br />
                <span className="text-beigeD">A shared experience.</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="max-w-sm mt-4 text-sm font-mont leading-7 text-[#66665D]"
            >
              Bring your team somewhere new and let us take care of the details
              that make travelling together feel effortless.
            </motion.p>
          </div>
          <div className="grid border-t border-black/10 md:grid-cols-2">
            {benefits.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className={`group border-black/10 flex flex-col items-center p-4 ${
                    index % 2 === 0 ? "md:border-r" : ""
                  } ${index < 2 ? "md:border-b" : ""}`}
                >
                  <div className="mb-8 w-full flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#F5F3EA] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
                      <Icon size={19} strokeWidth={1.5} />
                    </div>

                    <span className="font-mont text-xs text-black/30">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mb-3 font-mont text-lg text-black">
                    {item.title}
                  </h3>

                  <p className="max-w-[300px] font-mont text-sm leading-7 text-[#6B6B5D]">
                    {item.description}
                  </p>

                  <div className="mt-7 h-px w-0 bg-black transition-all duration-500 group-hover:w-16" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
      </div>
    </section>
  );
}
