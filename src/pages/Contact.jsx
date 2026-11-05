import { useEffect } from "react";
import { motion } from "motion/react";
import PersonalizedHolidayPlan from "../components/home/PersonalizedHolidayPlan";

// Heading + form already use the website font (ui/Heading.jsx).
// The extra <Navbar /> was removed: MainLayout already renders it.
const Contact = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="bg-white font-inter text-slate-900">
      <section className="h-18 bg-black lg:h-22"></section>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        id="holiday-plan"
        className="bg-white"
      >
        <div className="mx-auto max-w-7xl px-4">
          <PersonalizedHolidayPlan />
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;