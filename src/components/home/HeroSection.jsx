import { useEffect, useState } from "react";
import CallIcon from "@mui/icons-material/Call";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { getActiveHeroBanner } from "../../services/hero-banner.service";
import SearchWidget from "./SearchWidget";
const fallbackHeroBanner = {
    id: 0,
    eyebrow: "Travel Empire Holidays",
    headline: "Plan your perfect holiday with trusted travel experts.",
    subheadline: "Discover domestic and international packages, compare trending destinations, and get a free itinerary built around your budget, dates, and travel style.",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=90",
    mediaAltText: "Beautiful holiday destination",
    callLabel: "Call Now",
    callPhone: "+919999999999",
    whatsappLabel: "WhatsApp",
    whatsappNumber: "919999999999",
    itineraryLabel: "Get Free Itinerary",
    itineraryUrl: "#holiday-plan",
    stats: [
        { label: "Curated trips", value: "250+" },
        { label: "Happy travelers", value: "18k+" },
        { label: "Countries covered", value: "42" },
    ],
    status: "active",
    sortOrder: 0,
    createdAt: "",
    updatedAt: "",
};
function HeroSection() {
    const [heroBanner, setHeroBanner] = useState(fallbackHeroBanner);
    useEffect(() => {
        async function loadHeroBanner() {
            try {
                const activeHeroBanner = await getActiveHeroBanner();
                if (activeHeroBanner) {
                    setHeroBanner(activeHeroBanner);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        loadHeroBanner();
    }, []);
    return (<section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        {heroBanner.mediaType === "video" ? (<iframe className="h-full w-full" src={heroBanner.mediaUrl} title={heroBanner.mediaAltText || "Hero background video"} frameBorder="0" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/>) : (<img src={heroBanner.mediaUrl} alt={heroBanner.mediaAltText || "Holiday destination"} className="h-full w-full object-cover"/>)}
        {/* Black Transparent Layer */}
        <div className="absolute inset-0 bg-slate-950/70"/>
      </div>

      <div className="relative mx-auto flex min-h-[42rem] max-w-7xl flex-col justify-center px-6 py-24 lg:min-h-[calc(100vh-4rem)] lg:px-8">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-cyan-200/30 bg-slate-950/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur-sm">
            {heroBanner.eyebrow}
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {heroBanner.headline}
          </h1>

          {heroBanner.subheadline ? (<p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              {heroBanner.subheadline}
            </p>) : null}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={heroBanner.itineraryUrl} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950">
              <TravelExploreIcon fontSize="small"/>
              {heroBanner.itineraryLabel}
            </a>

            <a href={`tel:${heroBanner.callPhone}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-black text-white transition duration-200 hover:border-white/50 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-slate-950">
              <CallIcon fontSize="small"/>
              {heroBanner.callLabel}
            </a>

            <a href={`https://wa.me/${heroBanner.whatsappNumber}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-500/90 px-5 py-3.5 text-sm font-black text-white transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-slate-950">
              <WhatsAppIcon fontSize="small"/>
              {heroBanner.whatsappLabel}
            </a>
          </div>

          {heroBanner.stats.length > 0 ? (<dl className="mt-10 grid max-w-2xl grid-cols-1 gap-3 rounded-2xl border border-white/15 bg-slate-950/25 p-4 backdrop-blur-sm sm:grid-cols-3 sm:gap-0 sm:p-5">
              {heroBanner.stats.map((stat, index) => (<div key={`${stat.label}-${stat.value}`} className={index > 0
                    ? "border-white/10 pt-3 sm:border-l sm:pl-5 sm:pt-0"
                    : ""}>
                  <dd className="text-2xl font-black text-white">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-xs font-semibold leading-5 text-slate-300">
                    {stat.label}
                  </dt>
                </div>))}
            </dl>) : null}
        </div>

        <div className="mt-12 max-w-6xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
            Find a trip that fits your travel style
          </p>
          <SearchWidget />
        </div>
      </div>
    </section>);
}
export default HeroSection;
