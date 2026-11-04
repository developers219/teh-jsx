import { useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import Carousel from "../ui/Carousel";
import LeadCapturePopup from "../forms/LeadCapturePopup";

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

// Overview text, always exactly 2 lines.
// When it is longer, the second line ends with "… view more" (a link to the
// package page). The cut point is measured, so it adapts to every card width.
const MORE_LABEL = "… view more";

function TwoLineText({ text, href, className = "" }) {
  const boxRef = useRef(null);
  const probeRef = useRef(null);

  const cleanText = String(text ?? "").replace(/\s+/g, " ").trim();
  const [shown, setShown] = useState(cleanText);
  const [isCut, setIsCut] = useState(false);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const probe = probeRef.current;

    if (!box || !probe) return undefined;

    const fit = () => {
      probe.style.width = `${Math.max(box.clientWidth - 2, 0)}px`;

      const lineHeight = parseFloat(getComputedStyle(probe).lineHeight) || 24;
      const maxHeight = lineHeight * 2 + 2;

      const fits = (value) => {
        probe.textContent = value;
        return probe.offsetHeight <= maxHeight;
      };

      // fits in two lines -> show everything, no "view more"
      if (fits(cleanText)) {
        setShown(cleanText);
        setIsCut(false);
        return;
      }

      // longest start of the text that still leaves room for "… view more"
      let low = 0;
      let high = cleanText.length;

      while (low < high) {
        const mid = Math.ceil((low + high) / 2);

        if (fits(cleanText.slice(0, mid).trimEnd() + MORE_LABEL)) low = mid;
        else high = mid - 1;
      }

      // do not cut in the middle of a word, no dangling punctuation
      let cut = cleanText.slice(0, low);
      const lastSpace = cut.lastIndexOf(" ");

      if (lastSpace > 0 && low < cleanText.length) cut = cut.slice(0, lastSpace);

      setShown(cut.replace(/[\s.,;:!?-]+$/, ""));
      setIsCut(true);
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(box);
    document.fonts?.ready.then(fit);

    return () => observer.disconnect();
  }, [cleanText]);

  const textClass = "text-sm leading-6 text-white/80";

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      {/* hidden copy, only used to measure how much text fits */}
      <p
        ref={probeRef}
        aria-hidden="true"
        className={`${textClass} pointer-events-none invisible absolute left-0 top-0`}
      />

      <p className={`${textClass} line-clamp-2`}>
        {shown}
        {isCut && (
          <>
            …{" "}
            <Link
              to={href}
              className="text-blue-300 underline-offset-2 hover:text-blue-200 hover:underline"
            >
              view more
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

/* ===============================================================
   PACKAGE CARD (overlay design: photo is the card)
   - price badge top-right (dynamic: offer / no offer)
   - location + duration, title, overview on the photo
   - overview: 2 lines, "… view more" at the end of line 2
   - two buttons: Enquire now (enquiry popup) + View details
   - clicking elsewhere on the card still opens the package
=============================================================== */
function PackageCard({ travelPackage }) {
  const ctx = buildCardData(travelPackage);
  const handleCardClick = useCardClick(ctx.href);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <article
      onClick={handleCardClick}
      className="group relative h-[470px] cursor-pointer overflow-hidden rounded-3xl bg-slate-950 font-inter shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <ImageSlider
        ctx={ctx}
        className="absolute inset-0 h-full"
        gradient="from-black/90 via-black/30"
        dotsPosition="top"
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

          {/* <span className="text-sm font-medium">Onwards</span> */}
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

  {/* Package overview: always 2 lines, "… view more" at the end of line 2 */}
  {ctx.description && (
    <TwoLineText text={ctx.description} href={ctx.href} className="mt-2" />
  )}

  {/* Buttons */}
  <div className="mt-4 flex gap-2">
    <button
      type="button"
      onClick={() => setIsEnquiryOpen(true)}
      className="flex-1 cursor-pointer whitespace-nowrap rounded-full bg-blue-400 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-500"
    >
      Enquire now
    </button>

    <Link
      to={ctx.href}
      className="flex-1 whitespace-nowrap rounded-full border border-white/70 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-slate-900"
    >
      View details
    </Link>
  </div>
</div>

      {/* Same enquiry popup as the floating "Submit an enquiry".
          It renders in document.body; the wrapper stops its clicks from
          reaching the card (which would open the package page). */}
      {isEnquiryOpen && (
        <div className="hidden" onClick={(event) => event.stopPropagation()}>
          <LeadCapturePopup
            isOpen={isEnquiryOpen}
            setIsOpen={setIsEnquiryOpen}
          />
        </div>
      )}
    </article>
  );
}

export default PackageCard;