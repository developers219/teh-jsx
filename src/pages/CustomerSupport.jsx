import React, { useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";

const SUPPORT_PHONE =
  import.meta.env.VITE_SUPPORT_PHONE || "+91 92112 15500";

const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL ||
  "support@travelempireholidays.com";

const CustomerSupport = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top Black Area */}
      <section className="h-18 bg-black lg:h-40"></section>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="w-full pb-16 pt-10"
      >
        <div className="mx-auto w-full max-w-6xl">
          {/* Heading */}
          <div className="px-5 text-center sm:px-8 lg:px-0">
            <h1 className="font-cg text-[clamp(2rem,4vw,3rem)] font-medium tracking-tight text-slate-900">
              Customer Support
            </h1>

            <p className="mx-auto mt-3 max-w-3xl font-mont text-sm leading-7 text-slate-600 sm:text-base">
              Our customer support team is here to assist you with your travel
              plans, bookings, and any concerns related to your journey.
            </p>
          </div>

          {/* Divider */}
          {/* <div className="my-3 h-[2px] w-full bg-slate-200 sm:my-10"></div> */}

          {/* Customer Support Details */}
          <section className="px-5 py-2 sm:px-8 lg:px-6">
            <div className="font-mont text-sm leading-7 text-slate-700 sm:text-base">
              {/* Phone */}
              <p>
                <strong className="font-semibold text-slate-900">
                  Customer Support Phone:
                </strong>{" "}
                <a
                  href={`tel:${SUPPORT_PHONE}`}
                  className="text-slate-700 underline underline-offset-2 transition hover:text-black"
                >
                  {SUPPORT_PHONE}
                </a>
              </p>

              {/* Email */}
              <p className="mt-2">
                <strong className="font-semibold text-slate-900">
                  Email:
                </strong>{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-slate-700 underline underline-offset-2 transition hover:text-black"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>

              {/* Support Hours */}
              <p className="mt-2">
                <strong className="font-semibold text-slate-900">
                  Support Hours:
                </strong>{" "}
                Monday – Saturday, 10:00 AM – 7:00 PM
              </p>

              {/* Response Timeline */}
              <p className="mt-2">
                <strong className="font-semibold text-slate-900">
                  Response Timeline:
                </strong>{" "}
                Within 24–48 hours
              </p>

              {/* Assistance */}
              <p className="mt-2">
                <strong className="font-semibold text-slate-900">
                  Assistance:
                </strong>{" "}
                Booking, itinerary, hotel, transfer, activity, and general
                travel-related support
              </p>
            </div>
          </section>

          {/* Support Form */}
          <section className="mt-12 px-5 sm:px-8 lg:px-0">
            <div className="mb-7">
              <h2 className="font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                Contact Our Support Team
              </h2>

              <p className="mt-3 max-w-3xl font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Please provide your details and tell us about your trip or
                concern. Our team will review your request and get in touch
                with you.
              </p>
            </div>

            <form className="w-full rounded-xl border border-slate-200 p-5 sm:p-7 lg:w-[900px] lg:p-8">
              {/* Name + Phone */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block font-mont text-sm font-medium text-slate-800"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-mont text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block font-mont text-sm font-medium text-slate-800"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="Enter your phone number"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-mont text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="mb-2 block font-mont text-sm font-medium text-slate-800"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-mont text-sm text-slate-900 outline-none transition focus:border-slate-500"
                />
              </div>

              {/* Trip Details */}
              <div className="mt-6">
                <label
                  htmlFor="tripDetails"
                  className="mb-2 block font-mont text-sm font-medium text-slate-800"
                >
                  Trip Details
                </label>

                <input
                  id="tripDetails"
                  type="text"
                  name="tripDetails"
                  placeholder="Destination, travel dates, booking ID, etc."
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-mont text-sm text-slate-900 outline-none transition focus:border-slate-500"
                />
              </div>

              {/* Concern */}
              <div className="mt-6">
                <label
                  htmlFor="concern"
                  className="mb-2 block font-mont text-sm font-medium text-slate-800"
                >
                  Your Concern
                </label>

                <textarea
                  id="concern"
                  name="concern"
                  required
                  rows={5}
                  placeholder="Please tell us how we can help..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 font-mont text-sm text-slate-900 outline-none transition focus:border-slate-500"
                ></textarea>
              </div>

              {/* Submit */}
              <div className="mt-7">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg bg-black px-8 py-3.5 font-mont text-sm font-medium text-white transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </section>
        </div>
      </motion.main>
    </div>
  );
};

export default CustomerSupport;