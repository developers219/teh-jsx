import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Heading from "../ui/Heading";
import { SlidersHorizontal } from "lucide-react";
import PackageCard from "../packages/PackageCard";
import api from "../../services/api";

const initialFilters = {
  minPrice: "",
  maxPrice: "",
  themeId: "",
  durationId: "",
  sortBy: "",
  sortOrder: "",
};

// one style for every filter chip (site font, slate colours)
const selectClass =
  "shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 font-inter outline-none transition hover:border-slate-300 focus:border-blue-400";

const PackageFilters = ({ filters, setFilters, themes, durations }) => {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSortChange = (value) => {
    if (!value) {
      setFilters((prev) => ({
        ...prev,
        sortBy: "",
        sortOrder: "",
      }));

      return;
    }

    const [sortBy, sortOrder] = value.split("-");

    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
    }));
  };

  const sortValue =
    filters.sortBy && filters.sortOrder
      ? `${filters.sortBy}-${filters.sortOrder}`
      : "";

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="my-8 w-full font-inter">
      {/* =====================================================
          FILTER CHIPS
      ===================================================== */}

      <div
        className="
          flex
          w-full
          items-center
          gap-3
          overflow-x-auto
          overflow-y-hidden
          flex-nowrap
          whitespace-nowrap
          px-1
          py-1
          touch-pan-x
          overscroll-x-contain
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <select
          value={filters.minPrice}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
          className={selectClass}
        >
          <option value="">Min Budget</option>
          <option value="5000">₹5,000</option>
          <option value="10000">₹10,000</option>
          <option value="15000">₹15,000</option>
          <option value="25000">₹25,000</option>
          <option value="50000">₹50,000</option>
        </select>

        <select
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
          className={selectClass}
        >
          <option value="">Max Budget</option>
          <option value="10000">₹10,000</option>
          <option value="25000">₹25,000</option>
          <option value="50000">₹50,000</option>
          <option value="75000">₹75,000</option>
          <option value="100000">₹1,00,000</option>
        </select>

        <select
          value={filters.themeId}
          onChange={(e) => updateFilter("themeId", e.target.value)}
          className={selectClass}
        >
          <option value="">Theme</option>

          {themes?.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>

        <select
          value={filters.durationId}
          onChange={(e) => updateFilter("durationId", e.target.value)}
          className={selectClass}
        >
          <option value="">Duration</option>

          {durations.map((duration) => (
            <option key={duration.id} value={duration.id}>
              {duration.name}
            </option>
          ))}
        </select>

        <select
          value={sortValue}
          onChange={(e) => handleSortChange(e.target.value)}
          className={selectClass}
        >
          <option value="">Sort</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="duration-asc">Duration: Shortest</option>
          <option value="duration-desc">Duration: Longest</option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap font-inter px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <SlidersHorizontal size={16} />
          Reset
        </button>
      </div>
    </div>
  );
};

export const FilteredPackages = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const sectionRef = useRef(null);

  // Hero search can open this page with ?themeId=<id> -> preselect that theme
  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    themeId: searchParams.get("themeId") || "",
  }));

  useEffect(() => {
    if (searchParams.get("themeId")) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [packages, setPackages] = useState([]);
  const [themes, setThemes] = useState([]);
  const [durations, setDurations] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [themesRes, durationsRes] = await Promise.all([
          api("/themes"),
          api("/durations"),
        ]);

        setThemes(themesRes?.data?.data || []);

        setDurations(durationsRes?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (filters.minPrice) {
          params.set("minPrice", filters.minPrice);
        }

        if (filters.maxPrice) {
          params.set("maxPrice", filters.maxPrice);
        }

        if (filters.themeId) {
          params.set("themeId", filters.themeId);
        }

        if (filters.durationId) {
          params.set("durationId", filters.durationId);
        }

        if (filters.sortOrder) {
          params.set("sortOrder", filters.sortOrder);
        }

        const queryString = params.toString();

        const endpoint = queryString
          ? `/packages/slug/${slug}?${queryString}`
          : `/packages/${slug}`;

        const res = await api(endpoint);

        setPackages(res?.data?.data?.packages || []);
      } catch (error) {
        console.error("Failed to fetch packages:", error);

        setError("Failed to load packages.");

        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [
    slug,
    filters.minPrice,
    filters.maxPrice,
    filters.themeId,
    filters.durationId,
    filters.sortBy,
    filters.sortOrder,
  ]);

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-20 bg-white px-6 pb-16 pt-14 font-inter lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <Heading
  heading="Explore"
  highlight="Packages"
  subheading="Choose what suits your needs."
  className="mb-0"
/>

        <PackageFilters
          filters={filters}
          setFilters={setFilters}
          themes={themes}
          durations={durations}
        />

        {/* Loading spinner (same as ThemePackages) */}
        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-[320px] flex-col items-center justify-center gap-4"
          >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="text-sm font-medium text-slate-500">
              Loading packages…
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && packages.length === 0 && (
          <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-slate-600">
            <p>No packages found. Try changing your filters.</p>
          </div>
        )}

        {!loading && !error && packages.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id ?? pkg.slug} travelPackage={pkg} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
;