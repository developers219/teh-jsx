import { useEffect, useState } from "react";
import { Heading } from "../ui/Heading";
import PackageCard from "../packages/PackageCard";
import Carousel from "../ui/Carousel";
import api from "../../services/api";

// Fluid gap between cards (px): 12px on small phones -> 24px on large screens
function getCardGap() {
  if (typeof window === "undefined") return 24;

  return Math.round(Math.min(24, Math.max(12, window.innerWidth * 0.02)));
}

function useCardGap() {
  const [gap, setGap] = useState(getCardGap);

  useEffect(() => {
    const handleResize = () => setGap(getCardGap());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return gap;
}

export default function PackageByCategories({
  heading,
  subheading,
  themeId,
  destinationSlug,
}) {
  // null = still loading, [] = nothing found / error, [...] = packages
  const [packages, setPackages] = useState(null);
  const gap = useCardGap();

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
    <section className="bg-white py-[clamp(2rem,5vw,4rem)]">
      <div className="mx-auto max-w-7xl px-[clamp(1.25rem,3vw,2rem)]">
        {/* SECTION HEADER (size / spacing follow the screen width) */}
        <div className="mb-[clamp(0.5rem,2vw,1.5rem)]">
          <Heading
            compact
            heading={`${headingWords.join(" ")} `}
            highlight={highlightWord}
            subheading={subheading}
          />
        </div>

        {/* PACKAGE CAROUSEL: always ONE row, more cards on bigger screens
            mobile: 1 card, the next one peeks in (swipe / arrows)
            tablet: 2 cards, desktop: 3 cards */}
        <Carousel
          items={packages}
          desktopItems={3}
          tabletItems={2}
          mobileItems={1.1}
          gap={gap}
          showArrows={true}
          renderItem={(travelPackage) => (
            <PackageCard travelPackage={travelPackage} />
          )}
        />
      </div>
    </section>
  );
}