/**
 * Section heading used across the website (same as teh-vite "Explore by people"):
 *  - heading   : EB Garamond  (font-eb)
 *  - highlight : Alex Brush   (font-alex), blue, italic
 *  - subheading: Inter        (font-inter), gray
 *
 * className replaces the default bottom spacing (mb-8 sm:mb-10) when given.
 */
export const Heading = ({
  heading,
  highlight,
  subheading,
  className = "mb-8 sm:mb-10",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h2 className="font-eb text-[clamp(1.8rem,5vw,2.5rem)] capitalize">
        {heading}{" "}
        <span className="font-alex italic text-blue-400">{highlight}</span>
      </h2>

      {subheading && (
        <p className="font-inter text-base text-gray-600 sm:text-lg">
          {subheading}
        </p>
      )}
    </div>
  );
};

export default Heading;