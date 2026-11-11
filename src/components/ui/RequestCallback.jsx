import { useState } from "react";
import Modal from "./Modal";

/* ---------------------------------------------------------------
   Looks and scales exactly like the "Submit Enquiry" popup
   (LeadCapturePopup + LeadForm, card variant):
     title + divider  ->  fields with * labels  ->  blue button  ->  lock note
   Every size / spacing below is copied from LeadForm, so both popups are
   identical on every screen.
---------------------------------------------------------------- */

// Card: same as the LeadCapturePopup single card
// ([&_h3]:px-9 / px-9 on the title keep the text away from the close button)
const CARD_CLASS =
  "w-[92vw] max-w-lg bg-slate-50 p-[clamp(1.25rem,5vw,2.5rem)] font-inter text-[#080b0b]";

// Title + divider (LeadForm StepTitle, card variant)
const HEADER_CLASS =
  "mb-[clamp(1rem,4.5vw,1.5rem)] border-b border-[#8c866b]/45 pb-[clamp(0.75rem,3.8vw,1.25rem)]";

const TITLE_CLASS =
  "px-9 text-center font-eb text-[clamp(1.5rem,6.4vw,2.125rem)] font-medium leading-none text-[#080b0b]";

// Label (LeadForm MinimalField, card variant)
const LABEL_CLASS =
  "mb-[clamp(0.375rem,1.6vw,0.5rem)] block text-[clamp(0.8125rem,3.5vw,0.875rem)] font-medium text-slate-900";

// Field (LeadForm CARD_INPUT_CLASS)
const INPUT_CLASS =
  "block h-[clamp(2.75rem,12vw,3.25rem)] w-full rounded-[14px] border border-[#8c866b] bg-white/80 px-[clamp(0.875rem,4vw,1.125rem)] text-[clamp(0.875rem,3.8vw,0.9375rem)] text-slate-900 outline-none placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-0 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#f6f3e9_inset]";

// Button (LeadForm NextButton / Submit, card variant)
const BUTTON_CLASS =
  "flex h-[clamp(2.75rem,12vw,3.5rem)] w-full cursor-pointer items-center justify-center rounded-[14px] bg-blue-400 px-6 text-[clamp(0.8125rem,3.6vw,0.9375rem)] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-blue-500";

// One field: label (with the amber *) + input
function Field({ id, label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        <span className="ml-1 text-amber-700">*</span>
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        autoComplete="off"
        spellCheck="false"
        className={INPUT_CLASS}
      />
    </div>
  );
}

const RequestCallback = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    destination: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log("Callback Request:", formData);

    // Add your API call here

    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={CARD_CLASS}>
        {/* Title + divider */}
        <div className={HEADER_CLASS}>
          <h2 className={TITLE_CLASS}>Request a Callback</h2>
        </div>

        {/* Form (same gap between fields as the lead form: space-y-5) */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            id="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <Field
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <Field
            id="destination"
            label="Destination"
            placeholder="Where would you like to go?"
            value={formData.destination}
            onChange={handleChange}
          />

          {/* Submit (same spacing as the lead form buttons) */}
          <div className="!mt-7">
            <button type="submit" className={BUTTON_CLASS}>
              Request a Callback
            </button>
          </div>
        </form>

        {/* Note with lock icon (same as the lead form privacy note) */}
        <p className="mt-5 flex justify-center">
          <span className="inline-flex max-w-full items-start gap-2 text-left text-[clamp(0.75rem,3.2vw,0.8125rem)] leading-5 text-slate-600">
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
            <span>
              Our travel expert will contact you at your preferred number.
            </span>
          </span>
        </p>
      </div>
    </Modal>
  );
};

export default RequestCallback;