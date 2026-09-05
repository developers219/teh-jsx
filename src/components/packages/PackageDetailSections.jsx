import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import RouteIcon from "@mui/icons-material/Route";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
const standardSectionContent = {
    activity: {
        eyebrow: "Experiences",
        title: "Activities",
        icon: <LocalActivityIcon color="primary"/>,
    },
    flight: {
        eyebrow: "Air travel",
        title: "Flights",
        icon: <FlightTakeoffIcon color="primary"/>,
    },
    stay: {
        eyebrow: "Accommodation",
        title: "Stay",
        icon: <HotelIcon color="primary"/>,
    },
    transfer: {
        eyebrow: "Ground travel",
        title: "Transfers",
        icon: <SwapHorizIcon color="primary"/>,
    },
};
const standardSectionOrder = [
    "activity",
    "flight",
    "stay",
    "transfer",
];
function DetailItem({ section }) {
    return (<Card className="overflow-hidden border border-slate-100 shadow-sm" sx={{ borderRadius: 4 }}>
      {section.imageUrl ? (<img src={section.imageUrl} alt={section.title} className="h-48 w-full object-cover" loading="lazy"/>) : null}

      <div className="p-5">
        <h3 className="text-lg font-black text-slate-950">{section.title}</h3>

        {section.description ? (<p className="mt-2 text-sm leading-7 text-slate-600">
            {section.description}
          </p>) : null}
      </div>
    </Card>);
}
function InclusionExclusionList({ title, items, type, }) {
    const isInclusion = type === "inclusion";
    return (<Card className="border border-slate-100 shadow-sm" sx={{ borderRadius: 4, p: { xs: 2.5, sm: 3 } }}>
      <div className="flex items-center gap-2">
        {isInclusion ? (<CheckCircleIcon sx={{ color: "#059669" }}/>) : (<CancelIcon sx={{ color: "#dc2626" }}/>)}

        <h3 className="text-xl font-black text-slate-950">{title}</h3>
      </div>

      <ul className="mt-5 space-y-4">
        {items.map((item) => (<li key={item.id} className="flex gap-3">
            {isInclusion ? (<CheckCircleIcon fontSize="small" sx={{ mt: "2px", color: "#059669" }}/>) : (<CancelIcon fontSize="small" sx={{ mt: "2px", color: "#dc2626" }}/>)}

            <div>
              <p className="font-bold text-slate-900">{item.title}</p>

              {item.description ? (<p className="mt-1 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>) : null}
            </div>
          </li>))}
      </ul>
    </Card>);
}
function PackageDetailSections({ sections }) {
    const summaryItems = sections.filter((section) => section.sectionType === "summary");
    const inclusionItems = sections.filter((section) => section.sectionType === "inclusion");
    const exclusionItems = sections.filter((section) => section.sectionType === "exclusion");
    const standardContentGroups = standardSectionOrder
        .map((sectionType) => ({
        sectionType,
        ...standardSectionContent[sectionType],
        items: sections.filter((section) => section.sectionType === sectionType),
    }))
        .filter((group) => group.items.length > 0);
    if (summaryItems.length === 0 &&
        standardContentGroups.length === 0 &&
        inclusionItems.length === 0 &&
        exclusionItems.length === 0) {
        return null;
    }
    return (<section className="space-y-10">
      {summaryItems.length > 0 ? (<div className="space-y-5">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
              At a Glance
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Summarized View
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {summaryItems.map((section) => (<Card key={section.id} className="border border-slate-100 shadow-sm" sx={{ borderRadius: 4, p: 3 }}>
                <Chip icon={<RouteIcon />} label={section.title} color="primary" variant="outlined" sx={{ borderRadius: 3, fontWeight: 800 }}/>

                {section.description ? (<p className="mt-4 text-sm leading-7 text-slate-600">
                    {section.description}
                  </p>) : null}
              </Card>))}
          </div>
        </div>) : null}

      {standardContentGroups.map((group) => (<div key={group.sectionType} className="space-y-5">
          <div className="flex items-center gap-3">
            {group.icon}

            <div>
              <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                {group.eyebrow}
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {group.title}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {group.items.map((section) => (<DetailItem key={section.id} section={section}/>))}
          </div>
        </div>))}

      {inclusionItems.length > 0 || exclusionItems.length > 0 ? (<div className="space-y-5">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
              Package information
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Inclusions &amp; Exclusions
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {inclusionItems.length > 0 ? (<InclusionExclusionList title="Inclusions" items={inclusionItems} type="inclusion"/>) : null}

            {exclusionItems.length > 0 ? (<InclusionExclusionList title="Exclusions" items={exclusionItems} type="exclusion"/>) : null}
          </div>
        </div>) : null}
    </section>);
}
export default PackageDetailSections;
