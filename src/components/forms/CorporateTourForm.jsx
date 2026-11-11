import React, { useState } from "react";
import Modal from "../ui/Modal";

/* ---------------------------------------------------------------
   Looks and scales exactly like the other forms
   (LeadCapturePopup / LeadForm card variant, RequestCallback,
   CareerApplication):
     title + divider  ->  fields with * labels  ->  blue button
   Every size / spacing below is copied from there, so all the popups
   are identical on every screen.
---------------------------------------------------------------- */

// Card (wider than the lead form because fields sit side by side on md+)
// px-9 on the title keeps the text away from the close button.
const CARD_CLASS =
  "w-[92vw] max-w-2xl bg-slate-50 p-[clamp(1.25rem,5vw,2.5rem)] font-inter text-[#080b0b]";

// Title + divider
const HEADER_CLASS =
  "mb-[clamp(1rem,4.5vw,1.5rem)] border-b border-[#8c866b]/45 pb-[clamp(0.75rem,3.8vw,1.25rem)]";

const TITLE_CLASS =
  "px-9 text-center font-eb text-[clamp(1.5rem,6.4vw,2.125rem)] font-medium leading-none text-[#080b0b]";

const SUBTITLE_CLASS =
  "mx-auto mt-3 max-w-md text-center text-[clamp(0.8125rem,3.5vw,0.875rem)] leading-[1.5] text-slate-600";

// Label
const LABEL_CLASS =
  "mb-[clamp(0.375rem,1.6vw,0.5rem)] block text-[clamp(0.8125rem,3.5vw,0.875rem)] font-medium text-slate-900";

// Field
const INPUT_CLASS =
  "block h-[clamp(2.75rem,12vw,3.25rem)] w-full rounded-[14px] border border-[#8c866b] bg-white/80 px-[clamp(0.875rem,4vw,1.125rem)] text-[clamp(0.875rem,3.8vw,0.9375rem)] text-slate-900 outline-none placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-0 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#f6f3e9_inset]";

// Comments box: same look, height follows the rows instead of a fixed height
const TEXTAREA_CLASS =
  "block w-full resize-none rounded-[14px] border border-[#8c866b] bg-white/80 px-[clamp(0.875rem,4vw,1.125rem)] py-[clamp(0.625rem,2.5vw,0.875rem)] text-[clamp(0.875rem,3.8vw,0.9375rem)] text-slate-900 outline-none placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-0";

// Service tick boxes (Flights / Hotel / Package): same height and look as a field
const SERVICE_CLASS =
  "flex h-[clamp(2.75rem,12vw,3.25rem)] cursor-pointer items-center gap-3 rounded-[14px] border border-[#8c866b] bg-white/80 px-[clamp(0.875rem,4vw,1.125rem)] text-[clamp(0.875rem,3.8vw,0.9375rem)] text-slate-900 transition-colors hover:border-black";

// Button
const BUTTON_CLASS =
  "flex h-[clamp(2.75rem,12vw,3.5rem)] w-full cursor-pointer items-center justify-center rounded-[14px] bg-blue-400 px-6 text-[clamp(0.8125rem,3.6vw,0.9375rem)] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-blue-400";

// Label + the amber * for required fields
function FieldLabel({ htmlFor, children, required = true }) {
  return (
    <label htmlFor={htmlFor} className={LABEL_CLASS}>
      {children}
      {required && <span className="ml-1 text-amber-700">*</span>}
    </label>
  );
}

const SERVICES = [
  { name: "flights", label: "Flights" },
  { name: "hotel", label: "Hotel" },
  { name: "package", label: "Package" },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  travelDate: "",
  destination: "",
  flights: false,
  hotel: false,
  package: false,
  groupTravellers: "",
  comments: "",
};

const CorporateTourForm = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState(emptyForm);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.flights && !formData.hotel && !formData.package) {
      setMessage("Please select at least one service.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/corporate-tour`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit corporate tour enquiry");
      }

      setMessage(
        "Your corporate tour enquiry has been submitted successfully.",
      );

      // Reset form after successful submission
      setFormData(emptyForm);
    } catch (error) {
      console.error("Corporate tour submission error:", error);

      setMessage(
        "Something went wrong while submitting your enquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={CARD_CLASS}>
        {/* Title + divider */}
        <div className={HEADER_CLASS}>
          <h2 className={TITLE_CLASS}>Corporate Tour Enquiry</h2>

          {/* <p className={SUBTITLE_CLASS}>
            Tell us about your corporate travel requirements and our team will
            help you plan the right experience.
          </p> */}
        </div>

        {/* Form (same gap between fields as the lead form: 20px) */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name + Phone */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="corporate-name">Name</FieldLabel>

              <input
                id="corporate-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                autoComplete="off"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <FieldLabel htmlFor="corporate-phone">Phone Number</FieldLabel>

              <input
                id="corporate-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                autoComplete="off"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <FieldLabel htmlFor="corporate-email">Email</FieldLabel>

            <input
              id="corporate-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              autoComplete="off"
              className={INPUT_CLASS}
            />
          </div>

          {/* Date + Destination */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="corporate-travel-date">
                Date of Travel
              </FieldLabel>

              <input
                id="corporate-travel-date"
                name="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={handleChange}
                required
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <FieldLabel htmlFor="corporate-destination">
                Destination
              </FieldLabel>

              <input
                id="corporate-destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Enter destination"
                required
                autoComplete="off"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <p className={LABEL_CLASS}>
              Services Required
              <span className="ml-1 text-amber-700">*</span>
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {SERVICES.map((service) => (
                <label key={service.name} className={SERVICE_CLASS}>
                  <input
                    type="checkbox"
                    name={service.name}
                    checked={formData[service.name]}
                    onChange={handleChange}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-black"
                  />

                  <span>{service.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Number of Travellers */}
          <div>
            <FieldLabel htmlFor="corporate-group-travellers">
              Number of Group Travellers
            </FieldLabel>

            <input
              id="corporate-group-travellers"
              name="groupTravellers"
              type="number"
              min="1"
              value={formData.groupTravellers}
              onChange={handleChange}
              placeholder="Enter number of travellers"
              required
              className={INPUT_CLASS}
            />
          </div>

          {/* Comments */}
          <div>
            <FieldLabel htmlFor="corporate-comments" required={false}>
              Comments
            </FieldLabel>

            <textarea
              id="corporate-comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Tell us anything else about your corporate trip..."
              rows={4}
              className={TEXTAREA_CLASS}
            />
          </div>

          {/* Message */}
          {message && (
            <p className="text-[clamp(0.8125rem,3.5vw,0.875rem)] leading-6 text-slate-700">
              {message}
            </p>
          )}

          {/* Submit (same spacing as the lead form buttons) */}
          <div className="mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={BUTTON_CLASS}
            >
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CorporateTourForm;