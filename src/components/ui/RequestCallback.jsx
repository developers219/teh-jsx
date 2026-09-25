import { useState } from "react";
import { ArrowRight, User, Phone, MapPin } from "lucide-react";
import Modal from "./Modal";

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

    console.log("Callback Request:", formData);

    // Add your API call here

    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="bg-white px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
        
        {/* Header */}
        <div className="max-w-xl pr-10">
          <p className="mb-3 text-[11px] text-center font-semibold uppercase tracking-[0.22em] text-black/40">
            GET IN TOUCH
          </p>

          <h2 className="text-3xl text-center font-semibold tracking-[-0.04em] text-black sm:text-4xl">
            Request a Callback
          </h2>

          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-black/50 sm:text-[15px]">
    Share your details and one of our travel experts will get in
    touch with you shortly.
  </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-black"
            >
              Full Name
            </label>

            <div className="relative">
              <User
                size={19}
                strokeWidth={1.7}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="
                  h-14 w-full rounded-xl
                  border border-black/10
                  bg-white
                  pl-12 pr-4
                  text-sm text-black
                  outline-none
                  placeholder:text-black/30
                  transition-all duration-200
                  focus:border-black
                  focus:ring-0
                "
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-black"
            >
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={19}
                strokeWidth={1.7}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="
                  h-14 w-full rounded-xl
                  border border-black/10
                  bg-white
                  pl-12 pr-4
                  text-sm text-black
                  outline-none
                  placeholder:text-black/30
                  transition-all duration-200
                  focus:border-black
                  focus:ring-0
                "
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label
              htmlFor="destination"
              className="mb-2 block text-sm font-medium text-black"
            >
              Destination
            </label>

            <div className="relative">
              <MapPin
                size={19}
                strokeWidth={1.7}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                id="destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Where would you like to go?"
                required
                className="
                  h-14 w-full rounded-xl
                  border border-black/10
                  bg-white
                  pl-12 pr-4
                  text-sm text-black
                  outline-none
                  placeholder:text-black/30
                  transition-all duration-200
                  focus:border-black
                  focus:ring-0
                "
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              group mt-3 flex h-14 w-full
              items-center justify-center gap-3
              rounded-xl
              bg-black
              px-6
              text-sm font-semibold
              text-beige
              transition-all duration-300
              cursor-pointer
             
            "
          >
            Request a Callback

            {/* <ArrowRight
              size={19}
              strokeWidth={1.8}
              className="
                transition-transform duration-300
                group-hover:translate-x-1
              "
            /> */}
          </button>
        </form>

        {/* Bottom note */}
        <p className="mt-5 text-center text-[11px] text-black/35">
          Our travel expert will contact you at your preferred number.
        </p>
      </div>
    </Modal>
  );
};

export default RequestCallback;