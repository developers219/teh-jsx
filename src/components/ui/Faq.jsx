import { ChevronRight } from "lucide-react";
import { useState } from "react";

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
    <section className="font-mont w-full bg-white py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-10 text-center md:mb-12">
          <h2 className="text-4xl font-cg tracking-tight text-black sm:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-2 text-base font-medium text-black/70 sm:text-lg">
            Your right to Know!
          </p>

          <div className="mx-auto  h-[3px] w-20 bg-[#c5bd96]" />
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`overflow-hidden hover:shadow-lg rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen ? "border-beige" : "border-black/20"
                }`}
              >
                {/* Question */}
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className={`flex w-full items-center justify-between gap-5 px-4 py-2 text-left ${
                    isOpen ? " border-b border-gray-200 " : ""
                  }`}
                  aria-expanded={isOpen}
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="shrink-0 text-sm font-medium sm:text-[19px] text-black">
                      Q:
                    </span>

                    <span
                      className={`text-sm leading-6 sm:text-[19px] ${
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
                    className={`flex size-10 cursor-pointer shrink-0 items-center justify-center bg-beige rounded-full hover:bg-beigeD transition-transform duration-300 ${
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
                    <div className="flex gap-2.5 px-4 pb-5 sm:px-5">
                      <span className="shrink-0 text-sm sm:text-[17px] font-medium text-black">
                        A:
                      </span>

                      <p className="text-sm leading-6 text-black/60 sm:text-[17px]">
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
