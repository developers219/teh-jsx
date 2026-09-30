import React, { useState } from "react";
import Modal from "../ui/Modal";

const CorporateTourForm = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
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
  });

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
      setFormData({
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
      });
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
      <div className="w-[calc(100vw-32px)] max-w-2xl bg-white p-6 font-mont sm:p-8">
        {/* Header */}
        <div className="mb-7 pr-8">
          <h2 className="font-cg  text-[clamp(2rem,4vw,3rem)] text-center font-medium text-slate-900 ">
            Corporate Tour Enquiry
          </h2>

          <p className="mt-2 text-sm text-center leading-6 text-slate-500">
            Tell us about your corporate travel requirements and our team will
            help you plan the right experience.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name + Phone */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="corporate-name"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Name
              </label>

              <input
                id="corporate-name"
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
                htmlFor="corporate-phone"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Phone Number
              </label>

              <input
                id="corporate-phone"
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
              htmlFor="corporate-email"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Email
            </label>

            <input
              id="corporate-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-slate-500"
            />
          </div>

          {/* Date + Destination */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="corporate-travel-date"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Date of Travel
              </label>

              <input
                id="corporate-travel-date"
                name="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="corporate-destination"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Destination
              </label>

              <input
                id="corporate-destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Enter destination"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-slate-500"
              />
            </div>
          </div>

          {/* Services */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-slate-800">
              Services Required
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:border-slate-400">
                <input
                  type="checkbox"
                  name="flights"
                  checked={formData.flights}
                  onChange={handleChange}
                  className="h-4 w-4 accent-black"
                />

                <span className="text-sm text-slate-700">Flights</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:border-slate-400">
                <input
                  type="checkbox"
                  name="hotel"
                  checked={formData.hotel}
                  onChange={handleChange}
                  className="h-4 w-4 accent-black"
                />

                <span className="text-sm text-slate-700">Hotel</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:border-slate-400">
                <input
                  type="checkbox"
                  name="package"
                  checked={formData.package}
                  onChange={handleChange}
                  className="h-4 w-4 accent-black"
                />

                <span className="text-sm text-slate-700">Package</span>
              </label>
            </div>
          </div>

          {/* Number of Travellers */}
          <div className="mt-5">
            <label
              htmlFor="corporate-group-travellers"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Number of Group Travellers
            </label>

            <input
              id="corporate-group-travellers"
              name="groupTravellers"
              type="number"
              min="1"
              value={formData.groupTravellers}
              onChange={handleChange}
              placeholder="Enter number of travellers"
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-slate-500"
            />
          </div>

          {/* Comments */}
          <div className="mt-5">
            <label
              htmlFor="corporate-comments"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Comments
            </label>

            <textarea
              id="corporate-comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Tell us anything else about your corporate trip..."
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-slate-500"
            />
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
            className="mt-7 w-full cursor-pointer rounded-lg bg-black px-6 py-3.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default CorporateTourForm;