import SectionHeader from "./SectionHeader";
const steps = [
    {
        title: "Share your travel idea",
        description: "Tell us destination, dates, budget, travellers, and the kind of holiday you want.",
    },
    {
        title: "Get a curated plan",
        description: "Our team prepares options with routes, stays, inclusions, and practical travel flow.",
    },
    {
        title: "Confirm and travel",
        description: "Once you approve the plan, we help with booking support and trip coordination.",
    },
];
function HowItWorks() {
    return (<section className="bg-slate-50 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Centered heading */}
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeader title="Simple planning, clear next steps" description="The process stays easy for travellers and structured for the team handling the holiday request." align="center"/>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step) => (<article key={step.title} className="group flex min-h-[185px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-grey hover:shadow-xl hover:shadow-slate-200/50">
              {/* Content */}
              <div>
                <h3 className="text-xl font-black leading-7 text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>

              {/* Bottom accent */}
              <div className="mt-auto pt-8">
                <div className="h-px w-0 bg-cyan-0 transition-0 duration-0 group-hover:w-0 group-hover:bg-cyan-500"/>
              </div>
            </article>))}
        </div>
      </div>
    </section>);
}
export default HowItWorks;
