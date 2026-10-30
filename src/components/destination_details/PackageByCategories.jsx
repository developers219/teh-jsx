import { useEffect, useState } from "react";
import Heading from "../ui/Heading";
import PackageCard from "../packages/PackageCard";
import Carousel from "../ui/Carousel";
import api from "../../services/api";

export default function PackageByCategories({
  heading,
  subheading,
  themeId,
  destinationSlug,
}) {
  // null = still loading, [] = nothing found / error, [...] = packages
  const [packages, setPackages] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function fetchPackagesByTheme() {
      try {
        setPackages(null);

        const res = await api.get(
          `/destinations/${destinationSlug}/themes/${themeId}`,
          { signal: controller.signal },
        );

        if (cancelled) return;

        const list = res.data?.data;
        setPackages(Array.isArray(list) ? list : []);
      } catch (error) {
        if (cancelled) return;

        console.error(`Failed to load "${heading}" packages:`, error);
        setPackages([]);
      }
    }

    fetchPackagesByTheme();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [destinationSlug, themeId, heading]);

  // Show the section (heading + cards) only when it really has packages.
  // While loading, with no packages, or on error -> render nothing.
  if (!packages || packages.length === 0) return null;

  // last word of the heading becomes the blue cursive word
  // "Best Selling Packages" -> "Best Selling" + "Packages"
  const headingWords = (heading ?? "").trim().split(" ");
  const highlightWord = headingWords.pop();

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-10 md:mb-12">
          <Heading
            heading={headingWords.join(" ")}
            highlight={highlightWord}
            subheading={subheading}
            className=""
          />
        </div>

        {/* PACKAGE CAROUSEL */}
        <Carousel
          items={packages}
          desktopItems={3}
          tabletItems={2}
          mobileItems={1}
          gap={24}
          showArrows={true}
          renderItem={(travelPackage) => (
            <PackageCard travelPackage={travelPackage} />
          )}
        />
      </div>
    </section>
  );
}