/**
 * Section heading used across the website (same as teh-vite "Explore by people"):
 *  - heading   : EB Garamond  (font-eb)
 *  - highlight : Alex Brush   (font-alex), blue, italic
 *  - subheading: Inter        (font-inter), gray
 *
 * className replaces the default bottom spacing (mb-8 sm:mb-10) when given.
 * compact (optional, default false): smaller title / text and less bottom space
 * on phones (sm and up it looks exactly the same as the normal heading).
 */
export const Heading = ({
  heading,
  highlight,
  subheading,
  className,
  compact = false,
}) => {
  const spacing = className ?? (compact ? "mb-4 sm:mb-10" : "mb-8 sm:mb-10");
  const titleSize = compact
    ? "text-[clamp(1.5rem,5vw,2.5rem)]"
    : "text-[clamp(1.8rem,5vw,2.5rem)]";
  const textSize = compact ? "text-sm sm:text-lg" : "text-base sm:text-lg";

  return (
    <div className={`flex flex-col gap-1 ${spacing}`}>
      <h2 className={`font-eb ${titleSize} capitalize`}>
        {heading}{" "}
        <span className="font-alex italic text-blue-400">{highlight}</span>
      </h2>

      {subheading && (
        <p className={`font-inter ${textSize} text-gray-600`}>
          {subheading}
        </p>
      )}
    </div>
  );
};

export default Heading;