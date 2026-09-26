import { useState } from "react";
import { Phone, PhoneCall, Mail, Clock3 } from "lucide-react";

import Modal from "./Modal";
import RequestCallback from "./RequestCallback";
import LeadCapturePopUp from "../forms/LeadCapturePopup";
import Woman from "../../assets/images/woman.png";

const LeadGenerationLinks = ({ isOpen, setIsOpen }) => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);

  const handleCall = () => {
    setIsOpen(false);
    window.open("tel:+919876543210", "_self");
  };

  const handleRequestCallback = () => {
    setIsOpen(false);
    setIsCallbackOpen(true);
  };

  const handleLeadPopUp = () => {
    setIsOpen(false);
    setIsLeadOpen(true);
  };

  const contactOptions = [
    {
      title: "Call Now",
      description: "Speak directly with our travel experts",
      icon: Phone,
      func: handleCall,
    },
    {
      title: "Request a Callback",
      description: "We'll call you at your preferred time",
      icon: Clock3,
      func: handleRequestCallback,
    },
    {
      title: "Submit Enquiry",
      description: "Tell us your travel plans & we'll get back",
      icon: Mail,
      func: handleLeadPopUp,
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div
          className="
            w-[92vw]
            max-w-[1100px]
            overflow-hidden
            bg-white

            lg:w-[60vw]
            lg:grid
            lg:grid-cols-[1fr_1fr]
          "
        >
          {/* ================= LEFT ================= */}
          {/* Hidden on mobile, iPad and tablet.
              Visible from lg desktop onwards. */}
          <div
            className="
              relative
              hidden
              w-full
              overflow-hidden
              px-2
              pb-8
              pt-7
              lg:block
            "
          >
            <div
              className="
                relative
                mx-auto
                mt-2
                h-[230px]
                w-full
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

              <h2 className="text-2xl font-semibold leading-[1.02] tracking-[-0.04em] text-black sm:text-[44px]">
                Plan Your
                <br />
                Next Getaway
              </h2>

              <p className="mt-5 text-[15px] leading-6 text-black/55 sm:text-[16px]">
                Get in touch with our travel experts for personalized
                assistance and the best travel deals.
              </p>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div
            className="
              relative
              flex
              w-full
              flex-col
              justify-center
              px-5
              py-7

              sm:px-7
              sm:py-8

              lg:px-4
              lg:py-8
            "
          >
            <div className="mb-7 sm:mb-8">
              <p className="text-[11px] text-center font-semibold uppercase tracking-[0.2em] text-black/40">
                Get in touch
              </p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-[-0.03em]
                  text-black
                  text-center

                  sm:text-3xl
                "
              >
                How would you like to connect?
              </h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {contactOptions.map(
                ({ title, description, icon: Icon, func }) => (
                  <button
                    key={title}
                    type="button"
                    onClick={func}
                    className="
                      group
                      flex
                      w-full
                      cursor-pointer
                      items-center
                      gap-4
                      rounded-[20px]
                      border
                      border-black/[0.08]
                      bg-white
                      p-4
                      text-left
                      shadow-[0_5px_25px_rgba(0,0,0,0.04)]
                      transition-all
                      duration-300

                      hover:border-[#c5bd96]
                      hover:bg-[#c5bd96]
                      hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)]

                      sm:gap-5
                      sm:p-5
                    "
                  >
                    <span
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-black/5
                        text-black
                        transition-all
                        duration-300

                        group-hover:bg-black
                        group-hover:text-white

                        sm:h-14
                        sm:w-14
                      "
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.8}
                        className="sm:h-[22px] sm:w-[22px]"
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-semibold text-black sm:text-[18px]">
                        {title}
                      </span>

                      <span className="mt-1 block text-[13px] leading-5 text-black/50 sm:text-sm">
                        {description}
                      </span>
                    </span>
                  </button>
                ),
              )}
            </div>

            {/* Bottom reassurance */}
            <div className="mt-6 flex items-center gap-2 text-xs text-black/35 sm:mt-7">
              <PhoneCall size={14} />
              <span>Our travel experts are happy to help</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* REQUEST CALLBACK POPUP */}
      <RequestCallback
        isOpen={isCallbackOpen}
        setIsOpen={setIsCallbackOpen}
      />

      {/* LEAD CAPTURE POPUP */}
      <LeadCapturePopUp
        isOpen={isLeadOpen}
        setIsOpen={setIsLeadOpen}
      />
    </>
  );
};

export default LeadGenerationLinks;