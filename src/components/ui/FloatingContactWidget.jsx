import { useEffect, useState } from "react";
import { ChevronUp, MessageCircle, Pen, Phone, X } from "lucide-react";
import LeadCapturePopup from "../forms/LeadCapturePopup";

const WHATSAPP_NUMBER = "919000000000";
const CALLBACK_PHONE_NUMBER = "+919000000000";

function FloatingContactWidget({ isMenuOpen, isOpen, setIsOpen }) {
  // const [] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  function handleClose() {
    setIsOpen(false);
  }

  useEffect(() => {}, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <div
        className="bg-beige text-white mr-3 rounded-full p-2 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronUp />
      </div>
      {!isMenuOpen && isOpen ? (
        <div className="w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-end border-b border-slate-100 px-3 py-2">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close contact options"
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-1 p-2">
            <a
              href={``}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Phone size={18} className="text-beige" />
              Call Now
            </a>
            <p
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
              onClick={() => setIsPopUpOpen(true)}
            >
              <Pen size={18} className="text-beige" />
              Submit an enquiry
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <MessageCircle size={18} className="text-beige" />
              Chat With Our Executive
            </a>
          </div>
        </div>
      ) : null}
      <div>
        {isPopUpOpen ? (
          <LeadCapturePopup isOpen={isPopUpOpen} setIsOpen={setIsPopUpOpen} />
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        aria-label="Contact us"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-beige text-white shadow-xl transition hover:bg-beigeD cursor-pointer"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-beige opacity-75" />
        <MessageCircle size={26} className="relative" />
      </button>
    </div>
  );
}

export default FloatingContactWidget;
