import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutGrid,
  Umbrella,
  Mountain,
  Compass,
  Heart,
  Users,
  Gem,
  Landmark,
  PawPrint,
  Sparkles,
  Building2,
  Trees,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import SectionHeader from "../home/SectionHeader";
import DestinationCard from "../ui/DestinationCard";
import {
  getDestinationsByTheme,
  getThemes,
} from "../../services/destination.service";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: "all", label: "All", Icon: LayoutGrid },
  { id: "beach", label: "Beach", Icon: Umbrella },
  { id: "mountains", label: "Mountains", Icon: Mountain },
  { id: "adventure", label: "Adventure", Icon: Compass },
  { id: "honeymoon", label: "Honeymoon", Icon: Heart },
  { id: "family", label: "Family", Icon: Users },
  { id: "luxury", label: "Luxury", Icon: Gem },
  { id: "culture", label: "Culture", Icon: Landmark },
  { id: "wildlife", label: "Wildlife", Icon: PawPrint },
  { id: "spiritual", label: "Spiritual", Icon: Sparkles },
  { id: "city", label: "City", Icon: Building2 },
  { id: "nature", label: "Nature", Icon: Trees },
];

const DESTINATIONS = {
  all: [
    "Maldives",
    "Kashmir",
    "Santorini",
    "Dubai",
    "Kyoto",
    "Serengeti",
    "Bali",
    "Switzerland",
  ],
  beach: [
    "Maldives",
    "Santorini",
    "Phuket",
    "Bali",
    "Goa",
    "Mauritius",
    "Seychelles",
    "Zanzibar",
  ],
  mountains: [
    "Kashmir",
    "Switzerland",
    "Manali",
    "Ladakh",
    "Himachal Pradesh",
    "Nepal",
    "Norway",
    "New Zealand",
  ],
  adventure: [
    "Dubai",
    "Queenstown",
    "Rishikesh",
    "Bali",
    "Costa Rica",
    "Interlaken",
  ],
  honeymoon: [
    "Maldives",
    "Bali",
    "Santorini",
    "Paris",
    "Mauritius",
    "Switzerland",
  ],
  family: ["Dubai", "Singapore", "Thailand", "London", "Kashmir", "Kerala"],
  luxury: ["Dubai", "Maldives", "Monaco", "Santorini", "Paris", "Seychelles"],
  culture: ["Kyoto", "Rome", "Varanasi", "Istanbul", "Cairo", "Jaipur"],
  wildlife: [
    "Serengeti",
    "Ranthambore",
    "Kruger",
    "Amazon",
    "Galápagos",
    "Borneo",
  ],
  spiritual: [
    "Varanasi",
    "Rishikesh",
    "Bodh Gaya",
    "Tibet",
    "Sedona",
    "Amritsar",
  ],
  city: ["New York", "Tokyo", "Singapore", "London", "Dubai", "Barcelona"],
  nature: ["Amazon", "Iceland", "Banff", "Patagonia", "Norway", "New Zealand"],
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const imageFor = (name) =>
  `https://picsum.photos/seed/${slugify(name)}/640/800`;

const CARD_WIDTH = 240;
const CARD_GAP = 20;

// ---------------------------------------------------------------------------
// Small reusable bits
// ---------------------------------------------------------------------------

function NavButton({
  direction = "left",
  onClick,
  disabled,
  size = "md",
  className = "",
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const dims = size === "sm" ? "w-9 h-9" : "w-10 h-10";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className={[
        dims,
        "shrink-0 flex items-center justify-center rounded-full bg-white border border-[#E3E1DC]",
        "transition-all duration-200 ease-out",
        disabled
          ? "opacity-35 cursor-default"
          : "hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_8px_20px_rgba(20,20,20,0.10)]",
        className,
      ].join(" ")}
    >
      <Icon className="w-4 h-4 text-[#141414]" strokeWidth={1.75} />
    </button>
  );
}

function CategoryChip({ label, Icon = null, active, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "relative shrink-0 inline-flex items-center gap-1.5 pl-3.5 pr-4 py-2.5 rounded-full",
        "text-[13.5px] font-medium whitespace-nowrap border transition-colors duration-200",
        active
          ? "bg-[#141414] text-white border-[#141414]"
          : "bg-white text-[#141414] border-[#E3E1DC] hover:border-[#141414]/40",
      ].join(" ")}
    >
      {Icon && (
        <Icon
          className={`w-3.5 h-3.5 ${active ? "" : "opacity-70"}`}
          strokeWidth={1.75}
        />
      )}
      <span>{label}</span>
    </button>
  );
}

// function DestinationCard({ name }) {
//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 20, scale: 0.98 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: 10, scale: 0.98 }}
//       transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//       whileHover="hover"
//       className="group shrink-0 w-[220px] sm:w-[240px] cursor-grab active:cursor-grabbing"
//     >
//       <motion.div
//         variants={{ hover: { y: -5 } }}
//         transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
//       >
//         <div className="relative overflow-hidden rounded-[22px] aspect-[4/5] bg-[#E3E1DC] shadow-[0_1px_2px_rgba(20,20,20,0.06)] transition-shadow duration-300 group-hover:shadow-[0_18px_34px_rgba(20,20,20,0.18)]">
//           <motion.img
//             src={imageFor(name)}
//             alt={name}
//             loading="lazy"
//             variants={{ hover: { scale: 1.05 } }}
//             transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
//         </div>
//         <motion.p
//           variants={{ hover: { x: 3 } }}
//           transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
//           className="mt-3 text-[15px] font-medium text-[#141414]"
//         >
//           {name}
//         </motion.p>
//       </motion.div>
//     </motion.div>
//   );
// }

