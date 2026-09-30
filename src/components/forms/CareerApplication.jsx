import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";

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
      <div className="w-[calc(100vw-32px)] max-w-2xl bg-white p-6 font-mont sm:p-8">
        {/* Header */}
        <div className="mb-7 pr-8">
          <h2 className="font-cg text-3xl text-center font-medium text-slate-900 sm:text-4xl">
            Apply for a Job
          </h2>

          <p className="mt-2 text-sm text-center leading-6 text-slate-500">
            Fill in your details and upload your resume. Our team will review
            your application and get back to you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name + Phone */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-slate-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-slate-500"
            />
          </div>

          {/* Job Role */}
          <div className="mt-5">
            <label
              htmlFor="jobRole"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Job Role
            </label>

            <input
              id="jobRole"
              name="jobRole"
              type="text"
              value={formData.jobRole}
              readOnly
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            />
          </div>

          {/* Resume */}
          <div className="mt-5">
            <label
              htmlFor="resume"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Upload Resume
            </label>

            <label
              htmlFor="resume"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition-colors hover:border-slate-500"
            >
              <span className="mb-2 text-2xl text-slate-500">↑</span>

              <span className="text-sm font-medium text-slate-700">
                {resume
                  ? resume.name
                  : "Click to upload your resume"}
              </span>

              <span className="mt-1 text-xs text-slate-400">
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
              <p className="mt-2 text-xs text-slate-500">
                Selected file: {resume.name}
              </p>
            )}
          </div>

          {/* Message */}
          {message && (
            <p className="mt-5 text-sm leading-6 text-slate-600">
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 w-full rounded-lg bg-black px-6 py-3.5 text-sm font-medium text-white transition-colors cursor-pointer  disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default CareerApplication;