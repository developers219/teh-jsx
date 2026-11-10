import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Heading } from "./Heading";

const faqData = [
  {
    question: "What types of India tour packages do you offer?",
    answer:
      "We offer honeymoon getaways, family vacations, group trips, solo adventures, and budget-friendly holidays across destinations like Manali, Goa, Kerala, Rajasthan, Kashmir, and Meghalaya.",
  },
  {
    question:
      "What are the most popular destinations included in India trip packages?",
    answer:
      "Some of our popular destinations include Goa, Kerala, Rajasthan, Kashmir, Himachal Pradesh, Uttarakhand, Meghalaya, Andaman, and the Northeast.",
  },
  {
    question: "Can I customize my India tour package?",
    answer:
      "Yes. Our holiday packages can be customized according to your preferred destinations, number of nights, hotels, activities, sightseeing, transportation, and budget.",
  },
  {
    question: "Are flights included in India tour packages?",
    answer:
      "Flights can be included depending on the package you choose. We can also provide packages without flights if you prefer to arrange your own travel.",
  },
  {
    question: "Do you have India holiday packages for couples?",
    answer:
      "Yes. We offer specially designed couple and honeymoon packages with romantic stays, private transfers, sightseeing experiences, and optional experiences based on your preferences.",
  },
  {
    question: "Are these packages suitable for solo travelers?",
    answer:
      "Absolutely. We can create customized solo travel packages with comfortable stays, private or shared transfers, sightseeing, and experiences based on your travel style.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-[clamp(2rem,5vw,4rem)] font-inter">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.25rem,4vw,2rem)]">
        {/* Header (size / spacing follow the screen width) */}
        <div className="mb-[clamp(1.5rem,4vw,3rem)]">
          <Heading
            compact
            heading="Frequently asked "
            highlight="questions"
            subheading="Your right to know!"
            className="items-center text-center"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-[clamp(0.5rem,1.2vw,0.75rem)]">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`overflow-hidden hover:shadow-lg rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen ? "border-slate-900" : "border-black/20"
                }`}
              >
                {/* Question */}
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className={`flex w-full items-center justify-between gap-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] text-left ${
                    isOpen ? " border-b border-gray-200 " : ""
                  }`}
                  aria-expanded={isOpen}
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="shrink-0 text-[clamp(0.875rem,2vw,1.1875rem)] font-medium leading-[1.5] text-black">
                      Q:
                    </span>

                    <span
                      className={`text-[clamp(0.875rem,2vw,1.1875rem)] leading-[1.5] ${
                        isOpen
                          ? "font-medium text-black"
                          : "font-normal text-black"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Arrow */}
                  <span
                    className={`flex size-[clamp(2rem,4vw,2.5rem)] cursor-pointer shrink-0 items-center justify-center rounded-full bg-slate-100 transition-transform hover:bg-slate-200 duration-300 ${
                      isOpen ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    <ChevronRight size={16} className="text-black" />
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-4"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex gap-2.5 px-[clamp(1rem,2vw,1.25rem)] pb-[clamp(1rem,2vw,1.25rem)]">
                      <span className="shrink-0 text-[clamp(0.875rem,1.8vw,1.0625rem)] font-medium leading-[1.65] text-black">
                        A:
                      </span>

                      <p className="text-[clamp(0.875rem,1.8vw,1.0625rem)] leading-[1.65] text-black/60">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}