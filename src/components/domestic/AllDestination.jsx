import React, { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import DestinationCard from "../ui/DestinationCard";
import SectionHeader from "../home/SectionHeader";
import api from "../../services/api";

// -----------------------------------------------------
// DUMMY DESTINATION DATA
// Replace this later with API data
// -----------------------------------------------------

const destinationImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245",
  "https://images.unsplash.com/photo-1512100356356-de1b84283e18",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0",
  "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
  "https://images.unsplash.com/photo-1548013146-72479768bada",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  "https://images.unsplash.com/photo-1528181304800-259b08848526",
  "https://images.unsplash.com/photo-1526392060635-9d6019884377",
];

// -----------------------------------------------------
// CREATE EXACTLY 60 DESTINATIONS
// -----------------------------------------------------

// const destinations = Array.from({ length: 60 }, (_, index) => {
//   const destination = baseDestinations[index];

//   return {
//     id: index + 1,
//     name: destination.name,
//     region: destination.region,
//     type: destination.type,

//     image: `${
//       destinationImages[index % destinationImages.length]
//     }?auto=format&fit=crop&w=900&q=85`,

//     featured: index % 4 === 0,
//     popular: index % 4 === 1,
//   };
// });

// -----------------------------------------------------
// DESTINATION CARD
// -----------------------------------------------------

// const DestinationCard = ({ destination }) => {
//   return (
//     <Card
//       sx={{
//         position: "relative",
//         height: {
//           xs: 245,
//           sm: 270,
//           md: 290,
//         },

//         borderRadius: "18px",
//         overflow: "hidden",

//         cursor: "pointer",

//         boxShadow: "0 8px 25px rgba(15, 23, 42, 0.08)",

//         transition:
//           "transform 0.35s ease, box-shadow 0.35s ease",

//         "&:hover": {
//           transform: "translateY(-6px)",
//           boxShadow:
//             "0 18px 40px rgba(15, 23, 42, 0.18)",

//           "& .destination-image": {
//             transform: "scale(1.07)",
//           },

//           "& .destination-arrow": {
//             transform: "translateX(3px)",
//           },
//         },
//       }}
//     >
//       {/* IMAGE */}

//       <CardMedia
//         component="img"
//         image={destination.image}
//         alt={destination.name}
//         className="destination-image"
//         sx={{
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",

//           transition: "transform 0.6s ease",
//         }}
//       />

//       {/* GRADIENT */}

//       <Box
//         sx={{
//           position: "absolute",
//           inset: 0,

//           background:
//             "linear-gradient(180deg, rgba(0,0,0,0.02) 35%, rgba(0,0,0,0.72) 100%)",
//         }}
//       />

//       {/* BADGE */}

//       {(destination.featured || destination.popular) && (
//         <Chip
//           icon={
//             destination.featured ? (
//               <StarRoundedIcon
//                 sx={{
//                   fontSize: "14px !important",
//                   color: "white !important",
//                 }}
//               />
//             ) : undefined
//           }
//           label={
//             destination.featured
//               ? "FEATURED"
//               : "POPULAR"
//           }
//           size="small"
//           sx={{
//             position: "absolute",
//             top: 14,
//             left: 14,

//             height: 27,

//             borderRadius: "8px",

//             backgroundColor: destination.featured
//               ? "rgba(16, 185, 129, 0.95)"
//               : "rgba(249, 115, 22, 0.95)",

//             color: "white",

//             fontSize: "10px",
//             fontWeight: 800,
//             letterSpacing: "0.5px",

//             "& .MuiChip-label": {
//               px: destination.featured ? 1 : 1.3,
//             },
//           }}
//         />
//       )}

//       {/* CONTENT */}

//       <Box
//         sx={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,

//           p: {
//             xs: 1.8,
//             sm: 2,
//           },
//         }}
//       >
//         <Typography
//           sx={{
//             color: "white",
//             fontSize: {
//               xs: "19px",
//               sm: "21px",
//             },
//             fontWeight: 800,
//             lineHeight: 1.1,

