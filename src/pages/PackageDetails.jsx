import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  // ArrowRight,
  // CalendarDays,
  Check,
  Clock3,
  Compass,
  Hotel,
  MapPin,
  Plane,
  Sparkles,
  Star,
  // Users,
  X,
  Phone,
  ChevronDown,
  Utensils,
} from "lucide-react";

import api from "../services/api";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import LeadCapturePopup from "../components/forms/LeadCapturePopup";
import Carousel from "../components/ui/Carousel";

import Skeleton from "@mui/material/Skeleton";

const formatDateTime = (dateTime) => {
  if (!dateTime) return "—";

  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/* ============================================================
   BACKEND HELPERS
   Every value shown on this page comes from the package object.
============================================================ */

const IMAGE_KEYS = [
  "imageUrl",
  "imageURL",
  "image_url",
  "image",
  "thumbnail",
  "photo",
  "picture",
];
const ACTIVITY_IMAGE_KEYS = [...IMAGE_KEYS, "images", "url", "src", "path"];
const HOTEL_IMAGE_KEYS = [...IMAGE_KEYS, "images"];
const FLIGHT_LOGO_KEYS = [
  "logo",
  "logoUrl",
  "logo_url",
  "airlineLogo",
  "airlineLogoUrl",
  "airline_logo",
  "imageUrl",
  "image",
];

const toImageUrl = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return toImageUrl(value[0]);
  if (typeof value === "object") {
    return value.url || value.imageUrl || value.src || value.path || "";
  }
  return "";
};

// First usable image url found on a backend object (or "" when there is none)
const pickImage = (item, keys = IMAGE_KEYS) => {
  if (!item || typeof item !== "object") return "";

  for (const key of keys) {
    const url = toImageUrl(item[key]);
    if (url) return url;
  }

  return "";
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  if (Array.isArray(value)) {
    return value.length
      ? value
          .map((item) =>
            typeof item === "object" && item !== null
              ? Object.entries(item)
                  .map(
                    ([key, itemValue]) => `${key}: ${formatValue(itemValue)}`,
                  )
                  .join(", ")
              : String(item),
          )
          .join(", ")
      : "—";
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, itemValue]) => `${key}: ${formatValue(itemValue)}`)
      .join(", ");
  }

  return String(value);
};

const activityName = (activity) =>
  typeof activity === "string"
    ? activity
    : activity?.activity || activity?.title || activity?.name || "Activity";

// small uppercase label used inside the itinerary cards
const MICRO_LABEL =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400";

// gallery photo height: grows with the screen (desktop stays 500px)
const GALLERY_HEIGHT =
  "h-[280px] min-[400px]:h-[340px] sm:h-[400px] md:h-[440px] lg:h-[500px]";

