import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  {
    value: 15,
    suffix: "+",
    label: "Years of Experience",
  },
  {
    value: 50,
    suffix: "K+",
    label: "Travellers Served",
  },
  {
    value: 80,
    suffix: "+",
    label: "International Destinations",
  },
  {
    value: 150,
    suffix: "+",
    label: "India Experiences",
  },
];

const Counter = ({ value, suffix, isInView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Smooth ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      start = Math.floor(easedProgress * value);
      setCount(start);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const CounterSection = () => {
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.35,
  });

  return (
    <section ref={sectionRef} className="w-full font-mont">
      <div className="mx-auto grid max-w-7xl grid-cols-2 border-y border-black/10 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 0.7,
              delay: index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-black/10 px-6 py-10 text-center
              even:border-l
              lg:border-l lg:first:border-l-0"
          >
            <div className="text-4xl font-medium tracking-tight md:text-5xl">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                isInView={isInView}
              />
            </div>

            <p className="mt-3 text-xs lg:text-sm uppercase tracking-[0.15em] text-black/55">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CounterSection;
