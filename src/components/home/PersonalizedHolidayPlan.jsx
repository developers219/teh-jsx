import LeadForm from "../forms/LeadForm";
import formBackground from "../../assets/images/ss.png";
function PersonalizedHolidayPlan() {
    return (<section className="relative overflow-hidden bg-white">
      <div className="
          mx-auto
          w-full
          max-w-[1440px]
          px-5
          py-12
          sm:px-8
          sm:py-16
          md:px-10
          md:py-20
          xl:px-12
          xl:py-24
        ">
        <div className="
            grid
            items-start
            gap-12
            md:gap-14
           min-[900px]:grid-cols-[1fr_1fr]
            lg:gap-14
            xl:grid-cols-[0.95fr_1.05fr]
            xl:gap-20
          ">
          {/* =====================================================
            LEFT SIDE — TEXT + IMAGE
        ====================================================== */}

          <div className="flex min-w-0 flex-col">
            {/* MAIN HEADING */}

            <h2 className="
                max-w-[520px]
                text-[38px]
                font-extrabold
                leading-[1.02]
                tracking-[-1.6px]
                text-black
                sm:text-[46px]
                md:text-[52px]
                xl:text-[58px]
              ">
              Let's plan your
              <span className="block">
                next journey.
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p className="
                mt-4
                max-w-[480px]
                text-[14px]
                leading-6
                text-neutral-600
                sm:mt-5
                sm:text-[15px]
                sm:leading-7
              ">
              Tell us what you have in mind and our travel experts
              will help turn your ideas into a memorable holiday.
            </p>

            {/* =================================================
            IMAGE
        ================================================== */}

            <div className="
                relative
                mt-9
                w-full
                overflow-hidden
                bg-white
                sm:mt-9
              ">
              <img src={formBackground} alt="Plan your next journey" className="
                  block
                  h-auto
                  w-full
                  object-cover
                  object-center
                  -translate-x-4
    sm:-translate-x-5
    md:-translate-x-6
    lg:-translate-x-8
    xl:-translate-x-10
                  sm:h-[320px]
                  md:h-[360px]
                  lg:h-[380px]
                  xl:h-[420px]
                "/>

              {/* HIDE TOP LINE */}

              {/* <div
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-0
            h-[40px]
            bg-white
            sm:h-[45px]
          "
        /> */}

              {/* HIDE BOTTOM LINE / TEXT */}

              {/* <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            right-0
            h-[45px]
            bg-white
            sm:h-[55px]
          "
        /> */}
            </div>
          </div>

          {/* =====================================================
            RIGHT SIDE — FORM
        ====================================================== */}

          <div className="
              min-w-0
              w-full
              lg:pt-1
              xl:pt-2
            ">
            {/* FORM HEADING */}

            <div className="mb-6 sm:mb-7">
              <p className="
                  mb-2
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-neutral-500
                  sm:mb-3
                  sm:text-[11px]
                ">
                Start Here
              </p>

              <h3 className="
                  text-[32px]
                  font-extrabold
                  leading-[1.05]
                  tracking-[-1.1px]
                  text-black
                  sm:text-[38px]
                  md:text-[42px]
                ">
                Where will you
                <span className="block">
                  go next?
                </span>
              </h3>

              <p className="
                  mt-3
                  max-w-[500px]
                  text-[13px]
                  leading-6
                  text-neutral-500
                  sm:text-[14px]
                ">
                Share a few details about your trip and our experts
                will get back to you with suitable options.
              </p>
            </div>

            {/* =================================================
            LEAD FORM
        ================================================== */}

            <div className="w-full">
              <LeadForm title="" subtitle="" submitLabel="Request My Travel Plan" successMessage="Your holiday plan request has been received." initialValues={{
            source: "Personalized Holiday Plan",
            destinationInterest: "",
            packageInterest: "",
            status: "New",
        }}/>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
export default PersonalizedHolidayPlan;
