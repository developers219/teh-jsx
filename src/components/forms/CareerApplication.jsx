import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";

/* ---------------------------------------------------------------
   Looks and scales exactly like the other forms
   (LeadCapturePopup / LeadForm card variant and RequestCallback):
     title + divider  ->  fields with * labels  ->  blue button
   Every size / spacing below is copied from there, so all the popups
   are identical on every screen.
---------------------------------------------------------------- */

// Card (wider than the lead form because Name + Phone sit side by side on md+)
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

// Read-only field (Job Role)
const READONLY_INPUT_CLASS = `${INPUT_CLASS} cursor-default bg-slate-100 focus:border-[#8c866b]`;

// Button
const BUTTON_CLASS =
  "flex h-[clamp(2.75rem,12vw,3.5rem)] w-full cursor-pointer items-center justify-center rounded-[14px] bg-blue-400 px-6 text-[clamp(0.8125rem,3.6vw,0.9375rem)] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60";

// Label + the amber * for required fields
function FieldLabel({ htmlFor, children, required = true }) {
  return (
    <label htmlFor={htmlFor} className={LABEL_CLASS}>
      {children}
      {required && <span className="ml-1 text-amber-700">*</span>}
    </label>
  );
}

const CareerApplication = ({ isOpen, setIsOpen, jobRole }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    jobRole: "",
  });

  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      jobRole: jobRole || "",
    }));
  }, [jobRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setResume(file);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setMessage("Please upload your resume.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("jobRole", formData.jobRole);
      data.append("resume", resume);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/careers/apply`,
        {
          method: "POST",
          body: data,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setMessage("Your application has been submitted successfully.");

      setFormData({
        name: "",
        phone: "",
        email: "",
        jobRole: jobRole || "",
      });

      setResume(null);

      const fileInput = document.getElementById("resume");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Application submission error:", error);

      setMessage(
        "Something went wrong while submitting your application. Please try again.",
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
          <h2 className={TITLE_CLASS}>Apply for a Job</h2>

          <p className={SUBTITLE_CLASS}>
            Fill in your details and upload your resume.
          </p>
        </div>

        {/* Form (same gap between fields as the lead form: 20px) */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name + Phone */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="name">Name</FieldLabel>

              <input
                id="name"
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
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>

              <input
                id="phone"
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
            <FieldLabel htmlFor="email">Email</FieldLabel>

            <input
              id="email"
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

          {/* Job Role */}
          <div>
            <FieldLabel htmlFor="jobRole" required={false}>
              Job Role
            </FieldLabel>

            <input
              id="jobRole"
              name="jobRole"
              type="text"
              value={formData.jobRole}
              readOnly
              className={READONLY_INPUT_CLASS}
            />
          </div>

          {/* Resume */}
          <div>
            <FieldLabel htmlFor="resume">Upload Resume</FieldLabel>

            <label
              htmlFor="resume"
              className="flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[#8c866b] bg-white/60 px-[clamp(1rem,4vw,1.25rem)] py-[clamp(1.25rem,5vw,1.75rem)] text-center transition-colors hover:border-black"
            >
              <span className="mb-2 text-[clamp(1.5rem,6vw,1.75rem)] leading-none text-slate-500">
                ↑
              </span>

              <span className="break-all text-[clamp(0.8125rem,3.5vw,0.875rem)] font-medium text-slate-800">
                {resume ? resume.name : "Click to upload your resume"}
              </span>

              <span className="mt-1 text-[clamp(0.6875rem,3vw,0.75rem)] text-slate-500">
                PDF, DOC or DOCX
              </span>

              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="hidden"
              />
            </label>

            {resume && (
              <p className="mt-2 break-all text-[clamp(0.6875rem,3vw,0.75rem)] text-slate-600">
                Selected file: {resume.name}
              </p>
            )}
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
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CareerApplication;