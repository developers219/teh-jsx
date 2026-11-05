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
        {/* Single card, same look as the lead form card */}
        <div className="w-[92vw] max-w-md bg-slate-50 p-6 font-inter text-[#080b0b] sm:p-8">
          {/* Heading */}
          <div className="mb-6 border-b border-slate-200 pb-5">
            <h3 className="px-8 text-center font-eb text-[28px] font-medium leading-tight text-[#080b0b] sm:text-[32px]">
              How would you like to connect?
            </h3>
          </div>

          {/* Options (vertical) */}
          <div className="space-y-3">
            {contactOptions.map(({ title, description, icon: Icon, func }) => (
              <button
                key={title}
                type="button"
                onClick={func}
                className="group flex w-full cursor-pointer items-center gap-4 rounded-[14px] border border-slate-200 bg-white p-4 text-left transition-all duration-300 hover:border-blue-400 hover:bg-blue-400 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#080b0b] transition-all duration-300 group-hover:bg-white/25 group-hover:text-white">
                  <Icon size={20} strokeWidth={1.8} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold text-[#080b0b] transition-colors duration-300 group-hover:text-white">
                    {title}
                  </span>

                  <span className="mt-1 block text-[13px] leading-5 text-slate-500 transition-colors duration-300 group-hover:text-white/85">
                    {description}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Bottom reassurance */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <PhoneCall size={14} />
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