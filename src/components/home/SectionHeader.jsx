import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
function SectionHeader({ eyebrow, title, description, align = "center", dark = false, }) {
    const alignmentClass = align === "center" ? "mx-auto text-center" : "text-left";
    return (<div className={`max-w-3xl ${alignmentClass}`}>
      {eyebrow ? (<Chip label={eyebrow} size="small" sx={{
                mb: 2,
                bgcolor: dark ? "rgba(34,211,238,0.14)" : "#ecfeff",
                color: dark ? "#67e8f9" : "#0e7490",
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
            }}/>) : null}

      <Typography variant="h2" className={dark
            ? "text-3xl font-black text-white sm:text-4xl"
            : "text-3xl font-black text-slate-950 sm:text-4xl"} sx={{ lineHeight: 1.12 }}>
        {title}
      </Typography>

      {description ? (<Typography className={dark
                ? "mt-4 text-base leading-7 text-slate-300 sm:text-lg"
                : "mt-4 text-base leading-7 text-slate-600 sm:text-lg"}>
          {description}
        </Typography>) : null}
    </div>);
}
export default SectionHeader;
