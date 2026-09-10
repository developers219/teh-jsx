// // import { useState } from "react";
// // import SectionHeader from "../home/SectionHeader";
// // // import PackageGrid from "./PackageGrid";

// // import { SlidersHorizontal } from "lucide-react";

// // const PackageFilters = ({ filters, setFilters }) => {
// //   const updateFilter = (key, value) => {
// //     setFilters((prev) => ({
// //       ...prev,
// //       [key]: value,
// //     }));
// //   };

// //   return (
// //     <div className="flex flex-wrap items-center gap-3 my-8">
// //       {/* Budget */}
// //       <select
// //         value={filters.budget}
// //         onChange={(e) => updateFilter("budget", e.target.value)}
// //         className="border border-gray-300 rounded-full px-4 py-2.5"
// //       >
// //         <option value="">Budget</option>
// //         <option value="under-10000">Under ₹10,000</option>
// //         <option value="10000-25000">₹10,000 – ₹25,000</option>
// //         <option value="25000-50000">₹25,000 – ₹50,000</option>
// //         <option value="above-50000">Above ₹50,000</option>
// //       </select>

// //       {/* Duration */}
// //       <select
// //         value={filters.duration}
// //         onChange={(e) => updateFilter("duration", e.target.value)}
// //         className="border border-gray-300 rounded-full px-4 py-2.5"
// //       >
// //         <option value="">Duration</option>
// //         <option value="1-3">1 – 3 Days</option>
// //         <option value="4-6">4 – 6 Days</option>
// //         <option value="7-10">7 – 10 Days</option>
// //         <option value="10+">10+ Days</option>
// //       </select>

// //       {/* People */}
// //       <select
// //         value={filters.people}
// //         onChange={(e) => updateFilter("people", e.target.value)}
// //         className="border border-gray-300 rounded-full px-4 py-2.5"
// //       >
// //         <option value="">People</option>
// //         <option value="1-2">1 – 2 People</option>
// //         <option value="3-5">3 – 5 People</option>
// //         <option value="6-10">6 – 10 People</option>
// //         <option value="10+">10+ People</option>
// //       </select>

// //       {/* Sort */}
// //       <select
// //         value={filters.sort}
// //         onChange={(e) => updateFilter("sort", e.target.value)}
// //         className="border border-gray-300 rounded-full px-4 py-2.5"
// //       >
// //         <option value="popular">Sort: Popular</option>
// //         <option value="price-low">Price: Low to High</option>
// //         <option value="price-high">Price: High to Low</option>
// //         <option value="duration-short">Duration: Shortest</option>
// //         <option value="duration-long">Duration: Longest</option>
// //       </select>

// //       {/* Optional reset */}
// //       <button
// //         type="button"
// //         onClick={() =>
// //           setFilters({
// //             budget: "",
// //             duration: "",
// //             people: "",
// //             sort: "popular",
// //           })
// //         }
// //         className="flex items-center gap-2 px-4 py-2.5 text-sm"
// //       >
// //         <SlidersHorizontal size={16} />
// //         Reset
// //       </button>
// //     </div>
// //   );
// // };

// // // export default PackageFilters;

// // export const FilteredPackages = () => {
// //   const [filters, setFilters] = useState({
// //     budget: null,
// //     duration: null,
// //     people: null,
// //     sort: "popular",
// //   });

// //   return (
// //     <section>
// //       <div className="max-w-[1440px] mx-auto my-16">
// //         <SectionHeader
// //           title="Explore Filtered Packages"
// //           description="Choose what suits your needs."
// //         />

// //         <PackageFilters filters={filters} setFilters={setFilters} />

// //         {/* <PackageGrid filters={filters} /> */}
// //       </div>
// //     </section>
// //   );
// // };

// import { useEffect, useMemo, useState } from "react";
// import SectionHeader from "../home/SectionHeader";
// // import PackageCard from "./PackageCard";

// import { SlidersHorizontal } from "lucide-react";
// import PackageCard from "../packages/PackageCard";
// import api from "../../services/api";

// const PackageFilters = ({ filters, setFilters }) => {
//   const updateFilter = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-3 my-8">
//       {/* Budget */}
//       <select
//         value={filters.budget}
//         onChange={(e) => updateFilter("budget", e.target.value)}
//         className="border border-gray-300 rounded-full px-4 py-2.5"
//       >
//         <option value="">Budget</option>
//         <option value="under-10000">Under ₹10,000</option>
//         <option value="10000-25000">₹10,000 – ₹25,000</option>
//         <option value="25000-50000">₹25,000 – ₹50,000</option>
//         <option value="above-50000">Above ₹50,000</option>
//       </select>

