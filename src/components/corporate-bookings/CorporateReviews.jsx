import { motion } from "motion/react";
import { Quote, ArrowUpRight } from "lucide-react";

const reviews = [
  {
    quote:
      "Travel Empire made planning our team getaway incredibly easy. Everything felt thoughtfully arranged, and our team could simply enjoy the trip.",
    name: "Ananya Mehta",
    role: "HR Manager",
    company: "Northstar Technologies",
  },
  {
    quote:
      "From the first conversation to the journey itself, the team understood what we wanted and helped turn it into a memorable experience for everyone.",
    name: "Rahul Kapoor",
    role: "People & Culture Lead",
    company: "Vertex Solutions",
  },
  {
    quote:
      "We wanted something relaxed, well planned, and genuinely enjoyable for the team. Travel Empire helped us put the whole experience together.",
    name: "Priya Sharma",
    role: "Operations Manager",
    company: "Aurelia Consulting",
  },
];

export default function CorporateReviews() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-3 font-mont text-xs uppercase tracking-[0.2em] text-[#6B6B5D]"
            >
              From teams we've travelled with
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-cg text-[clamp(2rem,4vw,3rem)] leading-none text-black"
            >
              Words from
              <br />
              <span className="text-[#77776B]">our travellers.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 font-mont text-xs uppercase tracking-wider text-[#6B6B5D]"
          >
            Trusted journeys
            <ArrowUpRight size={15} />
          </motion.div>
        </div>

        {/* Reviews */}
        <div className="grid gap-5 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.company}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.65,
                delay: index * 0.12,
              }}
              whileHover={{ y: -6 }}
              className={`relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[30px] p-7 md:p-9 ${
                index === 0
                  ? "bg-[#F5F3EA]"
                  : index === 1
                    ? "bg-[#E8E9DE]"
                    : "bg-[#F1EEE7]"
              }`}
            >
              <div>
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-[#F5F3EA]">
                    <Quote size={18} strokeWidth={1.5} />
                  </div>

                  <span className="font-mont text-xs text-black/30">
                    0{index + 1}
                  </span>
                </div>

                <p className="font-mont text-base leading-[1.2] text-black md:text-xl">
                  “{review.quote}”
                </p>
              </div>

              <div className="mt-10 border-t border-black/10 pt-5">
                <p className="font-mont text-sm font-medium text-black">
                  {review.name}
                </p>

                <p className="mt-1 font-mont text-xs text-black/50">
                  {review.role}
                </p>

                <p className="mt-3 font-mont text-xs uppercase tracking-[0.12em] text-black/60">
                  {review.company}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
