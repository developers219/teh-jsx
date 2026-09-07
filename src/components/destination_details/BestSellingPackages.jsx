import PackageCard from "../packages/PackageCard";
import Carousel from "../ui/Carousel";

export default function BestSellingPackages({
  packages = [],
}) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* =================================================
            SECTION HEADER
        ================================================== */}
        <div className="mb-10 md:mb-12">

          {/* Small eyebrow */}
          <div className="mb-3 flex items-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-[#17694d]" />

            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#17694d]">
              Best Selling
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Best Selling Packages
          </h2>

          {/* Subheading */}
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Handpicked travel experiences loved by travelers. Explore our
            most popular holiday packages and start planning your next
            adventure.
          </p>
        </div>

        {/* =================================================
            PACKAGE CAROUSEL
        ================================================== */}
        {packages.length > 0 ? (
          <Carousel
            items={packages}
            desktopItems={4}
            tabletItems={2}
            mobileItems={1}
            gap={24}
            showArrows={true}
            renderItem={(travelPackage) => (
              <PackageCard travelPackage={travelPackage} />
            )}
          />
        ) : (
          <div className="flex min-h-[250px] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50">
            <p className="text-sm font-medium text-slate-500">
              No best selling packages available.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}