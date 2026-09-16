import LeadForm from "../forms/LeadForm";

function PersonalizedHolidayPlan() {
  return (
    <section className="w-full bg-white px-0 py-3 sm:px-4 sm:py-4">
      <div
        className="
          mx-auto
          w-full
          max-w-[1190px]
          overflow-hidden
          rounded-[5px]
          bg-[#c5bd96]
        "
      >
        <div
          className="
            grid
            min-h-[560px]
            w-full
            grid-cols-1
            lg:grid-cols-2
          "
        >
          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <div
            className="
              flex
              min-w-0
              items-center
              px-8
              py-16
              sm:px-12
              md:px-[7%]
              lg:px-[8%]
              xl:px-[8.5%]
            "
          >
            <h2
              className="
                max-w-[500px]
                font-serif
                text-[46px]
                font-medium
                leading-[0.96]
                tracking-[-2.5px]
                text-[#080b0b]
                sm:text-[52px]
                md:text-[57px]
                lg:text-[56px]
                xl:text-[60px]
              "
            >
              Let’s plan your
              <span className="block">
                next journey.
              </span>
            </h2>
          </div>

          {/* =====================================================
              RIGHT SIDE — CENTERED FORM
          ====================================================== */}

          <div
            className="
              flex
              min-w-0
              items-center
              px-8
              py-16
              sm:px-12
              md:px-[7%]
              lg:px-[6%]
              xl:px-[7%]
            "
          >
            <div className="w-full">
              <LeadForm
                // title="Let’s Get Started"
                subtitle=""
                submitLabel="Submit"
                successMessage="Your holiday plan request has been received."
                initialValues={{
                  source: "Personalized Holiday Plan",
                  destinationInterest: "",
                  packageInterest: "",
                  status: "New",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PersonalizedHolidayPlan;