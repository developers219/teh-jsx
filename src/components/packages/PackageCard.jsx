import { useState } from "react";
import { Link } from "react-router-dom";
function PackageCard({ travelPackage }) {
    const [currentImage, setCurrentImage] = useState(0);
    /*
     * Keep your existing package image as the main image.
     * If your API later provides multiple images, you can add them here.
     */
    const images = [
        travelPackage.image?.url ??
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85",
    ];
    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };
    const previousImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };
    return (<article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      {/* ================= IMAGE ================= */}
      <div className="relative h-[200px] overflow-hidden">
        <img src={images[currentImage]} alt={travelPackage.image?.altText ?? `${travelPackage.title} travel package`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"/>

        {/* Dark subtle gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent"/>

        {/* LEFT CAROUSEL BUTTON */}
        <button type="button" onClick={previousImage} className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition hover:bg-white/35" aria-label="Previous image">
          <span className="text-2xl leading-none">‹</span>
        </button>

        {/* RIGHT CAROUSEL BUTTON */}
        <button type="button" onClick={nextImage} className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition hover:bg-white/35" aria-label="Next image">
          <span className="text-2xl leading-none">›</span>
        </button>

        {/* IMAGE DOTS */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, index) => (<button key={index} type="button" onClick={() => setCurrentImage(index)} className={`h-1.5 rounded-full transition-all ${index === currentImage
                ? "w-5 bg-white"
                : "w-1.5 bg-white/70"}`} aria-label={`Go to image ${index + 1}`}/>))}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5">

        {/* BADGES - LEFT / RIGHT */}
        <div className="flex items-center justify-between gap-3">

          {/* RATING */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-500">
            <span className="text-base">★</span>
            <span>{travelPackage.rating?.toFixed(1) ?? "4.8"} Rated</span>
          </div>

          {/* DURATION */}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>

            {travelPackage.durationDays}N / {travelPackage.durationNights}D
          </div>
        </div>

        {/* PACKAGE NAME */}
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
          {travelPackage.title}
        </h3>

        {/* LOCATION */}
        <div className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/>
            <circle cx="12" cy="10" r="2.5"/>
          </svg>

          {/*
         * If your destination field has a different name,
         * we can change this one line.
         */}
          {travelPackage.destination?.name ??
            travelPackage.destination ??
            "Beautiful Destination"}
        </div>

        {/* SMALL DIVIDER */}
        <div className="mt-4 h-px w-8 bg-blue-500"/>

        {/* DESCRIPTION */}
        <p className="mt-3 line-clamp-2 min-h-[42px] text-sm leading-6 text-slate-500">
          {travelPackage.description ??
            "Experience unforgettable destinations, beautiful places and memorable experiences."}
        </p>

        {/* ================= PRICE + CTA ================= */}
        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">

          {/* PRICE */}
          <div>
            <p className="text-xs font-medium text-slate-500">
              Starting from
            </p>

            <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">
              ₹
              {travelPackage.price?.toLocaleString?.("en-IN") ??
            "36,999"}
            </p>

            <p className="text-xs text-slate-400">
              per person
            </p>
          </div>

          {/* CTA */}
          <Link to={`/packages/${travelPackage.slug ?? travelPackage.id}`} className="inline-flex items-center gap-5 rounded-xl bg-blue-400 px-6 py-3.5 text-sm font-semibold !text-white shadow-md shadow-blue-600/20 transition-all duration-300 hover:bg-blue-500 hover:shadow-lg">
            Book Now
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </article>);
}
export default PackageCard;