// ---------------------------------------------------------------------------
// Draggable / scrollable track hook
// ---------------------------------------------------------------------------

function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    const onDown = (e) => {
      isDown = true;
      startX = e.pageX;
      scrollStart = el.scrollLeft;
    };
    const onUp = () => (isDown = false);
    const onMove = (e) => {
      if (!isDown) return;
      el.scrollLeft = scrollStart - (e.pageX - startX);
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [ref]);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Themes() {
  const [activeCategory, setActiveCategory] = useState(1);
  const [chipNav, setChipNav] = useState({ atStart: true, atEnd: false });
  const [cardNav, setCardNav] = useState({ atStart: true, atEnd: false });
  const [categories, setCategories] = useState(null);
  const [destinations, setDestinations] = useState(null);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(1);

  const chipTrackRef = useRef(null);
  const cardTrackRef = useRef(null);

  useDragScroll(chipTrackRef);
  useDragScroll(cardTrackRef);

  //   const destinations = DESTINATIONS[activeCategory] || [];

  // -- nav state helpers -----------------------------------------------

  const updateChipNav = useCallback(() => {
    const el = chipTrackRef.current;
    if (!el) return;
    setChipNav({
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft >= el.scrollWidth - el.clientWidth - 4,
    });
  }, []);

  const updateCardNav = useCallback(() => {
    const el = cardTrackRef.current;
    if (!el) return;
    const step = CARD_WIDTH + CARD_GAP;
    const visible = Math.max(1, Math.round(el.clientWidth / step));
    setPerPage(visible);
    setPage(Math.round(el.scrollLeft / (visible * step)));
    setCardNav({
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft >= el.scrollWidth - el.clientWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateChipNav();
    updateCardNav();
    const onResize = () => {
      updateChipNav();
      updateCardNav();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateChipNav, updateCardNav]);

  useEffect(() => {
    // reset destination scroll position whenever the category changes
    async function fetchThemes() {
      const res = await getThemes();
      setCategories(res.data);
      const res2 = await getDestinationsByTheme(1, 4);
      setDestinations(res2);
    }
    fetchThemes();
    const el = cardTrackRef.current;
    if (el) el.scrollTo({ left: 0 });
    updateCardNav();
  }, []);

  // -- scroll actions -----------------------------------------------

  const scrollChips = (dir) => {
    chipTrackRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };
  const scrollCards = (dir) => {
    cardTrackRef.current?.scrollBy({
      left: dir * (CARD_WIDTH + CARD_GAP) * 2,
      behavior: "smooth",
    });
  };
  const onCardsKeyDown = (e) => {
    if (e.key === "ArrowRight") scrollCards(1);
    if (e.key === "ArrowLeft") scrollCards(-1);
  };

  const handleCategoryClick = async (id) => {
    console.log(id);
    setActiveCategory(id);
    const res = await getDestinationsByTheme(1, id);
    console.log(res);
    setDestinations(res);
  };

  const pageCount = Math.max(1, Math.ceil(destinations?.length / perPage));

  return (
    <section className="bg-white px-6 sm:px-10 lg:px-16 font-sans text-[#141414]">
      <div className="max-w-[1440px] mx-auto">
        <SectionHeader
          title={"Explore destinations that inspire"}
          description={
            "From serene beaches to majestic mountains, find places that match your vibe."
          }
        />

        {/* Category carousel */}
        <div className="mt-7 lg:mt-8 flex items-center gap-3">
          <NavButton
            direction="left"
            onClick={() => scrollChips(-1)}
            disabled={chipNav.atStart}
            className="hidden sm:flex"
          />

          <div className="relative flex-1 overflow-hidden">
            <div
              ref={chipTrackRef}
              onScroll={updateChipNav}
              role="tablist"
              aria-label="Destination categories"
              className="flex gap-2.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories?.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  label={cat.name}
                  // Icon={cat.Icon}
                  active={cat.id === activeCategory}
                  onClick={() => handleCategoryClick(cat.id)}
                />
              ))}
            </div>
          </div>

          <NavButton
            direction="right"
            onClick={() => scrollChips(1)}
            disabled={chipNav.atEnd}
            className="hidden sm:flex"
          />
        </div>

        {/* Destinations header */}
        <div className="mt-8 lg:mt-10 flex items-end justify-between border-b border-[#E3E1DC] pb-5">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8A877F]">
            {/* Top Destinations */}
          </span>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#141414] hover:text-[#8A877F] transition-colors"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </a>
            <div className="flex items-center gap-2">
              <NavButton
                direction="left"
                size="sm"
                onClick={() => scrollCards(-1)}
                disabled={cardNav.atStart}
              />
              <NavButton
                direction="right"
                size="sm"
                onClick={() => scrollCards(1)}
                disabled={cardNav.atEnd}
              />
            </div>
          </div>
        </div>

        {/* Destination carousel */}
        <div className="mt-8 -mx-6 sm:-mx-10 lg:-mx-16 px-6 sm:px-10 lg:px-16">
          <div
            ref={cardTrackRef}
            onScroll={updateCardNav}
            onKeyDown={onCardsKeyDown}
            tabIndex={0}
            aria-label="Destination cards, use arrow keys to navigate"
            className="flex gap-5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {destinations?.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
