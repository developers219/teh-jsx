import React, { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import DestinationCard from "../ui/DestinationCard";
import SectionHeader from "../home/SectionHeader";
import api from "../../services/api";

const AllDestinations = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get("/destinations/category/2");
        setDestinations(res.data.data);
      } catch (error) {
        console.error("Failed to fetch international destinations:", error);
        setDestinations([]);
      }
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
        {/* =================================================
            HEADING
        ================================================= */}

        <SectionHeader
          title="All Destinations"
          description="From serene beaches to majestic mountains, discover handpicked destinations for your next unforgettable journey."
        />

        {/* =================================================
            MOBILE / TABLET / IPAD
            CUSTOM DESTINATION CARDS
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "flex",
              sm: "flex",
              md: "flex",
              lg: "none",
            },

            flexWrap: "wrap",

            width: "100%",

            marginTop: "20px",

            gap: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },
          }}
        >
          {visibleItems.map((destination) => (
            <Box
              key={destination.id}
              component="a"
              href={`/destinations/dom/${destination.slug}`}
              sx={{
                width: {
                  xs: "calc(50% - 6px)",
                  sm: "calc(50% - 8px)",
                  md: "calc(50% - 10px)",
                },

                flexGrow: 0,
                flexShrink: 0,

                textDecoration: "none",

                position: "relative",

                height: {
                  xs: 220,
                  sm: 250,
                  md: 280,
                },

                overflow: "hidden",

                backgroundColor: "#e5e7eb",

                boxShadow:
                  "0 8px 25px rgba(15, 23, 42, 0.08)",

                transition:
                  "transform 0.3s ease, box-shadow 0.3s ease",

                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 14px 35px rgba(15, 23, 42, 0.14)",
                },

                "&:hover .destination-image": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {/* IMAGE */}

              <Box
                component="img"
                className="destination-image"
                src={destination.imageUrl}
                alt={destination.name || "Destination"}
                loading="lazy"
                sx={{
                  position: "absolute",

                  inset: 0,

                  width: "100%",
                  height: "100%",

                  objectFit: "cover",

                  display: "block",

                  transition: "transform 0.5s ease",
                }}
              />

              {/* GRADIENT */}

              <Box
                sx={{
                  position: "absolute",

                  inset: 0,

                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.78) 100%)",
                }}
              />

              {/* CONTENT */}

              <Box
                sx={{
                  position: "absolute",

                  left: 0,
                  right: 0,
                  bottom: 0,

                  p: {
                    xs: 1.4,
                    sm: 1.7,
                    md: 2,
                  },
                }}
              >
                {/* DESTINATION NAME */}

                <Typography
                  component="h3"
                  sx={{
                    color: "#ffffff",

                    fontSize: {
                      xs: "15px",
                      sm: "18px",
                      md: "20px",
                    },

                    fontWeight: 800,

                    lineHeight: 1.15,

                    mb: {
                      xs: 0.4,
                      sm: 0.5,
                    },

                    overflow: "hidden",

                    textOverflow: "ellipsis",

                    display: "-webkit-box",

                    WebkitLineClamp: 1,

                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {destination.name}
                </Typography>

                {/* TAGLINE */}

                {destination.tagline && (
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.88)",

                      fontSize: {
                        xs: "10px",
                        sm: "11px",
                        md: "12px",
                      },

                      lineHeight: 1.35,

                      fontWeight: 400,

                      overflow: "hidden",

                      textOverflow: "ellipsis",

                      display: "-webkit-box",

                      WebkitLineClamp: 2,

                      WebkitBoxOrient: "vertical",

                      pr: {
                        xs: 1,
                        sm: 1.5,
                      },
                    }}
                  >
                    {destination.tagline}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {/* =================================================
            DESKTOP
            ORIGINAL DESTINATION CARD GRID
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "none",
              lg: "grid",
            },

            gridTemplateColumns: {
              lg: "repeat(4, minmax(0, 1fr))",
              xl: "repeat(5, minmax(0, 1fr))",
            },

            marginTop: "20px",

            gap: {
              lg: 3,
              xl: 3,
            },
          }}
        >
          {visibleItems.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </Box>

        {/* =================================================
            INFINITE SCROLL TRIGGER
        ================================================= */}

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
            <Stack
              alignItems="center"
              spacing={1.2}
            >
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