import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Hero from "../components/destination_details/Hero";
import { FilteredPackages } from "../components/destination_details/FilteredPackages";
import PackageByCategories from "../components/destination_details/PackageByCategories";

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85";

export default function DestinationDetails() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function fetchDestinationDetails() {
      if (!slug) {
        setErrorMessage("Destination URL is invalid.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get(`/destinations/${slug}`, {
          signal: controller.signal,
        });

        if (cancelled) return;

        setDestination(response.data.data);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load destination:", error);
        setErrorMessage(
          "We could not load this destination right now. Please try again later.",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchDestinationDetails();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [slug]);

  /* ---------------- LOADING (same spinner as ThemePackages) ---------------- */
  if (isLoading) {
    return (
      <main className="bg-slate-50 font-mont">
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-screen flex-col items-center justify-center gap-4"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
          <p className="text-sm font-medium text-slate-500">
            Loading destination…
          </p>
        </div>
      </main>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (errorMessage) {
    return (
      <main className="bg-slate-50 px-6 pb-16 pt-44 font-mont lg:px-8">
        <div className="mx-auto max-w-3xl rounded-md border border-red-200 bg-red-50 p-8 text-center text-red-700">
          <p>{errorMessage}</p>

          <Link
            to="/destinations"
            className="mt-4 inline-block rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Back to destinations
          </Link>
        </div>
      </main>
    );
  }

  /* ---------------- NO DATA ---------------- */
  if (!destination) {
    return (
      <main className="bg-slate-50 px-6 pb-16 pt-44 font-mont lg:px-8">
        <div className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-8 text-center text-slate-600">
          <p>Destination details are not available.</p>

          <Link
            to="/destinations"
            className="mt-4 inline-block rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Browse all destinations
          </Link>
        </div>
      </main>
    );
  }

  const heroImage = destination.images?.[0]?.imageUrl || FALLBACK_HERO_IMAGE;

  return (
    <main className="bg-slate-50 font-mont">
      <Hero
        slides={[{ image: heroImage }]}
        name={destination.name}
        desc={destination.description}
      />

      <FilteredPackages />

      <PackageByCategories
        destinationSlug={slug}
        heading={"Best Selling Packages"}
        subheading={
          "Handpicked travel experiences loved by travelers. Explore our most popular holiday packages and start planning your next adventure."
        }
        themeId={4}
      />

      <PackageByCategories
        destinationSlug={slug}
        heading={"Romantic Getaways"}
        subheading={
          "Create unforgettable moments together with handpicked romantic escapes, perfect for honeymoons, anniversaries, and couples looking for a special getaway."
        }
        themeId={5}
      />

      <PackageByCategories
        destinationSlug={slug}
        heading={"Group Adventures"}
        subheading={
          "Travel together, create lasting memories, and enjoy exciting group experiences with carefully curated packages designed for friends, families, and groups."
        }
        themeId={6}
      />

      <PackageByCategories
        destinationSlug={slug}
        heading={"Solo Adventures"}
        subheading={
          "Discover the freedom to travel your way with curated solo experiences, exciting destinations, and unforgettable adventures made for independent explorers."
        }
        themeId={4}
      />
    </main>
  );
}