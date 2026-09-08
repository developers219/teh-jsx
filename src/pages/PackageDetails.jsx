import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Hotel,
  MapPin,
  Plane,
  Sparkles,
  Star,
  Users,
  X,
  Phone,
} from "lucide-react";

import api from "../services/api";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

import Skeleton from "@mui/material/Skeleton";

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
      <div className="flex h-[500px] items-center justify-center rounded-[28px] bg-slate-100">
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
      prev === 0 ? normalizedImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setModalIndex((prev) =>
      prev === normalizedImages.length - 1 ? 0 : prev + 1
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
              LEFT THUMBNAILS
          ================================================== */}

          <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
            {visibleThumbnails.map((image, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`group relative h-[76px] min-w-[92px] overflow-hidden rounded-2xl border transition-all duration-300 md:h-[88px] md:min-w-0 ${
                    isActive
                      ? "border-black ring-2 ring-black ring-offset-2"
                      : "border-black/10 hover:border-black/40"
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
                className="group relative h-[76px] min-w-[92px] overflow-hidden rounded-2xl border border-black/10 bg-black md:h-[88px] md:min-w-0"
              >
                <img
                  src={normalizedImages[4]}
                  alt="View all gallery images"
                  className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-50"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-lg font-black">
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
                className="flex h-[76px] min-w-[92px] items-center justify-center rounded-2xl border border-black bg-black text-white transition hover:bg-white hover:text-black md:h-[88px] md:min-w-0"
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

          <div className="group relative order-1 min-h-[360px] overflow-hidden rounded-[28px] bg-slate-100 md:order-2 md:h-[500px]">
            <img
              src={normalizedImages[activeIndex]}
              alt={`${title} - image ${activeIndex + 1}`}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.015]"
            />

            {/* Bottom gradient */}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Image counter */}

            <div className="absolute bottom-5 left-5 rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
              {activeIndex + 1} / {normalizedImages.length}
            </div>

            {/* Expand button */}

            <button
              type="button"
              onClick={() => openModal(activeIndex)}
              aria-label="Open gallery"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white"
            >
              <ZoomInIcon fontSize="small" />
            </button>

            {/* Previous / Next */}

            {normalizedImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      activeIndex === 0
                        ? normalizedImages.length - 1
                        : activeIndex - 1
                    )
                  }
                  aria-label="Previous image"
                  className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-lg transition duration-300 hover:scale-105 group-hover:opacity-100"
                >
                  <ChevronLeftIcon />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      activeIndex === normalizedImages.length - 1
                        ? 0
                        : activeIndex + 1
                    )
                  }
                  aria-label="Next image"
                  className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-lg transition duration-300 hover:scale-105 group-hover:opacity-100"
                >
                  <ChevronRightIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          FULLSCREEN GALLERY MODAL
      ====================================================== */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 sm:p-6"
          onClick={closeModal}
        >
          <div
            className="relative flex h-full w-full max-w-7xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex items-center justify-between pb-4">
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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
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
                className="max-h-full max-w-full rounded-2xl object-contain"
              />

              {/* Previous */}

              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous image"
                className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:left-4"
              >
                <ChevronLeftIcon />
              </button>

              {/* Next */}

              <button
                type="button"
                onClick={goToNext}
                aria-label="Next image"
                className="absolute right-0 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:right-4"
              >
                <ChevronRightIcon />
              </button>
            </div>

            {/* =================================================
                THUMBNAIL CAROUSEL
            ================================================== */}

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {normalizedImages.map((image, index) => {
                const isActive = modalIndex === index;

                return (
                  <button
                    key={`${image}-modal-${index}`}
                    type="button"
                    onClick={() => setModalIndex(index)}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border transition duration-300 ${
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

        const response = await api.get(`/packages/${slug}`);

        console.log(response);

        setTravelPackage(response.data.data);
      } catch (error) {
        console.error(error);

        setErrorMessage(
          "We could not load this package right now. Please try again later."
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

          <div className="mt-8">
            <Skeleton variant="rounded" height={540} sx={{ borderRadius: 4 }} />
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
            <div>
              <Skeleton variant="text" height={80} width="75%" />
              <Skeleton variant="text" height={30} width="90%" />
              <Skeleton variant="text" height={30} width="70%" />

              <div className="mt-8">
                <Skeleton variant="rounded" height={180} />
              </div>
            </div>

            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 4 }} />
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
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/40">
            Something went wrong
          </p>

          <h1 className="mt-3 text-3xl font-black">Package unavailable</h1>

          <p className="mt-3 text-sm text-black/50">{errorMessage}</p>

          <Link
            to="/packages"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-black/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-black/20"
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
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-black/50">
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
    travellerTypeName,
    durationName,
    durationDaysCount,
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
    <main className="min-h-screen mt-16 bg-white text-black">
      {/* =====================================================
          HERO / BREADCRUMB
      ====================================================== */}

      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-12">
          <Link
            to="/packages"
            className="group inline-flex items-center gap-2 text-sm font-bold text-black/60 transition hover:text-black"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            All packages
          </Link>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <section className="px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-7xl">
          {/* =================================================
              GALLERY
          ================================================== */}

          <motion.div initial="hidden" animate="visible" variants={reveal}>
            <PackageGallery images={images} title={title} />
          </motion.div>

          {/* =================================================
              INTRO + BOOKING
          ================================================== */}

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
            {/* LEFT */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              {/* Tags */}

              <motion.div variants={reveal} className="flex flex-wrap gap-2">
                {themeName && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                    <Sparkles size={12} />
                    {themeName}
                  </span>
                )}

                {travellerTypeName && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em]">
                    <Users size={12} />
                    {travellerTypeName}
                  </span>
                )}

                {durationName && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-black/60">
                    <Clock3 size={12} />
                    {durationName}
                  </span>
                )}
              </motion.div>

              {/* Title */}

              <motion.h1
                variants={reveal}
                className="mt-7 max-w-5xl text-[clamp(2.8rem,7vw,6.8rem)] font-black leading-[0.9] tracking-[-0.06em]"
              >
                {title}
              </motion.h1>

              {/* Overview */}

              {overview && (
                <motion.p
                  variants={reveal}
                  className="mt-7 max-w-3xl text-base leading-8 text-black/55 sm:text-lg"
                >
                  {overview}
                </motion.p>
              )}

              {/* Quick stats */}

              <motion.div
                variants={reveal}
                className="mt-10 grid grid-cols-2 border-y border-black/10 sm:grid-cols-3"
              >
                <QuickStat
                  icon={<CalendarDays size={18} />}
                  label="Duration"
                  value={durationName || `${durationDaysCount} Days`}
                />

                <QuickStat
                  icon={<Users size={18} />}
                  label="Designed for"
                  value={travellerTypeName || "Travellers"}
                />

                <QuickStat
                  icon={<Compass size={18} />}
                  label="Destinations"
                  value={`${destinations.length} places`}
                />
              </motion.div>
            </motion.div>

            {/* =================================================
                BOOKING CARD
            ================================================== */}

            <motion.aside
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="lg:sticky lg:top-8 lg:self-start"
            >
              <div className="overflow-hidden rounded-[30px] border border-black bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <div className="bg-black px-7 py-6 text-white">
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
                    <span className="text-4xl font-black tracking-[-0.04em]">
                      ₹{finalPrice.toLocaleString("en-IN")}
                    </span>

                    {hasDiscount && (
                      <span className="mb-1 text-sm font-bold text-black/30 line-through">
                        ₹{starting.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <div className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                      Save {discountPercentage}%
                    </div>
                  )}

                  <div className="my-7 h-px bg-black/10" />

                  <div className="space-y-4">
                    <BookingRow label="Duration" value={durationName} />

                    <BookingRow label="Traveller" value={travellerTypeName} />

                    <BookingRow
                      label="Destinations"
                      value={`${destinations.length} places`}
                    />
                  </div>

                  <Link
                    to={`/booking/${travelPackage.id}`}
                    className="group mt-7 flex w-full items-center justify-between rounded-full bg-gray-100 px-6 py-4 text-sm font-black text-white transition-all duration-300 hover:shadow-xl"
                  >
                    <span>Plan this trip</span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight size={17} />
                    </span>
                  </Link>

                  <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-black/40">
                    <Phone size={13} />
                    Talk to our travel experts
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>

          {/* =====================================================
              DESTINATIONS
          ====================================================== */}

          {destinations.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="mt-24 border-t border-black/10 pt-14"
            >
              <SectionHeading
                eyebrow="Where you'll go"
                title="Destinations"
                description="Explore the places that make this journey special."
              />

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {destinations.map((destination, index) => (
                  <motion.div
                    key={`${destination.destinationId}-${index}`}
                    variants={reveal}
                    className="group relative overflow-hidden rounded-[26px] border border-black/10 p-6 transition-all duration-500 hover:border-black hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                          <MapPin size={19} />
                        </div>

                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.15em] text-black/35">
                            {destination.categoryName}
                          </p>

                          <h3 className="mt-1 text-xl font-black">
                            {destination.destinationName}
                          </h3>
                        </div>
                      </div>

                      {destination.isPrimary === 1 && (
                        <span className="rounded-full bg-black px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
                      <span className="text-xs text-black/40">
                        {destination.destinationSlug}
                      </span>

                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* =====================================================
              ITINERARY
          ====================================================== */}

          {itineraries.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="mt-24 border-t border-black/10 pt-14"
            >
              <SectionHeading
                eyebrow="Your journey"
                title="Day by day"
                description="A closer look at how your trip unfolds."
              />

              <div className="relative mt-12">
                {/* Timeline line */}

                <div className="absolute left-[23px] top-0 hidden h-full w-px bg-black/10 md:block" />

                <div className="space-y-5">
                  {itineraries.map((day, index) => (
                    <motion.div
                      key={day.id}
                      variants={reveal}
                      className="relative grid gap-5 md:grid-cols-[48px_1fr]"
                    >
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black text-xs font-black text-white">
                        {String(day.dayNumber).padStart(2, "0")}
                      </div>

                      <div className="rounded-[26px] border border-black/10 p-6 transition hover:border-black/30 hover:shadow-lg sm:p-7">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                              Day {day.dayNumber}
                            </p>

                            <h3 className="mt-1 text-2xl font-black tracking-tight">
                              {day.title}
                            </h3>
                          </div>

                          {day.overnightLocation && (
                            <div className="flex h-fit items-center gap-2 rounded-full bg-black/[0.04] px-4 py-2 text-xs font-bold">
                              <MapPin size={13} />
                              {day.overnightLocation}
                            </div>
                          )}
                        </div>

                        {day.description && (
                          <p className="mt-5 max-w-3xl text-sm leading-7 text-black/55">
                            {day.description}
                          </p>
                        )}

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          {day.hotelName && (
                            <InfoPill
                              icon={<Hotel size={15} />}
                              label="Stay"
                              value={day.hotelName}
                            />
                          )}

                          {day.meals && (
                            <InfoPill
                              icon={<Check size={15} />}
                              label="Meals"
                              value={day.meals}
                            />
                          )}
                        </div>

                        {day.activities?.length > 0 && (
                          <div className="mt-6 border-t border-black/10 pt-5">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                              Activities
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {day.activities.map((activity) => (
                                <span
                                  key={activity.id}
                                  className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold"
                                >
                                  {activity.title ||
                                    activity.name ||
                                    "Activity"}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* =====================================================
              HOTELS + FLIGHTS
          ====================================================== */}

          {(hotels.length > 0 || flights.length > 0) && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="mt-24 border-t border-black/10 pt-14"
            >
              <SectionHeading
                eyebrow="Travel essentials"
                title="Stay & travel"
                description="Everything arranged as part of your journey."
              />

              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                {/* HOTELS */}

                {hotels.length > 0 && (
                  <motion.div
                    variants={reveal}
                    className="rounded-[28px] border border-black/10 p-6 sm:p-8"
                  >
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
                  </motion.div>
                )}

                {/* FLIGHTS */}

                {flights.length > 0 && (
                  <motion.div
                    variants={reveal}
                    className="rounded-[28px] border border-black/10 p-6 sm:p-8"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                        <Plane size={20} />
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                          Transportation
                        </p>

                        <h3 className="mt-1 text-2xl font-black">Flights</h3>
                      </div>
                    </div>

                    <div className="mt-7 space-y-3">
                      {flights.map((flight) => (
                        <div
                          key={flight.id}
                          className="rounded-2xl bg-black/[0.035] p-5"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-black">
                                {flight.airline}
                              </p>

                              <p className="mt-1 text-[11px] text-black/40">
                                {flight.flightNumber}
                              </p>
                            </div>

                            <Plane size={17} />
                          </div>

                          <div className="mt-6 flex items-center gap-4">
                            <div>
                              <p className="text-lg font-black">
                                {flight.fromLocation}
                              </p>

                              <p className="mt-1 text-[10px] uppercase tracking-wider text-black/35">
                                Departure
                              </p>

                              <p className="mt-1 text-xs font-semibold text-black/55">
                                {formatDateTime(flight.departureTime)}
                              </p>
                            </div>

                            <div className="flex flex-1 items-center">
                              <div className="h-px flex-1 bg-black/15" />

                              <div className="mx-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                                <ArrowRight size={13} />
                              </div>

                              <div className="h-px flex-1 bg-black/15" />
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-black">
                                {flight.toLocation}
                              </p>

                              <p className="mt-1 text-[10px] uppercase tracking-wider text-black/35">
                                Arrival
                              </p>

                              <p className="mt-1 text-xs font-semibold text-black/55">
                                {formatDateTime(flight.arrivalTime)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}

          {/* =====================================================
              INCLUSIONS / EXCLUSIONS
          ====================================================== */}

          {(inclusions.length > 0 || exclusions.length > 0) && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="mt-24 border-t border-black/10 pt-14"
            >
              <SectionHeading
                eyebrow="Good to know"
                title="What's included"
                description="Know exactly what is and isn't covered in your package."
              />

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {/* INCLUSIONS */}

                {inclusions.length > 0 && (
                  <motion.div
                    variants={reveal}
                    className="rounded-[28px] bg-black p-7 text-white sm:p-9"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                        <Check size={18} />
                      </div>

                      <h3 className="text-xl font-black">Included</h3>
                    </div>

                    <div className="mt-7 space-y-4">
                      {inclusions.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 border-b border-white/10 pb-4 last:border-0"
                        >
                          <Check
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-400"
                          />

                          <p className="text-sm leading-6 text-white/70">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* EXCLUSIONS */}

                {exclusions.length > 0 && (
                  <motion.div
                    variants={reveal}
                    className="rounded-[28px] border border-black/10 p-7 sm:p-9"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                        <X size={18} />
                      </div>

                      <h3 className="text-xl font-black">Not included</h3>
                    </div>

                    <div className="mt-7 space-y-4">
                      {exclusions.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 border-b border-black/10 pb-4 last:border-0"
                        >
                          <X
                            size={16}
                            className="mt-0.5 shrink-0 text-red-500"
                          />

                          <p className="text-sm leading-6 text-black/55">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}

          {/* =====================================================
              FINAL CTA
          ====================================================== */}

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative mt-24 overflow-hidden rounded-[34px] bg-black px-7 py-14 text-white sm:px-12 sm:py-20"
          >
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <Sparkles size={13} />
                Make it yours
              </div>

              <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl">
                Ready to experience{" "}
                <span className="text-white/35">{title}?</span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Tell us your preferred dates and requirements. Our travel
                experts can customise this journey around the way you want to
                travel.
              </p>

              <Link
                to={`/booking/${travelPackage.id}`}
                className="group mt-8 inline-flex items-center gap-4 rounded-full bg-white/20 px-7 py-4 text-sm font-black text-black transition hover:shadow-2xl"
              >
                Start planning
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={15} />
                </span>
              </Link>
            </div>

            <div className="pointer-events-none absolute -bottom-24 -right-10 select-none text-[170px] font-black leading-none tracking-[-0.08em] text-white/[0.035] sm:text-[240px]">
              GO
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function QuickStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-r border-black/10 px-1 py-6 first:pl-0 last:border-r-0 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/35">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-bold sm:text-sm">{value}</p>
      </div>
    </div>
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

function InfoPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3">
      <div className="text-black/50">{icon}</div>

      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/35">
          {label}
        </p>

        <p className="truncate text-xs font-bold">{value}</p>
      </div>
    </div>
  );
}

function DateBox({ label, value }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-3">
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold">{value}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/35">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-sm leading-7 text-black/50 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   DATE HELPERS
============================================================ */

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default PackageDetails;
