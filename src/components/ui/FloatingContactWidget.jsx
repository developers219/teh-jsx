import { useEffect, useRef, useState } from "react";
import { ChevronUp, MessageCircle, Pen, Phone, X } from "lucide-react";
import LeadCapturePopup from "../forms/LeadCapturePopup";
import whatsappIcon from "../../assets/images/whatsapp.png";

const WHATSAPP_NUMBER = "919211215500";
const CALLBACK_PHONE_NUMBER = "+919211215500";

// Sizes scale with the screen width (clamp), like the page sections.
// One row of the contact card (Call Now / Submit an enquiry / Chat):
const ITEM_CLASS =
  "flex items-center gap-[clamp(0.625rem,3vw,0.75rem)] rounded-xl px-[clamp(0.5rem,2.6vw,0.75rem)] py-[clamp(0.5rem,2.6vw,0.75rem)] text-[clamp(0.8125rem,3.4vw,0.875rem)] font-semibold text-slate-700 transition hover:bg-slate-50";
// Icon in front of each row
const ITEM_ICON_CLASS = "size-[clamp(1rem,4.4vw,1.125rem)] text-blue-400";

function FloatingContactWidget({ isMenuOpen, isOpen, setIsOpen }) {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const autoOpenCount = useRef(0);
  const isMenuOpenRef = useRef(isMenuOpen);
  const isOpenRef = useRef(isOpen);
  const menuIntervalRef = useRef(null);
  const widgetIntervalRef = useRef(null);
  const initialTimeoutRef = useRef(null);

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  function handleClose() {
    setIsOpen(false);
  }

  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    initialTimeoutRef.current = setTimeout(() => {
      menuIntervalRef.current = setInterval(() => {
        if (isMenuOpenRef.current) {
          return;
        }

        clearInterval(menuIntervalRef.current);
        menuIntervalRef.current = null;

        widgetIntervalRef.current = setInterval(() => {
          if (isOpenRef.current) {
            return;
          }

          if (autoOpenCount.current < 3) {
            setIsOpen(true);
            autoOpenCount.current += 1;
          }

          if (autoOpenCount.current >= 3) {
            clearInterval(widgetIntervalRef.current);
            widgetIntervalRef.current = null;
          }
        }, 60000);
      }, 2000);
    }, 15000);

    return () => {
      clearTimeout(initialTimeoutRef.current);
      clearInterval(menuIntervalRef.current);
      clearInterval(widgetIntervalRef.current);
    };
  }, []);

  // Below sm the widget sits ABOVE the centered "Plan a Trip" pill
  // (pill height + gap = 4rem), so the pill never covers it.
  // right: 1rem on phones, grows to 1.5rem on bigger screens.
  return (
    <div className="fixed bottom-6 max-lg:bottom-[var(--widget-bottom,1.5rem)] max-sm:bottom-[calc(var(--widget-bottom,1.5rem)+4rem)] font-inter right-[clamp(1rem,3vw,1.5rem)] z-50 flex flex-col items-end gap-1">
      {/* Scroll to top (mr keeps it centered above the WhatsApp button) */}
      <div
        className="mr-[clamp(0.8rem,3.2vw,1rem)] cursor-pointer rounded-full bg-white p-[clamp(0.1875rem,1vw,0.25rem)] text-black mix-blend-difference"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronUp size={20} className="size-[clamp(1rem,4.6vw,1.25rem)]" />
      </div>
      {!isMenuOpen && isOpen ? (
        <div className="w-[clamp(14rem,62vw,16rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-end border-b border-slate-100 px-[clamp(0.5rem,2.6vw,0.75rem)] py-[clamp(0.375rem,1.6vw,0.5rem)]">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close contact options"
              className="flex size-[clamp(1.5rem,6.4vw,1.75rem)] items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} className="size-[clamp(0.875rem,4vw,1rem)]" />
            </button>
          </div>

          <div className="flex flex-col gap-1 p-[clamp(0.375rem,1.6vw,0.5rem)]">
            <a href={"tel:+919211215500"} className={ITEM_CLASS}>
              <Phone size={18} className={ITEM_ICON_CLASS} />
              Call Now
            </a>
            <p
              className={`${ITEM_CLASS} cursor-pointer`}
              onClick={() => setIsPopUpOpen(true)}
            >
              <Pen size={18} className={ITEM_ICON_CLASS} />
              Submit an enquiry
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className={ITEM_CLASS}
            >
              <MessageCircle size={18} className={ITEM_ICON_CLASS} />
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
        className="relative flex size-[clamp(3rem,12vw,3.5rem)] cursor-pointer items-center justify-center rounded-full bg-transparent shadow-none transition"
      >
        <img
          src={whatsappIcon}
          alt=""
          className="h-full w-full object-contain"
        />
      </button>
    </div>
  );
}

export default FloatingContactWidget;