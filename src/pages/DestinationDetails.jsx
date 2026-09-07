import { Link, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import api from "../services/api";
import Hero from "../components/destination_details/Hero";
import { useEffect, useState } from "react";
import { FilteredPackages } from "../components/destination_details/FilteredPackages";
import PackageByCategories from "../components/destination_details/PackageByCategories";

export default function DestinationDetails() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    async function fetchDestinationDetails() {
      if (!slug) {
        setErrorMessage("Destination URL is invalid.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await api.get(`/destinations/${slug}`);
        console.log(response);
        setDestination(response.data.data);
      } catch (error) {
        setErrorMessage(
          "We could not load this destination right now. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchDestinationDetails();
  }, [slug]);
  if (isLoading) {
    return (
      <main className="bg-slate-50 px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton variant="rounded" height={420} sx={{ borderRadius: 4 }} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={430}
                sx={{ borderRadius: 4 }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }
  if (errorMessage) {
    return (
      <main className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Alert
            severity="error"
            action={
              <Button
                component={Link}
                to="/destinations"
                color="inherit"
                size="small"
              >
                Back to destinations
              </Button>
            }
          >
            {errorMessage}
          </Alert>
        </div>
      </main>
    );
  }
  if (!destination) {
    return (
      <main className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Alert severity="info">Destination details are not available.</Alert>
        </div>
      </main>
    );
  }
  console.log(destination);
  const heroImage =
    destination.imageUrl ??
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85";
  return (
    <>
      <Hero
        slides={[{ image: heroImage }]}
        name={destination.name}
        desc={destination.description}
      />
      <FilteredPackages />
      <PackageByCategories
        heading={"Best Selling Packages"}
        subheading={
          "Handpicked travel experiences loved by travelers. Explore our most popular holiday packages and start planning your next adventure."
        }
      />
    </>
  );
}
