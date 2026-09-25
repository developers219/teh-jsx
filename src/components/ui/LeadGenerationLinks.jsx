import { Phone, PhoneCall, Mail, ArrowRight, Clock3 } from "lucide-react";
import Modal from "./Modal";
import Woman from "../../assets/images/woman.png"

const LeadGenerationLinks = ({ isOpen, setIsOpen }) => {
    // console.log(meow)
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="grid min-h-[620px] grid-cols-1 overflow-hidden bg-white lg:grid-cols-[0.95fr_1.25fr]">
        
        {/* ================= LEFT ================= */}
        <div className="relative overflow-hidden bg-white px-7 pb-8 pt-7 sm:px-10 lg:px-9">
          
          {/* Decorative plane */}
          <div className="absolute right-8 top-8 rotate-[-12deg] text-black/20">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 16l20-8" />
              <path d="M22 8l-8 13" />
              <path d="M14 21l-1-8" />
              <path d="M13 13L4 5" />
            </svg>
          </div>

          {/* Fun image shape */}
          <div
            className="
              relative mx-auto mt-2
              h-[230px] w-full max-w-[390px]
              overflow-hidden
              [clip-path:path('M24_42C38_10_84_18_119_29C160_42_180_11_226_18C277_25_312_55_350_49C388_43_403_74_394_111C385_151_350_157_330_180C307_206_271_222_227_211C183_200_159_221_119_213C79_205_47_186_25_163C2_140_-4_105_8_77C13_64_18_52_24_42Z')]
              sm:h-[250px]
              lg:h-[245px]
            "
          >
            <img
              src={Woman}
              alt="Travel experience"
              className="h-full w-full object-cover"
            />

            {/* subtle white fade at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/50 to-transparent" />
          </div>

          {/* Small decorative route */}
          <div className="pointer-events-none absolute right-8 top-[245px] hidden sm:block">
            <svg
              width="100"
              height="55"
              viewBox="0 0 100 55"
              fill="none"
            >
              <path
                d="M5 40C25 8 43 48 62 23C73 8 83 12 95 5"
                stroke="#111"
                strokeWidth="1.2"
                strokeDasharray="4 5"
                opacity="0.25"
              />
              <circle cx="95" cy="5" r="4" fill="#111" opacity="0.25" />
            </svg>
          </div>

          {/* Text */}
          <div className="mt-8">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.22em] text-black/45">
              WE'RE HERE TO HELP
            </p>

            <h2 className="max-w-[390px] text-[38px] font-semibold leading-[1.02] tracking-[-0.04em] text-black sm:text-[44px]">
              Plan Your
              <br />
              Next Getaway
            </h2>

            <p className="mt-5 max-w-[390px] text-[15px] leading-6 text-black/55 sm:text-[16px]">
              Get in touch with our travel experts for personalized
              assistance and the best travel deals.
            </p>

            <div className="mt-7 h-[3px] w-14 rounded-full bg-black" />
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="relative flex flex-col justify-center bg-white px-6 py-8 sm:px-10 lg:px-12">
          
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
              Get in touch
            </p>

            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">
              How would you like to connect?
            </h3>
          </div>

          <div className="space-y-4">

            {/* CALL NOW */}
            <button
              type="button"
              className="
                group flex w-full items-center gap-5
                rounded-[22px] border border-black/[0.08]
                bg-white p-5 text-left
                shadow-[0_5px_25px_rgba(0,0,0,0.04)]
                transition-all duration-300
                hover:border-[#c5bd96]
                hover:bg-[#c5bd96]
                hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)]
              "
            >
              <span
                className="
                  flex h-14 w-14 shrink-0 items-center justify-center
                  rounded-full bg-black text-white
                  transition-all duration-300
                  group-hover:bg-black
                "
              >
                <Phone size={22} strokeWidth={2} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[18px] font-semibold text-black">
                  Call Now
                </span>

                <span className="mt-1 block text-sm text-black/50">
                  Speak directly with our travel experts
                </span>
              </span>

              <ArrowRight
                size={22}
                className="
                  shrink-0 text-black
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

            {/* REQUEST CALLBACK */}
            <button
              type="button"
              className="
                group flex w-full items-center gap-5
                rounded-[22px] border border-black/[0.08]
                bg-white p-5 text-left
                shadow-[0_5px_25px_rgba(0,0,0,0.04)]
                transition-all duration-300
                hover:border-[#c5bd96]
                hover:bg-[#c5bd96]
                hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)]
              "
            >
              <span
                className="
                  flex h-14 w-14 shrink-0 items-center justify-center
                  rounded-full bg-black/5 text-black
                  transition-all duration-300
                  group-hover:bg-black group-hover:text-white
                "
              >
                <Clock3 size={22} strokeWidth={1.8} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[18px] font-semibold text-black">
                  Request a Callback
                </span>

                <span className="mt-1 block text-sm text-black/50">
                  We'll call you at your preferred time
                </span>
              </span>

              <ArrowRight
                size={22}
                className="
                  shrink-0 text-black
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

            {/* SUBMIT ENQUIRY */}
            <button
              type="button"
              className="
                group flex w-full items-center gap-5
                rounded-[22px] border border-black/[0.08]
                bg-white p-5 text-left
                shadow-[0_5px_25px_rgba(0,0,0,0.04)]
                transition-all duration-300
                hover:border-[#c5bd96]
                hover:bg-[#c5bd96]
                hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)]
              "
            >
              <span
                className="
                  flex h-14 w-14 shrink-0 items-center justify-center
                  rounded-full bg-black/5 text-black
                  transition-all duration-300
                  group-hover:bg-black group-hover:text-white
                "
              >
                <Mail size={22} strokeWidth={1.8} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[18px] font-semibold text-black">
                  Submit Enquiry
                </span>

                <span className="mt-1 block text-sm text-black/50">
                  Tell us your travel plans & we'll get back
                </span>
              </span>

              <ArrowRight
                size={22}
                className="
                  shrink-0 text-black
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

          </div>

          {/* Bottom reassurance */}
          <div className="mt-7 flex items-center gap-2 text-xs text-black/35">
            <PhoneCall size={14} />
            <span>Our travel experts are happy to help</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LeadGenerationLinks;