function PackageGallery({ images = [], title = "Package" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  /*
   * Supports:
   * - ["image1.jpg", "image2.jpg"]
   * - [{ url: "image1.jpg" }, { url: "image2.jpg" }]
   * - [{ imageUrl: "image1.jpg" }]
   */

  const normalizedImages = images
    .map((image) => {
      if (typeof image === "string") return image;

      return (
        image?.url ||
        image?.imageUrl ||
        image?.src ||
        image?.path ||
        image?.image ||
        ""
      );
    })
    .filter(Boolean);

  if (!normalizedImages.length) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-slate-100 sm:rounded-[28px] ${GALLERY_HEIGHT}`}
      >
        <p className="text-sm font-semibold text-slate-500">
          No images available
        </p>
      </div>
    );
  }

  const visibleThumbnails = normalizedImages.slice(0, 4);
  const hasMoreImages = normalizedImages.length > 4;

  const openModal = (index = activeIndex) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setModalIndex((prev) =>
      prev === 0 ? normalizedImages.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setModalIndex((prev) =>
      prev === normalizedImages.length - 1 ? 0 : prev + 1,
    );
  };

  /*
   * Keyboard controls for the modal.
   */

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  /*
   * Prevent body scrolling while modal is open.
   */

  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen]);

  return (
    <>
      {/* =====================================================
          MAIN GALLERY
      ====================================================== */}

      <section className="w-full">
        <div className="grid gap-3 md:grid-cols-[96px_minmax(0,1fr)]">
          {/* =================================================
              LEFT THUMBNAILS (row under the photo on small screens)
          ================================================== */}

          <div className="no-scrollbar order-2 flex gap-2 overflow-x-auto sm:gap-3 md:order-1 md:flex-col md:overflow-visible">
            {visibleThumbnails.map((image, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`group relative h-[64px] min-w-[80px] overflow-hidden rounded-2xl border transition-all duration-300 sm:h-[76px] sm:min-w-[92px] md:h-[88px] md:min-w-0 ${
                    isActive
                      ? "border-blue-400 ring-2 ring-blue-400 ring-offset-2"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${title} ${index + 1}`}
                    className={`h-full w-full object-cover transition duration-500 ${
                      isActive
                        ? "scale-105"
                        : "opacity-70 group-hover:scale-105 group-hover:opacity-100"
                    }`}
                  />

                  {isActive && <div className="absolute inset-0 bg-black/10" />}
                </button>
              );
            })}

            {/* VIEW ALL THUMBNAIL */}

            {hasMoreImages && (
              <button
                type="button"
                onClick={() => openModal(activeIndex)}
                className="group relative h-[64px] min-w-[80px] overflow-hidden rounded-2xl border border-black/10 bg-black sm:h-[76px] sm:min-w-[92px] md:h-[88px] md:min-w-0"
              >
                <img
                  src={normalizedImages[4]}
                  alt="View all gallery images"
                  className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-50"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-base font-black sm:text-lg">
                    +{normalizedImages.length - 4}
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                    View all
                  </span>
                </div>
              </button>
            )}

            {/* If there are 4 or fewer images, still provide View All */}

            {!hasMoreImages && normalizedImages.length > 1 && (
              <button
                type="button"
                onClick={() => openModal(activeIndex)}
                className="flex h-[64px] min-w-[80px] items-center justify-center rounded-2xl border border-black bg-black text-white transition hover:bg-white hover:text-black sm:h-[76px] sm:min-w-[92px] md:h-[88px] md:min-w-0"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                  View all
                </span>
              </button>
            )}
          </div>

          {/* =================================================
              ACTIVE IMAGE
          ================================================== */}

          <div
            className={`group relative order-1 overflow-hidden rounded-2xl bg-slate-100 sm:rounded-[28px] md:order-2 ${GALLERY_HEIGHT}`}
          >
            <Carousel
              items={normalizedImages}
              gap={0}
              desktopItems={1}
              tabletItems={1}
              mobileItems={1}
              arrowsVariant="overlay"
              showArrows={normalizedImages.length > 1}
              fillHeight
              index={activeIndex}
              onIndexChange={setActiveIndex}
              renderItem={(src, index) => (
                <div className="h-full w-full overflow-hidden">
                  <img
                    src={src}
                    alt={`${title} - image ${index + 1}`}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            />

            {/* Bottom gradient */}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Image counter */}

            <div className="font-inter pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-black/70 px-3 py-1.5 text-[11px] text-white backdrop-blur-md sm:bottom-5 sm:left-5 sm:px-4 sm:py-2 sm:text-xs">
              {activeIndex + 1} / {normalizedImages.length}
            </div>

            {/* Expand button */}

            <button
              type="button"
              onClick={() => openModal(activeIndex)}
              aria-label="Open gallery"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white sm:right-5 sm:top-5 sm:h-11 sm:w-11"
            >
              <ZoomInIcon fontSize="small" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FULLSCREEN GALLERY MODAL
      ====================================================== */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-3 sm:p-6"
          onClick={closeModal}
        >
          <div
            className="relative flex h-full w-full max-w-7xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex items-center justify-between pb-3 sm:pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                  Gallery
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {modalIndex + 1} / {normalizedImages.length}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close gallery"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:h-11 sm:w-11"
              >
                <CloseIcon />
              </button>
            </div>

            {/* =================================================
                ACTIVE MODAL IMAGE
            ================================================== */}

            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <img
                src={normalizedImages[modalIndex]}
                alt={`${title} - image ${modalIndex + 1}`}
                className="max-h-full max-w-full rounded-xl object-contain sm:rounded-2xl"
              />

              {/* Previous */}

              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous image"
                className="absolute left-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:left-4 sm:h-12 sm:w-12"
              >
                <ChevronLeftIcon />
              </button>

              {/* Next */}

              <button
                type="button"
                onClick={goToNext}
                aria-label="Next image"
                className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:right-4 sm:h-12 sm:w-12"
              >
                <ChevronRightIcon />
              </button>
            </div>

            {/* =================================================
                THUMBNAIL CAROUSEL
            ================================================== */}

            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-2 sm:mt-4">
              {normalizedImages.map((image, index) => {
                const isActive = modalIndex === index;

                return (
                  <button
                    key={`${image}-modal-${index}`}
                    type="button"
                    onClick={() => setModalIndex(index)}
                    className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition duration-300 sm:h-16 sm:w-24 ${
                      isActive
                        ? "border-white ring-2 ring-white/30"
                        : "border-white/10 opacity-50 hover:border-white/40 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${title} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {isActive && (
                      <div className="absolute inset-0 bg-white/10" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PackageDetails() {
  const { slug } = useParams();

  const [travelPackage, setTravelPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [openSections, setOpenSections] = useState({
    overview: true,
    itinerary: false,
    hotels: false,
    flights: false,
    included: false,
    tandc: false,
  });
  // console.log(travelPackage);
  const [activeSection, setActiveSection] = useState("package-overview");

  const packageSectionIds = [
    "package-overview",
    "package-itinerary",
    "package-hotels",
    "package-flights",
    "package-included-section",
    "package-inclusions",
    "package-exclusions",
    "package-faqs",
    "package-terms",
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Account for the fixed website navbar and sticky section navigation.
      const offset = 180;
      let currentSection = "";

      packageSectionIds.forEach((id) => {
        const section = document.getElementById(id);

        if (section && section.getBoundingClientRect().top <= offset) {
          currentSection = id;
        }
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keep the highlighted tab visible inside the (scrollbar-less) tab bar.
  useEffect(() => {
    const tab = document.querySelector(`[data-tab-id="${activeSection}"]`);
    const bar = tab?.parentElement;

    if (!tab || !bar) return;

    bar.scrollTo({
      left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activeSection]);

  useEffect(() => {
    document.body.classList.add("max-lg:pb-16");
    document.body.style.setProperty("--widget-bottom", "5rem");

    return () => {
      document.body.classList.remove("max-lg:pb-16");
      document.body.style.removeProperty("--widget-bottom");
    };
  }, []);

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Open a collapsed section first, then smoothly scroll to its heading.
  const scrollToPackageSection = (targetId, sectionKey) => {
    if (sectionKey && !openSections[sectionKey]) {
      setOpenSections((prev) => ({ ...prev, [sectionKey]: true }));
    }

    window.setTimeout(
      () => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
      sectionKey && !openSections[sectionKey] ? 380 : 0,
    );
  };

  useEffect(() => {
    async function fetchPackageDetails() {
      if (!slug) {
        setErrorMessage("Package URL is invalid.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get(`/packages/slug/${slug}`);

        setTravelPackage(response.data.data[0]);
      } catch (error) {
        console.error(error);

        setErrorMessage(
          "We could not load this package right now. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPackageDetails();
  }, [slug]);

  /* =========================================================
     LOADING
  ========================================================== */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Skeleton
            variant="rounded"
            height={34}
            width={150}
            sx={{ borderRadius: 999 }}
          />

          <div className="mt-8 h-[280px] sm:h-[400px] lg:h-[540px]">
            <Skeleton
              variant="rounded"
              height="100%"
              sx={{ borderRadius: 4 }}
            />
          </div>

          <div className="mt-8 grid gap-8 sm:mt-12 lg:grid-cols-[1fr_360px] lg:gap-12">
            <div>
              <Skeleton variant="text" height={80} width="75%" />
              <Skeleton variant="text" height={30} width="90%" />
              <Skeleton variant="text" height={30} width="70%" />

              <div className="mt-8">
                <Skeleton variant="rounded" height={180} />
              </div>
            </div>

            <div className="hidden lg:block">
              <Skeleton
                variant="rounded"
                height={340}
                sx={{ borderRadius: 4 }}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================== */

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/40">
            Something went wrong
          </p>

          <h1 className="mt-3 text-2xl font-black sm:text-3xl">
            Package unavailable
          </h1>

          <p className="mt-3 text-sm text-black/50">{errorMessage}</p>

          <Link
            to="/packages"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
            Back to packages
          </Link>
        </div>
      </main>
    );
  }

  if (!travelPackage) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="text-center text-sm text-black/50">
          Package details are not available.
        </p>
      </main>
    );
  }

  /* =========================================================
     DATA
  ========================================================== */

  const {
    title,
    overview,
    startingPrice,
    discountPrice,
    themeName,
    // travellerTypeName,
    durationName,
    // durationDaysCount,
    images = [],
    destinations = [],
    itineraries = [],
    hotels = [],
    flights = [],
    inclusions = [],
    exclusions = [],
  } = travelPackage;

  const starting = Number(startingPrice || 0);
  const discounted = Number(discountPrice || 0);

  const hasDiscount = discounted > 0 && discounted < starting;

  const finalPrice = hasDiscount ? discounted : starting;

  const discountPercentage = hasDiscount
    ? Math.round(((starting - discounted) / starting) * 100)
    : 0;

  /* =========================================================
     ANIMATION
  ========================================================== */

  const reveal = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-white font-inter text-black">
      {isOpen && (
        <LeadCapturePopup
          showImages={true}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}

      {/* =====================================================
          HERO / BREADCRUMB
      ====================================================== */}

      <section className="h-18 bg-black md:h-24"></section>
      {/* <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-12">
          <Link
            to="/packages"
            className="group inline-flex items-center gap-2 text-sm font-bold text-black/60 font-inter transition hover:text-black"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            All packages
          </Link>
        </div>
      </section> */}

      {/* =====================================================
          MAIN
      ====================================================== */}

      <section className="px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* =================================================
              INTRO + BOOKING
          ================================================== */}

          <div className="mt-5 grid gap-12 sm:mt-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
            {/* LEFT */}
            <div className="min-w-0">
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                {/* Tags */}

                <motion.div
                  variants={reveal}
                  className="flex flex-wrap gap-2 font-inter font-medium"
                >
                  {themeName && (
                    <span className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white sm:px-4 sm:py-2">
                      <Sparkles size={12} />
                      {themeName}
                    </span>
                  )}

                  {/* {travellerTypeName && (
                    <span className="flex items-center gap-1.5 rounded-full border bg-black px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white">
                      <Users size={12} />
                      {travellerTypeName}
                    </span>
                  )} */}

                  {durationName && (
                    <span className="flex items-center gap-1.5 rounded-full bg-black border px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white sm:px-4 sm:py-2">
                      <Clock3 size={12} />
                      {durationName}
                    </span>
                  )}
                </motion.div>

                {/* Title */}

                <motion.h1
                  variants={reveal}
                  className="my-5 max-w-5xl break-words font-eb text-[clamp(1.6rem,5vw,2.8rem)] font-bold capitalize leading-[1.1] tracking-tight sm:my-7"
                >
                  {title}
                </motion.h1>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={reveal}
                >
                  <PackageGallery images={images} title={title} />
                </motion.div>
              </motion.div>

              {/* Package section navigation */}
              <nav
                aria-label="Package sections"
                className="sticky top-[58px] z-10 mt-6 w-full max-w-full rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md sm:top-[75px] sm:mt-10 sm:p-2.5"
              >
                <div className="no-scrollbar relative flex gap-2 overflow-x-auto scroll-smooth sm:gap-11">
                  {[
                    overview
                      ? { label: "Overview", id: "package-overview" }
                      : null,
                    itineraries.length > 0
                      ? {
                          label: "Itinerary",
                          id: "package-itinerary",
                          key: "itinerary",
                        }
                      : null,
                    hotels.length > 0
                      ? { label: "Hotels", id: "package-hotels", key: "hotels" }
                      : null,
                    flights.length > 0
                      ? {
                          label: "Flights",
                          id: "package-flights",
                          key: "flights",
                        }
                      : null,
                    inclusions.length > 0
                      ? {
                          label: "Inclusions",
                          id: "package-inclusions",
                          key: "included",
                        }
                      : null,
                    exclusions.length > 0
                      ? {
                          label: "Exclusions",
                          id: "package-exclusions",
                          key: "included",
                        }
                      : null,
                    {
                      label: "Terms & Conditions",
                      id: "package-terms",
                      key: "tandc",
                    },
                  ]
                    .filter(Boolean)
                    .map((item) => {
                      const isActiveTab =
                        activeSection === item.id ||
                        ((activeSection === "package-included-section" ||
                          activeSection === "package-inclusions" ||
                          activeSection === "package-exclusions") &&
                          (item.id === "package-inclusions" ||
                            item.id === "package-exclusions"));

                      return (
                        <button
                          key={item.id}
                          data-tab-id={item.id}
                          type="button"
                          onClick={() => {
                            setActiveSection(item.id);
                            scrollToPackageSection(item.id, item.key);
                          }}
                          className={`group relative shrink-0 whitespace-nowrap rounded-xl px-3 py-2.5 font-inter text-[13px] font-semibold transition-colors duration-300 focus-visible:outline-none sm:px-4 sm:py-3 sm:text-base ${
                            isActiveTab
                              ? "text-blue-500"
                              : "text-slate-600 hover:text-blue-500"
                          }`}
                        >
                          {item.label}

                          <span
                            className={`absolute bottom-1 left-3 h-[2px] rounded-full bg-blue-400 transition-all duration-300 sm:left-5 ${
                              isActiveTab
                                ? "w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)]"
                                : "w-0 group-hover:w-[calc(100%-1.5rem)] sm:group-hover:w-[calc(100%-2.5rem)]"
                            }`}
                          />
                        </button>
                      );
                    })}
                </div>
              </nav>

              {/* Overview */}

              {overview && (
                <motion.div variants={reveal} className="mt-6 sm:mt-7">
                  <CollapsibleSection
                    title="Overview"
                    sectionId="package-overview"
                    isOpen={openSections.overview}
                    onToggle={() => toggleSection("overview")}
                  >
                    <p className="max-w-3xl font-inter text-sm leading-7 text-slate-600 sm:text-base">
                      {overview}
                    </p>
                  </CollapsibleSection>
                </motion.div>
              )}
              {/* Itinerary */}

              {itineraries.length > 0 && (
                <CollapsibleSection
                  title="Day-wise itinerary"
                  sectionId="package-itinerary"
                  description="A closer look at how your trip unfolds."
                  isOpen={openSections.itinerary}
                  onToggle={() => toggleSection("itinerary")}
                  className="mt-5"
                >
                  <div className="relative py-2 font-inter sm:px-1 sm:py-3">
                    {/* Timeline rail */}
                    <div className="absolute bottom-7 left-[21px] top-7 hidden w-px bg-slate-200 sm:block" />

                    <div className="space-y-3 sm:space-y-5">
                      {itineraries.map((day, dayIndex) => (
                        <ItineraryDay
                          key={
                            day.id ??
                            `${day.dayNumber ?? dayIndex + 1}-${day.title}`
                          }
                          day={day}
                          dayIndex={dayIndex}
                        />
                      ))}
                    </div>
                  </div>
                </CollapsibleSection>
              )}

              {/* =================================================
    HOTELS
================================================== */}
              {/* {hotels.length > 0 && (
                <CollapsibleSection
                  title="Hotels"
                  description="Accommodation arranged as part of your journey."
                  isOpen={openSections.hotels}
                  onToggle={() => toggleSection("hotels")}
                  className="my-5"
                >
                  <div className="rounded-[28px] border border-black/10 p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                        <Hotel size={20} />
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                          Accommodation
                        </p>

                        <h3 className="mt-1 text-2xl font-black">Hotels</h3>
                      </div>
                    </div>

                    <div className="mt-7 space-y-3">
                      {hotels.map((hotel) => (
                        <div
                          key={hotel.id}
                          className="rounded-2xl bg-black/[0.035] p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-black">{hotel.hotelName}</h4>

                              <p className="mt-1 flex items-center gap-1.5 text-xs text-black/45">
                                <MapPin size={12} />
                                {hotel.city}
                              </p>
                            </div>

                            {hotel.starRating && (
                              <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
                                <Star size={12} fill="currentColor" />

                                {hotel.starRating}
                              </div>
                            )}
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <DateBox
                              label="Check in"
                              value={formatDate(hotel.checkIn)}
                            />

                            <DateBox
                              label="Check out"
                              value={formatDate(hotel.checkOut)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleSection>
              )} */}

              {hotels.length > 0 && (
                <CollapsibleSection
                  title="Hotels"
                  sectionId="package-hotels"
                  description="Explore your stays and accommodation details."
                  isOpen={openSections.hotels}
                  onToggle={() => toggleSection("hotels")}
                  className="mt-5"
                >
                  <div className="space-y-3 font-inter sm:space-y-4">
                    {hotels.map((hotel, hotelIndex) => (
                      <HotelCard key={hotel.id ?? hotelIndex} hotel={hotel} />
                    ))}
                  </div>
                </CollapsibleSection>
              )}
              {/* =================================================
    FLIGHTS
================================================== */}

              {flights.length > 0 && (
                <CollapsibleSection
                  title="Flights"
                  sectionId="package-flights"
                  description="View your flight schedules and journey details."
                  isOpen={openSections.flights}
                  onToggle={() => toggleSection("flights")}
                  className="mt-5"
                >
                  <div className="space-y-3 font-inter sm:space-y-4">
                    {flights.map((flight, flightIndex) => (
                      <FlightCard
                        key={flight.id ?? flightIndex}
                        flight={flight}
                      />
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {/* Inclusions / Exclusions */}
              {(inclusions.length > 0 || exclusions.length > 0) && (
                <CollapsibleSection
                  title="What's included"
                  sectionId="package-included-section"
                  description="Know exactly what is and isn't covered in your package."
                  isOpen={openSections.included}
                  onToggle={() => toggleSection("included")}
                  className="my-5"
                >
                  <div className="grid gap-5 md:grid-cols-2 md:gap-16">
                    {/* INCLUSIONS */}

                    {inclusions.length > 0 && (
                      <div
                        id="package-inclusions"
                        className="min-w-0 scroll-mt-36 rounded-[28px] bg-slate-900 p-5 text-white sm:p-7 lg:p-9"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-400 text-white">
                            <Check size={18} />
                          </div>

                          <h3 className="font-eb text-xl font-bold sm:text-2xl">
                            Included
                          </h3>
                        </div>

                        <div className="mt-5 space-y-4 font-inter sm:mt-7">
                          {inclusions.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-3 border-b border-white/10 pb-4 last:border-0"
                            >
                              <Check
                                size={16}
                                className="mt-0.5 shrink-0 text-green-500"
                              />

                              <p className="min-w-0 break-words text-sm leading-6 text-white">
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EXCLUSIONS */}

                    {exclusions.length > 0 && (
                      <div
                        id="package-exclusions"
                        className="min-w-0 scroll-mt-36 rounded-[28px] border border-slate-200 p-5 sm:p-7 lg:p-9"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                            <X size={18} />
                          </div>

                          <h3 className="font-eb text-xl font-bold sm:text-2xl">
                            Not included
                          </h3>
                        </div>

                        <div className="mt-5 space-y-4 font-inter sm:mt-7">
                          {exclusions.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-3 border-b border-slate-200 pb-4 last:border-0"
                            >
                              <X
                                size={16}
                                className="mt-0.5 shrink-0 text-red-500"
                              />

                              <p className="min-w-0 break-words text-sm leading-6 text-slate-800">
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              )}
              <CollapsibleSection
                title="Terms and Conditions"
                sectionId="package-terms"
                description="By proceeding with the booking, you agree to our Terms & Conditions, including applicable payment, cancellation, refund, and service policies."
                isOpen={openSections.tandc}
                onToggle={() => toggleSection("tandc")}
                className="my-5"
              >
                <p className="h-10">
                  <Link
                    to="/terms-conditions"
                    className="inline-block rounded-lg bg-blue-400 px-6 py-2 font-inter text-sm font-semibold text-white transition-colors hover:bg-blue-500 sm:text-base"
                  >
                    Terms and Conditions
                  </Link>
                </p>
              </CollapsibleSection>
            </div>

            {/* RIGHT — BOOKING CARD */}
            <div>
              <motion.aside
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                }}
                className="
      font-inter

      fixed bottom-0 left-0 right-0 z-20
      lg:sticky lg:top-8 lg:right-80 lg:mb-5
    "
              >
                <div
                  className="
        overflow-hidden bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.12)]
        lg:rounded-[30px] lg:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
      "
                >
                  {/* MOBILE / TABLET */}
                  <div className="flex items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-4 lg:hidden">
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-black/40"></p>

                      <div className="mt-0.5 flex items-baseline gap-2">
                        <span className="truncate text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                          ₹{starting.toLocaleString("en-IN")}
                        </span>

                        {hasDiscount && (
                          <span className="text-xs font-bold text-black/30 line-through">
                            ₹{finalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsOpen(true)}
                      className="
            flex shrink-0 items-center gap-2 rounded-full
            bg-blue-400 px-4 py-2.5 text-xs font-semibold
            text-white transition-all duration-300
            hover:bg-blue-500 hover:shadow-xl sm:px-5 sm:py-3
          "
                    >
                      <Phone size={15} />
                      <span>Book Now</span>
                    </button>
                  </div>

                  {/* DESKTOP */}
                  <div className="hidden lg:block">
                    <div className="bg-black/90 px-7 py-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                            Package price
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white/75">
                            Per traveller
                          </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                          <Plane size={17} />
                        </div>
                      </div>
                    </div>

                    <div className="p-7">
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-semibold tracking-[-0.04em]">
                          ₹{finalPrice.toLocaleString("en-IN")}
                        </span>

                        {hasDiscount && (
                          <span className="mb-1 text-sm font-bold text-black/30 line-through">
                            ₹{starting.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {hasDiscount && (
                        <div className="mt-3 inline-flex rounded-full bg-yellow-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">
                          Save {discountPercentage}%
                        </div>
                      )}

                      <div className="my-7 h-px bg-black/10" />

                      <div className="space-y-4">
                        <BookingRow label="Duration" value={durationName} />

                        {/* <BookingRow
                          label="Traveller"
                          value={travellerTypeName}
                        /> */}

                        <BookingRow
                          label="Destinations"
                          value={`${destinations.length} places`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="
              group mt-7 flex w-full items-center justify-center
              gap-2 rounded-full bg-blue-400 px-6 py-4
              text-sm font-semibold text-white
              transition-all duration-300 hover:bg-blue-500 hover:shadow-xl
            "
                      >
                        <span className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1">
                          <Phone size={17} />
                        </span>

                        <span>Plan this trip</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   ITINERARY / HOTEL / FLIGHT CARDS
============================================================ */

// One activity: with a photo -> photo card, without a photo -> icon + text only
function ActivityItem({ activity }) {
  const [imageFailed, setImageFailed] = useState(false);

  const isObject = typeof activity === "object" && activity !== null;
  const name = activityName(activity);
  const imageSrc = isObject ? pickImage(activity, ACTIVITY_IMAGE_KEYS) : "";
  const showImage = Boolean(imageSrc) && !imageFailed;

  const description = isObject ? activity.description || activity.details : "";
  const startTime = isObject ? activity.startTime || activity.time : "";
  const rawDuration = isObject
    ? (activity.durationMinutes ?? activity.duration)
    : null;
  const hasDuration =
    rawDuration !== null &&
    rawDuration !== undefined &&
    rawDuration !== "" &&
    Number(rawDuration) !== 0;

  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2 transition-colors hover:border-blue-300 sm:gap-4 sm:p-3">
      {showImage ? (
        <img
          src={imageSrc}
          alt={name}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="size-16 shrink-0 rounded-xl object-cover min-[400px]:size-[76px] sm:size-[84px]"
        />
      ) : (
        <Compass size={20} className="ml-1 shrink-0 text-blue-500 sm:ml-1.5" />
      )}

      <div className="min-w-0 flex-1 py-0.5">
        <h4 className="break-words text-sm font-semibold text-slate-900 sm:text-[15px]">
          {name}
        </h4>

        {description && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">
            {description}
          </p>
        )}

        {(hasDuration || startTime) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 sm:text-xs">
            {hasDuration && (
              <span className="inline-flex items-center gap-1">
                <Clock3 size={12} className="text-blue-500" />
                {typeof rawDuration === "number"
                  ? `${rawDuration} minutes`
                  : rawDuration}
              </span>
            )}

            {startTime && <span>{startTime}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function ItineraryDay({ day, dayIndex }) {
  const activities = Array.isArray(day.activities) ? day.activities : [];
  const location = day.overnightLocation || day.destination || day.location;
  const hotelName =
    day.hotelName ||
    day.accommodationName ||
    day.hotel?.hotelName ||
    day.hotel?.name;
  const mealsText = formatValue(day.meals);
  const hasMeals = mealsText !== "—";
  const dayInclusions = Array.isArray(day.inclusions) ? day.inclusions : [];

  return (
    <div className="relative grid grid-cols-[30px_minmax(0,1fr)] gap-1.5 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-3">
      {/* Number on the vertical timeline */}
      <div className="relative z-10 flex justify-center pt-4 sm:pt-6">
        <div className="flex size-7 items-center justify-center rounded-full bg-blue-400 text-xs font-semibold text-white shadow-sm sm:size-9 sm:text-sm">
          {day.dayNumber ?? dayIndex + 1}
        </div>
      </div>

      {/* Day card */}
      <details
        open={dayIndex === 0}
        className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors duration-300 open:border-blue-300 hover:border-blue-300"
      >
        <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3.5 marker:hidden sm:px-4 sm:py-4 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0 flex-1">
            <h3 className="break-words font-eb text-base font-bold leading-snug text-slate-900 sm:text-xl">
              {day.title || `Day ${day.dayNumber ?? dayIndex + 1}`}
            </h3>
          </div>

          {location && (
            <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 md:flex">
              <MapPin size={13} className="text-blue-500" />
              <span className="max-w-28 truncate">{location}</span>
            </div>
          )}

          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-transform duration-300 group-open:rotate-180">
            <ChevronDown size={16} />
          </div>
        </summary>

        {location && (
          <div className="flex items-center gap-1.5 px-3 pb-3 text-xs font-medium text-slate-500 sm:px-4 md:hidden">
            <MapPin size={13} className="shrink-0 text-blue-500" />
            <span className="min-w-0 break-words">{location}</span>
          </div>
        )}

        <div className="space-y-4 border-t border-slate-100 px-3 pb-4 pt-4 sm:space-y-5 sm:px-5 sm:pb-6 sm:pt-5">
          {day.description && (
            <p className="text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
              {day.description}
            </p>
          )}

          {/* 1. Accommodation — hotel name + icon (no photo here) */}
          {hotelName && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 sm:px-4">
              <Hotel size={20} className="shrink-0 text-blue-500" />

              <div className="min-w-0 flex-1">
                <p className={MICRO_LABEL}>Accommodation</p>
                <p className="mt-0.5 break-words text-sm font-medium text-slate-900 sm:text-[15px]">
                  {hotelName}
                </p>
              </div>
            </div>
          )}

          {/* 2. Activities — photo card if a photo exists, else icon + text */}
          {activities.length > 0 && (
            <div>
              <p className={`${MICRO_LABEL} mb-2.5`}>Activities</p>

              <div className="space-y-2.5 sm:space-y-3">
                {activities.map((activity, activityIndex) => (
                  <ActivityItem
                    key={
                      activity?.id ?? `${day.id ?? dayIndex}-${activityIndex}`
                    }
                    activity={activity}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3. Meals */}
          {hasMeals && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 sm:px-4">
              <Utensils size={20} className="shrink-0 text-blue-500" />

              <div className="min-w-0 flex-1">
                <p className={MICRO_LABEL}>Meals</p>
                <p className="mt-0.5 break-words text-sm capitalize text-slate-900 sm:text-[15px]">
                  {mealsText}
                </p>
              </div>
            </div>
          )}

          {/* Any extra per-day inclusions from the backend */}
          {dayInclusions.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {dayInclusions.map((item, index) => (
                <span
                  key={index}
                  className="break-words rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                >
                  {formatValue(item)}
                </span>
              ))}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

// Hotel: photo box if the backend sends a photo, otherwise icon + name
function HotelCard({ hotel }) {
  const [imageFailed, setImageFailed] = useState(false);

  const name = hotel.hotelName || hotel.name || hotel.title || "Hotel";
  const imageSrc = pickImage(hotel, HOTEL_IMAGE_KEYS);
  const showImage = Boolean(imageSrc) && !imageFailed;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-blue-300 sm:gap-4 sm:p-4">
      {showImage ? (
        <img
          src={imageSrc}
          alt={name}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="size-16 shrink-0 rounded-xl object-cover min-[400px]:size-20 sm:size-24"
        />
      ) : (
        <Hotel size={22} className="shrink-0 text-blue-500" />
      )}

      <div className="min-w-0 flex-1">
        <h3 className="break-words text-sm font-semibold text-slate-900 sm:text-base">
          {name}
        </h3>

        {hotel.city && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
            <MapPin size={13} className="shrink-0 text-blue-500" />
            <span className="min-w-0 break-words">{hotel.city}</span>
          </p>
        )}
      </div>

      {hotel.starRating != null && (
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1.5 sm:px-3 sm:py-2">
          <Star size={14} className="fill-amber-400 text-amber-500" />
          <span className="text-sm">{hotel.starRating}</span>
        </div>
      )}
    </div>
  );
}

// Flight: airline logo if the backend sends one, otherwise a plane icon
function FlightCard({ flight }) {
  const [logoFailed, setLogoFailed] = useState(false);

  const airline = flight.airline || "Airline not specified";
  const logoSrc = pickImage(flight, FLIGHT_LOGO_KEYS);
  const showLogo = Boolean(logoSrc) && !logoFailed;

  return (
    <div className="rounded-xl border border-slate-200 p-3.5 transition-colors hover:border-blue-300 sm:p-5">
      {/* Airline */}
      <div className="flex items-center gap-3">
        {showLogo ? (
          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 sm:size-12">
            <img
              src={logoSrc}
              alt={airline}
              loading="lazy"
              onError={() => setLogoFailed(true)}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <Plane size={22} className="shrink-0 text-blue-500" />
        )}

        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-slate-900 sm:text-lg">
            {airline}
          </h3>

          <p className="mt-0.5 break-words text-xs text-slate-500">
            Flight No: {flight.flightNumber || "Not specified"}
          </p>
        </div>
      </div>

      {/* Route */}
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:mt-5 sm:gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-slate-900">
            {flight.fromLocation || "--"}
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Departure
          </p>

          <p className="mt-1 break-words text-[11px] font-medium text-slate-600 sm:text-xs">
            {flight.departureTime
              ? formatDateTime(flight.departureTime)
              : "Time not specified"}
          </p>
        </div>

        <div className="flex w-8 flex-col items-center gap-1 min-[400px]:w-12 sm:w-16">
          <Plane size={18} className="text-blue-400" />
          <div className="w-full border-t border-dashed border-slate-300" />
        </div>

        <div className="min-w-0 text-right">
          <p className="break-words text-sm font-semibold text-slate-900">
            {flight.toLocation || "--"}
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Arrival
          </p>

          <p className="mt-1 break-words text-[11px] font-medium text-slate-600 sm:text-xs">
            {flight.arrivalTime
              ? formatDateTime(flight.arrivalTime)
              : "Time not specified"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function CollapsibleSection({
  title,
  description,
  sectionId,
  isOpen,
  onToggle,
  children,
  className = "",
}) {
  return (
    <section
      id={sectionId}
      className={`scroll-mt-36 border-t border-slate-200 pt-5 ${className}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 text-left sm:gap-4"
      >
        <div className="min-w-0 max-w-2xl">
          <h2 className="font-eb text-xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>

          {description && (
            <p className="mt-1 font-inter text-[13px] leading-6 text-slate-500 sm:text-base sm:leading-7">
              {description}
            </p>
          )}
        </div>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={16} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function BookingRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-sm text-black/45">{label}</span>

      <span className="text-right text-sm font-bold">{value || "—"}</span>
    </div>
  );
}

export default PackageDetails;