//       {/* Duration */}
//       <select
//         value={filters.duration}
//         onChange={(e) => updateFilter("duration", e.target.value)}
//         className="border border-gray-300 rounded-full px-4 py-2.5"
//       >
//         <option value="">Duration</option>
//         <option value="1-3">1 – 3 Days</option>
//         <option value="4-6">4 – 6 Days</option>
//         <option value="7-10">7 – 10 Days</option>
//         <option value="10+">10+ Days</option>
//       </select>

//       {/* People */}
//       <select
//         value={filters.people}
//         onChange={(e) => updateFilter("people", e.target.value)}
//         className="border border-gray-300 rounded-full px-4 py-2.5"
//       >
//         <option value="">People</option>
//         <option value="1-2">1 – 2 People</option>
//         <option value="3-5">3 – 5 People</option>
//         <option value="6-10">6 – 10 People</option>
//         <option value="10+">10+ People</option>
//       </select>

//       {/* Sort */}
//       <select
//         value={filters.sort}
//         onChange={(e) => updateFilter("sort", e.target.value)}
//         className="border border-gray-300 rounded-full px-4 py-2.5"
//       >
//         <option value="popular">Sort: Popular</option>
//         <option value="price-low">Price: Low to High</option>
//         <option value="price-high">Price: High to Low</option>
//         <option value="duration-short">Duration: Shortest</option>
//         <option value="duration-long">Duration: Longest</option>
//       </select>

//       {/* Optional reset */}
//       <button
//         type="button"
//         onClick={() =>
//           setFilters({
//             budget: "",
//             duration: "",
//             people: "",
//             sort: "popular",
//           })
//         }
//         className="flex items-center gap-2 px-4 py-2.5 text-sm"
//       >
//         <SlidersHorizontal size={16} />
//         Reset
//       </button>
//     </div>
//   );
// };

// const packages = [
//   {
//     id: 1,
//     title: "Goa Escape",
//     price: 15000,
//     duration: 3,
//     people: 2,
//   },
//   {
//     id: 2,
//     title: "Kerala Explorer",
//     price: 28000,
//     duration: 6,
//     people: 4,
//   },
//   {
//     id: 3,
//     title: "Rajasthan Heritage",
//     price: 45000,
//     duration: 8,
//     people: 6,
//   },
// ];

// export const FilteredPackages = () => {
//   const [filters, setFilters] = useState({
//     budget: "",
//     duration: "",
//     people: "",
//     sort: "popular",
//   });

//   useEffect(() => {
//     const fetchPackagesByFiltering = async () => {
//       const res = await api("/packages");
//       console.log(res);
//     };
//     fetchPackagesByFiltering();
//   }, []);

//   const filteredPackages = useMemo(() => {
//     let result = [...packages];

//     // Budget
//     if (filters.budget) {
//       result = result.filter((pkg) => {
//         switch (filters.budget) {
//           case "under-10000":
//             return pkg.price < 10000;

//           case "10000-25000":
//             return pkg.price >= 10000 && pkg.price <= 25000;

//           case "25000-50000":
//             return pkg.price > 25000 && pkg.price <= 50000;

//           case "above-50000":
//             return pkg.price > 50000;

//           default:
//             return true;
//         }
//       });
//     }

//     // Duration
//     if (filters.duration) {
//       result = result.filter((pkg) => {
//         switch (filters.duration) {
//           case "1-3":
//             return pkg.duration >= 1 && pkg.duration <= 3;

//           case "4-6":
//             return pkg.duration >= 4 && pkg.duration <= 6;

//           case "7-10":
//             return pkg.duration >= 7 && pkg.duration <= 10;

//           case "10+":
//             return pkg.duration > 10;

//           default:
//             return true;
//         }
//       });
//     }

//     // People
//     if (filters.people) {
//       result = result.filter((pkg) => {
//         switch (filters.people) {
//           case "1-2":
//             return pkg.people >= 1 && pkg.people <= 2;

//           case "3-5":
//             return pkg.people >= 3 && pkg.people <= 5;

//           case "6-10":
//             return pkg.people >= 6 && pkg.people <= 10;

//           case "10+":
//             return pkg.people > 10;

//           default:
//             return true;
//         }
//       });
//     }

//     // Sort
//     switch (filters.sort) {
//       case "price-low":
//         result.sort((a, b) => a.price - b.price);
//         break;

