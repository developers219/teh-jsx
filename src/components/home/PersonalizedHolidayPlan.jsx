import LeadForm from "../forms/LeadForm";
import { Heading } from "../ui/Heading";
import Contact from "../../assets/images/contact.png";

// Outside the component, so LeadForm doesn't reset on every parent render
const LEAD_INITIAL_VALUES = {
  source: "Personalized Holiday Plan",
  destinationInterest: "",
  packageInterest: "",
  status: "New",
};

function PersonalizedHolidayPlan() {
  return (
    <section className="w-full bg-white px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      <div
        className="
          relative
          mx-auto
          grid
          w-full
          max-w-[1320px]
          grid-cols-1
          items-center
          gap-10
          overflow-hidden
          rounded-[32px]
          bg-slate-100
          px-6
          py-12
          sm:px-12
          lg:grid-cols-[1fr_520px]
          lg:gap-[72px]
          lg:px-20
          lg:py-[72px]
        "
      >
        {/* =====================================================
            BACKGROUND DOTS
        ====================================================== */}

        {/* <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-50
            [background-image:radial-gradient(#b1aa87_0.7px,transparent_0.7px)]
            [background-size:20px_20px]
          "
        /> */}

        {/* =====================================================
            LEFT SIDE — HEADING + ILLUSTRATION
        ====================================================== */}

        <div className="relative flex min-w-0 flex-col">
          <Heading heading="Let’s plan your next" highlight="journey." />

          <img
            src={Contact}
            alt="Traveller with a suitcase"
            className="mt-2 w-full max-w-[320px] self-center sm:max-w-[400px] lg:ml-10 lg:self-start"
          />
        </div>

        {/* =====================================================
            RIGHT SIDE — FROSTED FORM CARD
        ====================================================== */}

        <div
          className="
            relative
            min-w-0
            rounded-3xl
            border
            border-white/90
            bg-white/60
            p-6
            shadow-[0_24px_60px_rgba(60,50,20,0.14)]
            backdrop-blur-xl
            sm:p-10
          "
        >
          <LeadForm
            variant="card"
            subtitle=""
            submitLabel="Submit"
            successMessage="Your holiday plan request has been received."
            initialValues={LEAD_INITIAL_VALUES}
          />
        </div>
      </div>
    </section>
  );
}

export default PersonalizedHolidayPlan;