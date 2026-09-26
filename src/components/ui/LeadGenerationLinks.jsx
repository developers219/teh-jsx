import { useState } from "react";
import { Phone, PhoneCall, Mail, ArrowRight, Clock3 } from "lucide-react";

import Modal from "./Modal";
import RequestCallback from "./RequestCallback";
import Woman from "../../assets/images/woman.png";

const contactOptions = [
  {
    title: "Call Now",
    description: "Speak directly with our travel experts",
    icon: Phone,
  },
  {
    title: "Request a Callback",
    description: "We'll call you at your preferred time",
    icon: Clock3,
  },
  {
    title: "Submit Enquiry",
    description: "Tell us your travel plans & we'll get back",
    icon: Mail,
  },
];

const LeadGenerationLinks = ({ isOpen, setIsOpen }) => {
  // State for the second popup
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  const handleRequestCallback = () => {
    // Close the first popup
    setIsOpen(false);

    // Open the callback popup
    setIsCallbackOpen(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="grid w-[60vw] grid-cols-1 overflow-hidden bg-white lg:grid-cols-[1fr_1fr]">
          {/* ================= LEFT ================= */}
          <div className="relative w-full overflow-hidden px-2 pb-8 pt-7">
            <div
              className="
              relative mx-auto mt-2
              h-[230px] w-full
              overflow-hidden
            "
            >
              <img
                src={Woman}
                alt="Travel experience"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="mt-8 px-4">
              <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-black/45">
                WE'RE HERE TO HELP
              </p>

              <h2 className=" text-2xl font-semibold leading-[1.02] tracking-[-0.04em] text-black sm:text-[44px]">
                Plan Your
                <br />
                Next Getaway
              </h2>

              <p className="mt-5  text-[15px] leading-6 text-black/55 sm:text-[16px]">
                Get in touch with our travel experts for personalized assistance
                and the best travel deals.
              </p>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="relative flex flex-col justify-center px-4 py-8">
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
                Get in touch
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">
                How would you like to connect?
              </h3>
            </div>

            <div className="space-y-4">
              {contactOptions.map(({ title, description, icon: Icon }) => (
                <button
                  key={title}
                  type="button"
                  className="
          group flex w-full items-center gap-5
          rounded-[22px] border border-black/[0.08]
          bg-white p-5 text-left
          shadow-[0_5px_25px_rgba(0,0,0,0.04)]
          transition-all duration-300
          hover:border-[#c5bd96]
          hover:bg-[#c5bd96]
          hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)]
          cursor-pointer
        "
                  onClick={handleRequestCallback}
                >
                  <span
                    className={`
            flex h-14 w-14 shrink-0 items-center justify-center
            rounded-full bg-black/5 text-black
            transition-all duration-300
            group-hover:bg-black group-hover:text-white
          `}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[18px] font-semibold text-black">
                      {title}
                    </span>

                    <span className="mt-1 block text-sm text-black/50">
                      {description}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {/* Bottom reassurance */}
            <div className="mt-7 flex items-center gap-2 text-xs text-black/35">
              <PhoneCall size={14} />
              <span>Our travel experts are happy to help</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* =========================================================
          REQUEST CALLBACK POPUP
          This MUST be outside the first Modal
      ========================================================= */}
      <RequestCallback isOpen={isCallbackOpen} setIsOpen={setIsCallbackOpen} />
    </>
  );
};

export default LeadGenerationLinks;