//       case "price-high":
//         result.sort((a, b) => b.price - a.price);
//         break;

//       case "duration-short":
//         result.sort((a, b) => a.duration - b.duration);
//         break;

//       case "duration-long":
//         result.sort((a, b) => b.duration - a.duration);
//         break;

//       default:
//         break;
//     }

//     return result;
//   }, [filters]);

//   return (
//     <section className="bg-white">
//       <div className="max-w-7xl mx-auto py-16 px-4">
//         <SectionHeader
//           title="Explore Filtered Packages"
//           description="Choose what suits your needs."
//         />

//         <PackageFilters filters={filters} setFilters={setFilters} />

//         {filteredPackages.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//             {filteredPackages.map((pkg) => (
//               <div key={pkg.id}>
//                 <PackageCard travelPackage={pkg} />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="py-16 text-center">
//             <h3 className="text-xl font-semibold">No packages found</h3>

//             <p className="text-gray-500 mt-2">Try changing your filters.</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionHeader from "../home/SectionHeader";
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
    <div className="flex flex-wrap items-center gap-3 my-8">
      {/* Minimum Price */}
      <select
        value={filters.minPrice}
        onChange={(e) => updateFilter("minPrice", e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-2.5 outline-none"
      >
        <option value="">Min Budget</option>
        <option value="5000">₹5,000</option>
        <option value="10000">₹10,000</option>
        <option value="15000">₹15,000</option>
        <option value="25000">₹25,000</option>
        <option value="50000">₹50,000</option>
      </select>

      {/* Maximum Price */}
      <select
        value={filters.maxPrice}
        onChange={(e) => updateFilter("maxPrice", e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-2.5 outline-none"
      >
        <option value="">Max Budget</option>
        <option value="10000">₹10,000</option>
        <option value="25000">₹25,000</option>
        <option value="50000">₹50,000</option>
        <option value="75000">₹75,000</option>
        <option value="100000">₹1,00,000</option>
      </select>

      {/* Theme */}
      <select
        value={filters.themeId}
        onChange={(e) => updateFilter("themeId", e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-2.5 outline-none"
      >
        <option value="">Theme</option>

        {themes?.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>

      {/* Duration */}
      <select
        value={filters.durationId}
        onChange={(e) => updateFilter("durationId", e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-2.5 outline-none"
      >
        <option value="">Duration</option>

        {durations.map((duration) => (
          <option key={duration.id} value={duration.id}>
            {duration.name}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sortValue}
        onChange={(e) => handleSortChange(e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-2.5 outline-none"
      >
        <option value="">Sort</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="duration-asc">Duration: Shortest</option>
        <option value="duration-desc">Duration: Longest</option>
      </select>

      {/* Reset */}
      <button
        type="button"
        onClick={resetFilters}
        className="flex items-center gap-2 px-4 py-2.5 text-sm"
      >
        <SlidersHorizontal size={16} />
        Reset
      </button>
    </div>
  );
};

export const FilteredPackages = () => {
  const { slug } = useParams();

  const [filters, setFilters] = useState(initialFilters);

  const [packages, setPackages] = useState([]);
  const [themes, setThemes] = useState([]);
  const [durations, setDurations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * Fetch themes and durations
   *
   * These are filter options, so they only need
   * to be fetched when the page loads.
   */
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

  /*
   * Fetch packages whenever:
   *
   * - destination changes
   * - price changes
   * - theme changes
   * - duration changes
   * - sorting changes
   */
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

        // if (filters.sortBy) {
        //   params.set("sortBy", filters.sortBy);
        // }

        if (filters.sortOrder) {
          params.set("sortOrder", filters.sortOrder);
        }

        const queryString = params.toString();

        const endpoint = queryString
          ? `/packages/slug/${slug}?${queryString}`
          : `/packages/${slug}`;
        console.log("meow");
        const res = await api(endpoint);
        console.log(res);
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
    <section className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4">
        <SectionHeader
          title="Explore Packages"
          description="Choose what suits your needs."
        />

        <PackageFilters
          filters={filters}
          setFilters={setFilters}
          themes={themes}
          durations={durations}
        />

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-gray-500">Loading packages...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <h3 className="text-xl font-semibold">Something went wrong</h3>

            <p className="text-gray-500 mt-2">{error}</p>
          </div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {packages.map((pkg) => (
              <div key={pkg.id}>
                <PackageCard travelPackage={pkg} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h3 className="text-xl font-semibold">No packages found</h3>

            <p className="text-gray-500 mt-2">Try changing your filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};
