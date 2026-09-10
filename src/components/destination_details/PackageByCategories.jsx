import { useEffect, useState } from "react";
import SectionHeader from "../home/SectionHeader";
import PackageCard from "../packages/PackageCard";
import Carousel from "../ui/Carousel";
import api from "../../services/api";

const packages = [
  {
    id: 1,
    slug: "bali-paradise-escape",
    title: "Bali Paradise Escape",
    image: {
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
      altText: "Bali tropical temple and landscape",
    },
    rating: 4.8,
    durationDays: 5,
    durationNights: 4,
    destination: {
      name: "Bali, Indonesia",
    },
    description:
      "Explore Bali's beautiful beaches, temples, waterfalls and vibrant local culture with this unforgettable getaway.",
    price: 36999,
  },

  {
    id: 2,
    slug: "dubai-luxury-holiday",
    title: "Dubai Luxury Holiday",
    image: {
      url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
      altText: "Dubai skyline with Burj Khalifa",
    },
    rating: 4.9,
    durationDays: 5,
    durationNights: 4,
    destination: {
      name: "Dubai, UAE",
    },
    description:
      "Experience the glamour of Dubai with iconic attractions, desert adventures, luxury shopping and stunning city views.",
    price: 42999,
  },

  {
    id: 3,
    slug: "maldives-romantic-getaway",
    title: "Maldives Romantic Getaway",
    image: {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
      altText: "Beautiful tropical beach in Maldives",
    },
    rating: 4.9,
    durationDays: 5,
    durationNights: 4,
    destination: {
      name: "Maldives",
    },
    description:
      "Relax on pristine beaches, enjoy crystal-clear waters and create unforgettable memories in paradise.",
    price: 54999,
  },

  {
    id: 4,
    slug: "thailand-tropical-adventure",
    title: "Thailand Tropical Adventure",
    image: {
      url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=85",
      altText: "Thailand tropical island and turquoise water",
    },
    rating: 4.7,
    durationDays: 6,
    durationNights: 5,
    destination: {
      name: "Thailand",
    },
    description:
      "Discover Bangkok and Phuket with exciting island tours, local experiences, beaches and unforgettable nightlife.",
    price: 39999,
  },

  {
    id: 5,
    slug: "singapore-city-break",
    title: "Singapore City Break",
    image: {
      url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
      altText: "Singapore Marina Bay skyline",
    },
    rating: 4.8,
    durationDays: 4,
    durationNights: 3,
    destination: {
      name: "Singapore",
    },
    description:
      "Explore Singapore's futuristic skyline, Gardens by the Bay, Sentosa Island and world-class attractions.",
    price: 32999,
  },

  {
    id: 6,
    slug: "vietnam-discovery-tour",
    title: "Vietnam Discovery Tour",
    image: {
      url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85",
      altText: "Vietnam mountain and rice fields",
    },
    rating: 4.7,
    durationDays: 6,
    durationNights: 5,
    destination: {
      name: "Vietnam",
    },
    description:
      "Discover Vietnam's fascinating culture, delicious cuisine, scenic landscapes and historic cities.",
    price: 37999,
  },

  {
    id: 7,
    slug: "sri-lanka-explorer",
    title: "Sri Lanka Explorer",
    image: {
      url: "https://images.unsplash.com/photo-1586613835278-0c5e7a7e8c6c?auto=format&fit=crop&w=1200&q=85",
      altText: "Scenic Sri Lankan landscape",
    },
    rating: 4.6,
    durationDays: 6,
    durationNights: 5,
    destination: {
      name: "Sri Lanka",
    },
    description:
      "Experience Sri Lanka's beautiful beaches, wildlife, ancient temples, tea plantations and scenic hill country.",
    price: 29999,
  },

  {
    id: 8,
    slug: "mauritius-island-escape",
    title: "Mauritius Island Escape",
    image: {
      url: "https://images.unsplash.com/photo-1589979481223-deb893043163?auto=format&fit=crop&w=1200&q=85",
      altText: "Mauritius tropical beach",
    },
    rating: 4.8,
    durationDays: 6,
    durationNights: 5,
    destination: {
      name: "Mauritius",
    },
    description:
      "Enjoy turquoise lagoons, beautiful beaches, island adventures and a relaxing tropical holiday in Mauritius.",
    price: 49999,
  },

  {
    id: 9,
    slug: "japan-cultural-journey",
    title: "Japan Cultural Journey",
    image: {
      url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=85",
      altText: "Traditional Japanese temple and cherry blossoms",
    },
    rating: 4.9,
    durationDays: 7,
    durationNights: 6,
    destination: {
      name: "Japan",
    },
    description:
      "Experience Japan's fascinating blend of ancient traditions, modern cities, beautiful temples and local cuisine.",
    price: 74999,
  },

  {
    id: 10,
    slug: "baku-caspian-holiday",
    title: "Baku Caspian Holiday",
    image: {
      url: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1200&q=85",
      altText: "Baku city skyline",
    },
    rating: 4.6,
    durationDays: 5,
    durationNights: 4,
    destination: {
      name: "Baku, Azerbaijan",
    },
    description:
      "Discover Baku's modern architecture, historic old city, Caspian coastline and fascinating cultural attractions.",
    price: 31999,
  },
];

export default function PackageByCategories({
  heading,
  subheading,
  themeId,
  destinationSlug,
}) {
  const [packages, setPackages] = useState(null);
  console.log(themeId, packages);
  useEffect(() => {
    async function fetchPackagesByTheme() {
      const res = await api.get(
        `/destinations/${destinationSlug}/themes/${themeId}`
      );
      console.log(res);
      setPackages(res.data.data);
    }
    fetchPackagesByTheme();
  }, []);
  return (
    <section className="bg-white my-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* =================================================
            SECTION HEADER
        ================================================== */}
        <div className="mb-10 md:mb-12">
          {/* Small eyebrow */}
          {/* <div className="mb-3 flex items-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-[#17694d]" />

            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#17694d]">
              Best Selling
            </span>
          </div> */}

          {/* Heading */}
          <SectionHeader title={heading} description={subheading} />
          {/* <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Best Selling Packages
          </h2>

          
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Handpicked travel experiences loved by travelers. Explore our most
            popular holiday packages and start planning your next adventure.
          </p> */}
        </div>

        {/* =================================================
            PACKAGE CAROUSEL
        ================================================== */}
        {packages?.length > 0 ? (
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
