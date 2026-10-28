import { Link } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=90";

function getDestinationName(destination) {
  return (
    destination?.name ||
    destination?.title ||
    destination?.destinationName ||
    destination?.city ||
    "Destination"
  );
}

function getDestinationImage(destination) {
  return (
    destination?.images?.[0]?.imageUrl ||
    destination?.imageUrl ||
    destination?.image ||
    destination?.src ||
    destination?.path ||
    destination?.thumbnail ||
    destination?.bannerImage ||
    DEFAULT_IMAGE
  );
}

/**
 * The one destination card used across the whole website
 * (same design as the Home page "Domestic / International" cards).
 *
 * category: "dom" | "intl". When it is not passed, it is read from
 * destination.categoryName.
 */
function DestinationCard({ destination, category }) {
  const name = getDestinationName(destination);

  const type =
    category ?? (destination?.categoryName === "International" ? "intl" : "dom");

  // Items without a slug (fallback data) open the category page
  const path = destination?.slug
    ? `/destinations/${type}/${destination.slug}`
    : `/destinations/${type}`;

  return (
    <Link
      to={path}
      className="group relative flex h-[40vh] min-h-[240px] w-full cursor-pointer items-end overflow-hidden rounded-2xl shadow-sm"
    >
      <img
        src={getDestinationImage(destination)}
        alt={name}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-115"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/30 to-transparent" />

      <div className="relative flex min-h-[15%] w-full items-center justify-center bg-linear-to-t from-black/30 to-transparent px-2 py-2 text-center text-lg font-inter font-semibold leading-tight text-white backdrop-blur-xs sm:text-xl">
        {name}
      </div>
    </Link>
  );
}

export default DestinationCard;