//             mb: 0.5,
//           }}
//         >
//           {destination.name}
//         </Typography>

//         <Stack
//           direction="row"
//           alignItems="center"
//           spacing={0.4}
//         >
//           <LocationOnOutlinedIcon
//             sx={{
//               fontSize: 15,
//               color: "rgba(255,255,255,0.9)",
//             }}
//           />

//           <Typography
//             sx={{
//               color: "rgba(255,255,255,0.9)",
//               fontSize: "12px",
//               fontWeight: 500,
//             }}
//           >
//             {destination.region}
//           </Typography>
//         </Stack>
//       </Box>

//       {/* ARROW */}

//       <Box
//         className="destination-arrow"
//         sx={{
//           position: "absolute",

//           right: 14,
//           bottom: 14,

//           width: 34,
//           height: 34,

//           borderRadius: "50%",

//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",

//           backgroundColor:
//             "rgba(255,255,255,0.18)",

//           border:
//             "1px solid rgba(255,255,255,0.55)",

//           backdropFilter: "blur(8px)",

//           color: "white",

//           fontSize: 18,

//           transition: "transform 0.3s ease",
//         }}
//       >
//         →
//       </Box>
//     </Card>
//   );
// };

// -----------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------

const AllDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  useEffect(() => {
    const fetchDestinations = async () => {
      const res = await api.get("/destinations/category/1");
      setDestinations(res.data.data);
    };
    fetchDestinations();
  }, []);
  const { visibleItems, loadMoreRef, hasMore } = useInfiniteScroll(
    destinations,
    12,
    12
  );

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        py: {
          xs: 6,
          sm: 8,
          md: 10,
        },

        backgroundColor: "#ffffff",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* -------------------------------------------
            HEADING
        ------------------------------------------- */}

        {/* <Box
          sx={{
            textAlign: "center",
            maxWidth: 760,
            mx: "auto",

            mb: {
              xs: 4,
              md: 5,
            },
          }}
        >
          <Typography
            sx={{
              color: "#3574c5",

              fontSize: {
                xs: "11px",
                sm: "12px",
              },

              fontWeight: 800,

              letterSpacing: "4px",

              textTransform: "uppercase",

              mb: 1,
            }}
          >
            Explore The World
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: "34px",
                sm: "44px",
                md: "54px",
              },

              lineHeight: 1.05,

              fontWeight: 800,

              letterSpacing: "-1.5px",

              color: "#102a43",

              mb: 1.5,
            }}
          >
            All Destinations
          </Typography>

          <Typography
            sx={{
              color: "#607d9b",

              fontSize: {
                xs: "14px",
                sm: "16px",
              },

              lineHeight: 1.7,

              px: {
                xs: 1,
                sm: 0,
              },
            }}
          >
            From serene beaches to majestic mountains,
            discover handpicked destinations for your next
            unforgettable journey.
          </Typography>
        </Box> */}
        <SectionHeader
          title={"All Destinations"}
          description={
            "From serene beaches to majestic mountains, discover handpicked destinations for your next unforgettable journey."
          }
        />

        {/* -------------------------------------------
            DESTINATION GRID
        ------------------------------------------- */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
              xl: "repeat(5, minmax(0, 1fr))",
            },
            marginTop: "20px",
            gap: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          {visibleItems.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </Box>

        {/* -------------------------------------------
            INFINITE SCROLL TRIGGER
        ------------------------------------------- */}

        <Box
          ref={loadMoreRef}
          sx={{
            minHeight: 100,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            mt: 4,
          }}
        >
          {hasMore ? (
            <Stack alignItems="center" spacing={1.2}>
              <CircularProgress
                size={25}
                thickness={4}
                sx={{
                  color: "#3574c5",
                }}
              />

              <Typography
                sx={{
                  color: "#78909c",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                Loading more destinations...
              </Typography>
            </Stack>
          ) : (
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: 500,
                py: 3,
              }}
            >
              You've explored all destinations
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default AllDestinations;
