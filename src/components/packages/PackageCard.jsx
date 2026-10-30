import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import Carousel from "../ui/Carousel";

// Only used when a package has NO photo at all (keeps the card layout intact)
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85";

/* ---------------------------------------------------------------
   Backend -> card data
   Everything shown on the card comes from the package object.
   If a value is missing the card hides that part (no fake values).

   Supported backend shapes:
   - images       : [{ imageUrl }] | [{ url }] | ["https://..."]
   - destination  : destinations: [{ name }]  |  destination: { name } | "Goa"
   - description  : shortDescription | overview | description
   - price        : startingPrice | price   (+ discountPrice)
   - duration     : durationName | durationDaysCount | durationDays
   - link         : slug | id
---------------------------------------------------------------- */

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatPrice(value) {
  return toNumber(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function getImageUrl(image) {
  if (typeof image === "string") return image;
  return image?.imageUrl || image?.url || image?.src || image?.path || "";
}

function getName(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.name || item.title || item.destinationName || "";
}

// "Goa"  |  "Goa, Pune"  |  "Goa, Pune +1"
function getDestinationName(travelPackage) {
  const list = Array.isArray(travelPackage?.destinations)
    ? travelPackage.destinations
    : [];
  const names = list.map(getName).filter(Boolean);

  if (names.length > 0) {
    return names.length > 2
      ? `${names.slice(0, 2).join(", ")} +${names.length - 2}`
      : names.join(", ");
  }

  return (
    getName(travelPackage?.destination) || travelPackage?.destinationName || ""
  );
}

function getDuration(travelPackage) {
  if (travelPackage?.durationName) return travelPackage.durationName;

  const days = toNumber(
    travelPackage?.durationDaysCount ?? travelPackage?.durationDays,
  );

  return days > 0 ? `${days} ${days === 1 ? "Day" : "Days"}` : "";
}

// discountPrice is used only when it is really lower than the normal price
//   offer     -> price = discountPrice, oldPrice = startingPrice
//   no offer  -> price = startingPrice, oldPrice = ""
function getPricing(travelPackage) {
  const starting = toNumber(travelPackage?.startingPrice ?? travelPackage?.price);
  const discount = toNumber(travelPackage?.discountPrice);

  const hasDiscount = discount > 0 && starting > 0 && discount < starting;
  const final = hasDiscount ? discount : starting;

  return {
    price: final > 0 ? formatPrice(final) : "",
    oldPrice: hasDiscount ? formatPrice(starting) : "",
  };
}

function buildCardData(travelPackage) {
  const images = (
    Array.isArray(travelPackage?.images) ? travelPackage.images : []
  )
    .map(getImageUrl)
    .filter(Boolean);

  if (images.length === 0) images.push(FALLBACK_IMAGE);

  return {
    images,
    title: travelPackage?.title ?? "",
    destinationName: getDestinationName(travelPackage),
    durationName: getDuration(travelPackage),
    description:
      travelPackage?.shortDescription ||
      travelPackage?.overview ||
      travelPackage?.description ||
      "",
    ...getPricing(travelPackage),
    href: `/packages/${travelPackage?.slug ?? travelPackage?.id}`,
  };
}

/* ---------------------------------------------------------------
   Small shared pieces
---------------------------------------------------------------- */

// Click anywhere on the card -> open that package's details page.
// Arrows, buttons and links keep their own behaviour.
// Ctrl / Cmd + click opens the package in a new tab.
function useCardClick(href) {
  const navigate = useNavigate();

  return (event) => {
    if (event.defaultPrevented) return;
    if (event.target.closest("a, button")) return;

    if (event.metaKey || event.ctrlKey) {
      window.open(href, "_blank", "noopener");
      return;
    }

    navigate(href);
  };
}

// Photo slider powered by your ui/Carousel (spring slide + swipe).
// Arrows: the Carousel's own arrows ("overlay" variant) -> left and right,
// vertically centred. Hover on desktop, always visible on touch screens.
function ImageSlider({
  ctx,
  className = "",
  gradient = "from-black/25",
  dotsPosition = "bottom",
}) {
  const { images, title } = ctx;
  const [current, setCurrent] = useState(0);
  const hasMany = images.length > 1;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Carousel
        items={images}
        gap={0}
        desktopItems={1}
        tabletItems={1}
        mobileItems={1}
        arrowsVariant="overlay"
        fillHeight
        onIndexChange={setCurrent}
        renderItem={(src) => (
          <div className="h-full w-full overflow-hidden">
            <img
              src={src}
              alt={`${title} travel package`}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
      />

      {/* readability gradient */}
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-t ${gradient} to-transparent`}
      />

      {/* dots (only show which photo is active) */}
      {hasMany && (
        <div
          className={`pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 gap-1.5 ${
            dotsPosition === "top" ? "top-4" : "bottom-3"
          }`}
        >
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === current ? "w-5 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Location({ ctx, className = "", size = 16 }) {
  if (!ctx.destinationName) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <MapPin size={size} className="shrink-0" />
      <span className="truncate">{ctx.destinationName}</span>
    </div>
  );
}

/* ===============================================================
   PACKAGE CARD (overlay design: photo is the card)
   - price badge top-right (dynamic: offer / no offer)
   - location + duration, title, overview on the photo
   - no button: clicking anywhere on the card opens the package
=============================================================== */
function PackageCard({ travelPackage }) {
  const ctx = buildCardData(travelPackage);
  const handleCardClick = useCardClick(ctx.href);

  return (
    <article
      onClick={handleCardClick}
      className="group relative h-[470px] cursor-pointer overflow-hidden rounded-3xl bg-slate-950 font-inter shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <ImageSlider
        ctx={ctx}
        className="absolute inset-0 h-full"
        gradient="from-black/90 via-black/30"
        dotsPosition="bottom"
      />

      {/* Top-right price badge
          offer on package -> ~~original~~ discounted Onwards
          no offer         -> original Onwards */}
      {ctx.price && (
        <div className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white bg-yellow-400 px-4 py-2 text-black shadow-lg">
          {ctx.oldPrice && (
            <span className="relative text-xs font-medium text-black/70 after:absolute after:-inset-x-0.5 after:top-1/2 after:h-[1.5px] after:-rotate-6 after:bg-red-600 after:content-['']">
              ₹{ctx.oldPrice}
            </span>
          )}

          <span className="text-base font-bold tracking-tight">
            ₹{ctx.price}
          </span>

          <span className="text-sm font-medium">Onwards</span>
        </div>
      )}

      {/* Bottom content */}
      {/* Bottom content */}
<div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
  {/* Location and duration side by side, without badge backgrounds */}
  <div className="mb-4 flex items-center gap-3">
    <Location ctx={ctx} className="text-sm font-medium text-white/80" />

    {ctx.durationName && (
      <div className="flex items-center gap-1.5 text-sm font-medium text-white/80">
        <Calendar size={15} className="shrink-0" />
        <span>{ctx.durationName}</span>
      </div>
    )}
  </div>

  {/* Package title (real link: keyboard, right-click, new tab) */}
  <h3 className="mt-2 font-eb text-2xl font-bold leading-tight tracking-tight">
    <Link to={ctx.href}>{ctx.title}</Link>
  </h3>

  {/* Package overview: 2 lines normally, full text on hover.
      The box grows upward smoothly, so location / duration / title slide up. */}
  {ctx.description && (
    <div className="mt-2 max-h-12 overflow-hidden transition-[max-height] duration-500 ease-in-out group-hover:max-h-72 group-hover:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <p className="line-clamp-2 text-sm leading-6 text-white/80 group-hover:line-clamp-none">
        {ctx.description}
      </p>
    </div>
  )}
</div>
    </article>
  );
}

export default PackageCard;