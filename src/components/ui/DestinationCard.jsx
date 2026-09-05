import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
function DestinationCard({ destination }) {
  const imageUrl =
    destination.imageUrl ??
    destination.image ??
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=90";
  /*
   * Smaller font automatically for longer destination names.
   * This keeps names such as SWITZERLAND completely visible.
   */
  const destinationName = destination.name ?? "";
  const nameFontSize =
    destinationName.length >= 12
      ? "22px"
      : destinationName.length >= 10
      ? "24px"
      : "27px";
  return (
    <Card
      sx={{
        position: "relative",
        /* =========================================
               FIXED REFERENCE CARD SIZE
               ========================================= */
        width: "243px",
        height: "300px",
        minWidth: "243px",
        maxWidth: "243px",
        minHeight: "300px",
        maxHeight: "300px",
        flex: "0 0 243px",
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: "16px",
        backgroundColor: "#111",
        // boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
        cursor: "pointer",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        "&:hover": {
          transform: "translateY(-4px)",
        },
        "&:hover .destination-card-image": {
          transform: "scale(1.045)",
        },
      }}
    >
      {/* =========================================
            BACKGROUND IMAGE
            ========================================= */}

      <Box
        className="destination-card-image"
        component="img"
        src={imageUrl}
        alt={`${destination.name}, ${destination.tagline}`}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
      />

      {/* =========================================
            BOTTOM DARK GRADIENT
            ========================================= */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.25) 67%, rgba(0,0,0,0.72) 84%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* =========================================
            DESTINATION CONTENT
            ========================================= */}

      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
          px: "18px",
          pb: "20px",
          color: "#fff",
        }}
      >
        {/* =======================================
            TAGLINE
            ======================================= */}

        <Typography
          component="div"
          sx={{
            margin: 0,
            marginBottom: "5px",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "10px",
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing: "0.1px",
            textTransform: "uppercase",
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textShadow: "0 1px 5px rgba(0,0,0,0.7)",
          }}
        >
          {destination.tagline}
        </Typography>

        {/* =======================================
            DESTINATION NAME
            ======================================= */}

        <Typography
          component="h2"
          sx={{
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
            /*
             * Automatically adjusts for long names.
             */
            fontSize: nameFontSize,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "-0.2px",
            textTransform: "uppercase",
            color: "#fff",
            /*
             * IMPORTANT:
             * No ellipsis and no clipping.
             */
            whiteSpace: "nowrap",
            overflow: "visible",
            textOverflow: "clip",
            textShadow: "0 2px 8px rgba(0,0,0,0.65)",
          }}
        >
          {destinationName}
        </Typography>
      </Box>
    </Card>
  );
}
export default DestinationCard;
