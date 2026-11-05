import { useState } from "react";
import { User, Phone, MapPin } from "lucide-react";
import Modal from "./Modal";

// Hidden on short screens (viewport height < 680px) so the form fits without scrolling
const HIDE_ON_SHORT = "[@media(max-height:680px)]:hidden";

// Shared field style (same look as the lead form card)
const INPUT_CLASS =
  "h-11 w-full rounded-[14px] border border-slate-300 bg-white pl-12 pr-4 text-[15px] text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-black focus:ring-0 sm:h-12";

const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-[#080b0b]";

const ICON_CLASS =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400";

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
      {/* Single card, same look as the lead form card */}
      <div className="w-[92vw] max-w-md bg-slate-50 p-4 font-inter text-[#080b0b] sm:p-6">
        {/* Header */}
        <div className="mb-4 border-b border-slate-200 pb-4">
          <p
            className={`mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 ${HIDE_ON_SHORT}`}
          >
            GET IN TOUCH
          </p>

          <h2 className="px-8 text-center font-eb text-[26px] font-medium leading-tight text-[#080b0b] sm:text-[30px]">
            Request a Callback
          </h2>

          <p
            className={`mx-auto mt-2 max-w-sm text-center text-[13px] leading-5 text-slate-600 sm:text-sm ${HIDE_ON_SHORT}`}
          >
            Share your details and one of our travel experts will get in touch
            with you shortly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className={LABEL_CLASS}>
              Full Name
            </label>

            <div className="relative">
              <User size={19} strokeWidth={1.7} className={ICON_CLASS} />

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className={LABEL_CLASS}>
              Phone Number
            </label>

            <div className="relative">
              <Phone size={19} strokeWidth={1.7} className={ICON_CLASS} />

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className={LABEL_CLASS}>
              Destination
            </label>

            <div className="relative">
              <MapPin size={19} strokeWidth={1.7} className={ICON_CLASS} />

              <input
                id="destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Where would you like to go?"
                required
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-1 flex h-11 w-full cursor-pointer items-center justify-center rounded-[14px] bg-blue-400 px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-500 sm:h-12"
          >
            Request a Callback
          </button>
        </form>

        {/* Bottom note */}
        <p
          className={`mt-4 text-center text-[11px] text-slate-500 ${HIDE_ON_SHORT}`}
        >
          Our travel expert will contact you at your preferred number.
        </p>
      </div>
    </Modal>
  );
};

export default RequestCallback;