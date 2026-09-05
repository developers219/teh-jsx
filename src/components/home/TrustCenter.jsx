import FactCheckIcon from "@mui/icons-material/FactCheck";
import PaymentsIcon from "@mui/icons-material/Payments";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SectionHeader from "./SectionHeader";
const trustItems = [
    {
        title: "Verified travel partners",
        description: "Hotels, transport, and local partners are selected with reliability and guest comfort in mind.",
        icon: VerifiedUserIcon,
    },
    {
        title: "Clear inclusions",
        description: "Package details stay transparent so travellers understand stays, transfers, meals, and exclusions.",
        icon: FactCheckIcon,
    },
    {
        title: "Payment clarity",
        description: "Pricing and booking discussions stay documented before confirmation.",
        icon: PaymentsIcon,
    },
    {
        title: "Trip support",
        description: "Customers get assistance from planning stage to final travel coordination.",
        icon: SupportAgentIcon,
    },
];
function TrustCenter() {
    return (<section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Centered heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <SectionHeader title="Built for confident holiday bookings" description="This section gives travellers reassurance before they submit a query or choose a package." align="center"/>
        </div>

        {/* Single row of cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (<article key={item.title} className="group flex min-h-[100px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60">
                {/* Icon */}
                <div className="mb-5+
                 flex h-12 w-12 items-center justify-center self-center rounded-xl bg-cyan-100 text-cyan-700 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white mb-5">
                  <Icon sx={{ fontSize: 23 }}/>
                </div>

                {/* Title */}
                <h3 className="text-lg self-center  font-bold leading-7 text-slate-950">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-center leading-6 text-slate-600">
                  {item.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-auto pt-8">
                  <div className="h-px w-0 bg-cyan-0 transition-0 duration-00 group-hover:w-0 group-hover:bg-cyan-500"/>
                </div>
              </article>);
        })}
        </div>
      </div>
    </section>);
}
export default TrustCenter;
