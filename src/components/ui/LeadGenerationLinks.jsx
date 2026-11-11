import { useState } from "react";
import { Phone, PhoneCall, Mail, Clock3 } from "lucide-react";

import Modal from "./Modal";
import RequestCallback from "./RequestCallback";
import LeadCapturePopUp from "../forms/LeadCapturePopup";

const LeadGenerationLinks = ({ isOpen, setIsOpen }) => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);

  const handleCall = () => {
    setIsOpen(false);
    window.open("tel:+919211215500", "_self");
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
        {/* Single card, same look as the lead form card.
            Text, icons and spacing scale with the screen width (clamp),
            like the headings of the page sections. */}
        <div className="w-[92vw] max-w-md bg-slate-50 p-[clamp(1rem,5vw,2rem)] font-inter text-[#080b0b]">
          {/* Heading (px-8 keeps it clear of the close button) */}
          <div className="mb-[clamp(1rem,4vw,1.5rem)] border-b border-slate-200 pb-[clamp(0.75rem,3.5vw,1.25rem)]">
            <h3 className="px-8 text-center font-eb text-[clamp(1.375rem,6vw,2rem)] font-medium leading-tight text-[#080b0b]">
              How would you like to connect?
            </h3>
          </div>

          {/* Options (vertical) */}
          <div className="space-y-[clamp(0.5rem,2.4vw,0.75rem)]">
            {contactOptions.map(({ title, description, icon: Icon, func }) => (
              <button
                key={title}
                type="button"
                onClick={func}
                className="group flex w-full cursor-pointer items-center gap-[clamp(0.75rem,3.5vw,1rem)] rounded-[14px] border border-slate-200 bg-white p-[clamp(0.75rem,3.5vw,1rem)] text-left transition-all duration-300 hover:border-blue-400 hover:bg-blue-400 hover:shadow-md"
              >
                <span className="flex size-[clamp(2.5rem,10vw,3rem)] shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#080b0b] transition-all duration-300 group-hover:bg-white/25 group-hover:text-white">
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                    className="size-[clamp(1.0625rem,4.6vw,1.25rem)]"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[clamp(0.9375rem,3.8vw,1rem)] font-semibold text-[#080b0b] transition-colors duration-300 group-hover:text-white">
                    {title}
                  </span>

                  <span className="mt-1 block text-[clamp(0.75rem,3.2vw,0.8125rem)] leading-[1.4] text-slate-500 transition-colors duration-300 group-hover:text-white/85">
                    {description}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Bottom reassurance */}
          <div className="mt-[clamp(1rem,4vw,1.5rem)] flex items-center justify-center gap-2 text-[clamp(0.6875rem,3vw,0.75rem)] text-slate-500">
            <PhoneCall
              size={14}
              className="size-[clamp(0.75rem,3.4vw,0.875rem)] shrink-0"
            />
            <span>Our travel experts are happy to help</span>
          </div>
        </div>
      </Modal>

      {/* REQUEST CALLBACK POPUP */}
      <RequestCallback isOpen={isCallbackOpen} setIsOpen={setIsCallbackOpen} />

      {/* LEAD CAPTURE POPUP */}
      <LeadCapturePopUp isOpen={isLeadOpen} setIsOpen={setIsLeadOpen} />
    </>
  );
};

export default LeadGenerationLinks;