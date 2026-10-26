import { useEffect, useState } from "react";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../../services/api";
import Modal from "../ui/Modal";
import Carousel from "../ui/Carousel";

export default function TravelReviews() {
  const [reviews, setReviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);

  /* =====================================================
      FETCH REVIEWS
  ====================================================== */

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/reviews");

        console.log(res.data.data);

        setReviews(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="relative bg-white py-10 sm:py-14 lg:py-32">
      {/* =====================================================
            BACKGROUND
        ====================================================== */}

      {/*
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://plus.unsplash.com/premium_photo-1667354154657-5adc088ed55a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHJldmlld3N8ZW58MHx8MHx8fDA%3D)",
          }}
        />
      */}

      {/*
        Dark background overlay
        <div className="absolute inset-0 bg-slate-950/55" />
      */}

      {/* =====================================================
            MAIN CONTAINER
        ====================================================== */}

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="relative overflow-visible rounded-[24px] bg-black shadow-[0_25px_70px_rgba(0,0,0,0.30)]">
          <div className="flex flex-col lg:flex-row">
            {/* =================================================
                LEFT BLUE PANEL
            ================================================= */}

            <div className="relative flex flex-col justify-center overflow-hidden rounded-t-[24px] px-7 py-9 sm:px-10 lg:rounded-l-[24px] lg:rounded-tr-none lg:px-9">
              {/* Decorative circles */}

              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/5" />

              <div className="absolute -bottom-28 -left-24 h-64 w-64 rounded-full border-[40px] border-white/5" />

              {/* Quote */}

              <div className="relative mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[white] text-blue-400 shadow-[0_8px_25px_rgba(0,0,0,0.20)]">
                <FormatQuoteIcon
                  sx={{
                    fontSize: 52,
                    color: "blue-400",
                  }}
                />
              </div>

              {/* Heading */}

              <h2 className="relative font-eb text-[30px] font-bold leading-[1.08] text-white sm:text-[34px]">
                What Our
                <span className="block">Travelers Say</span>
              </h2>

              {/* Description */}

              <p className="relative mt-5 max-w-[250px] font-inter text-[14px] leading-6 text-blue-100">
                Real experiences from travelers who explored the world with us.
                Discover why thousands of travelers trust us with their
                holidays.
              </p>

              {/* Rating */}

              <div className="relative mt-5 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      sx={{
                        fontSize: 17,
                        color: "#fbbf24",
                      }}
                    />
                  ))}
                </div>

                <span className="text-sm font-semibold font-inter text-white">
                  4.9/5
                </span>
              </div>

              <p className="relative mt-1 text-xs font-inter text-blue-200">
                Based on 500+ traveler reviews
              </p>

              {/* Read More */}

              <button
                type="button"
                className="relative mt-6 flex w-fit items-center gap-2 text-sm font-semibold bg-blue-400 p-3 px-6 rounded-full cursor-pointer transition-colors font-inter text-white hover:bg-blue-500"
              >
                Read More
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#063b72]">
                  <ArrowForwardIosIcon sx={{ fontSize: 8 }} />
                </span>
              </button>
            </div>

            {isOpen && selectedReview && (
              <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className="w-[50vw] bg-white font-inter">
                  {/* Image carousel */}

                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={selectedReview?.images?.[currentImage]?.imageUrl}
                      alt={`${selectedReview.userName}'s travel experience`}
                      className="h-full w-full object-cover"
                    />

                    {/* Previous */}

                    <button
                      onClick={() =>
                        setCurrentImage((prev) =>
                          prev === 0
                            ? selectedReview?.images?.length - 1
                            : prev - 1,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white backdrop-blur-sm"
                    >
                      ←
                    </button>

                    {/* Next */}

                    <button
                      onClick={() =>
                        setCurrentImage(
                          (prev) => (prev + 1) % selectedReview?.images?.length,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white backdrop-blur-sm"
                    >
                      →
                    </button>

                    {/* Dots */}

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {selectedReview?.images?.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`h-1.5 rounded-full transition-all ${
                            index === currentImage
                              ? "w-6 bg-white"
                              : "w-1.5 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* User information */}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-eb text-xl font-medium text-gray-900">
                          {selectedReview?.userName}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {selectedReview?.destination ?? "Bali"}
                        </p>
                      </div>

                      {/* Rating */}

                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900">
                          {selectedReview.rating}
                        </span>

                        <span className="text-amber-500">★</span>
                      </div>
                    </div>

                    {/* Destination */}

                    <p className="mt-4 text-sm text-gray-500">
                      Travelled to{" "}
                      <span className="font-medium text-gray-900">
                        {selectedReview?.destination ?? "Bali"}
                      </span>
                    </p>

                    {/* Divider */}

                    <div className="my-5 border-t border-gray-200" />

                    {/* Description */}

                    <p className="text-[15px] leading-7 text-gray-600">
                      {selectedReview?.description}
                    </p>
                  </div>
                </div>
              </Modal>
            )}

            {/* =================================================
                RIGHT CAROUSEL (ui/Carousel)
            ================================================= */}

            <div className="lg:absolute right-0 bottom-12 w-full lg:w-2/3 min-w-0 rounded-b-[24px] px-4 pb-8 pt-8 sm:px-7 lg:rounded-r-[24px] lg:rounded-bl-none lg:px-6">
              <Carousel
                items={reviews}
                desktopItems={2}
                tabletItems={2}
                mobileItems={1}
                gap={16}
                showArrows={true}
                renderItem={(review) => (
                  /* =================================================
                        LARGE REVIEW CARD
                    ================================================= */

                  <article className="relative font-inter h-[420px] flex flex-col justify-between overflow-hidden rounded-[20px] bg-white">
                    {/* Customer Image */}

                    <div className="relative h-[170px] overflow-hidden">
                      <img
                        src={
                          review?.images?.[0]?.imageUrl ??
                          "https://i.pravatar.cc/400?img=12"
                        }
                        alt={review?.userName}
                        className="h-full w-full object-cover"
                      />

                      {/* Image gradient */}

                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>

                    {/* =================================================
                        CARD CONTENT
                    ================================================= */}

                    <div className="relative px-5 pb-5 pt-7">
                      {/* Straight white transition */}

                      <div className="absolute left-0 right-0 top-0 h-5 bg-white" />

                      {/* Quote */}

                      <FormatQuoteIcon
                        className="absolute right-4 top-3"
                        sx={{
                          fontSize: 44,
                          color: "#17694d",
                          opacity: 0.1,
                        }}
                      />

                      {/* Review */}

                      <p className="relative mt-3 min-h-[105px] text-[13px] leading-[1.55] text-slate-600">
                        {review?.description?.slice(0, 200)}

                        <span
                          className="text-blue-400"
                          onClick={() => {
                            setSelectedReview(review);
                            setCurrentImage(0);
                            setIsOpen(true);
                          }}
                        >
                          {review?.description?.length >= 300 ? (
                            <a className="text-blue-400 cursor-pointer font-bold">
                              ... Read More
                            </a>
                          ) : (
                            ""
                          )}
                        </span>
                      </p>

                      {/* Bottom */}

                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                        {/* Customer */}

                        <div>
                          <h4 className="font-eb text-sm font-bold text-slate-900">
                            {review?.userName}
                          </h4>

                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {review?.location ?? "Bali"}
                          </p>
                        </div>

                        {/* Stars */}

                        <div className="flex shrink-0">
                          {[...new Array(review?.rating)].map((star, index) => (
                            <StarIcon
                              key={index}
                              sx={{
                                fontSize: 16,
                                color: "#f59e0b",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}