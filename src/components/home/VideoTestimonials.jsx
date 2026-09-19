import { useCallback, useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SectionHeader from "./SectionHeader";

const videos = [
  {
    id: 1,
    title: "Family holiday experience",
    customer: "Happy Family",
    location: "Dubai & Abu Dhabi",
    thumbnail:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    videoUrl: "YOUR_DUBAI_VIDEO_URL",
  },
  {
    id: 2,
    title: "Honeymoon trip review",
    customer: "Happy Couple",
    location: "Bali",
    thumbnail:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
    videoUrl: "YOUR_DUBAI_VIDEO_URL",
  },
  {
    id: 3,
    title: "Group tour feedback",
    customer: "Happy Traveller",
    location: "Thailand",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    videoUrl: "YOUR_THAILAND_VIDEO_URL",
  },
  {
    id: 4,
    title: "Couple Tour",
    customer: "Couple Moments",
    location: "Singapore",
    thumbnail:
      "https://plus.unsplash.com/premium_photo-1675549150924-283eaed11725?q=80&w=1170&auto=format&fit=crop",
    videoUrl: "YOUR_THAILAND_VIDEO_URL",
  },
  {
    id: 5,
    title: "Family Tour",
    customer: "Family Moments",
    location: "Kerala",
    thumbnail:
      "https://plus.unsplash.com/premium_photo-1718146019714-a7a0ab9e8e8d?q=80&w=1170&auto=format&fit=crop",
    videoUrl: "YOUR_THAILAND_VIDEO_URL",
  },
];

function getYouTubeEmbedUrl(url) {
  if (!url || url.startsWith("YOUR_")) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    let videoId = "";

    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.replace("/", "");
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1];
      } else if (parsedUrl.pathname.startsWith("/watch")) {
        videoId = parsedUrl.searchParams.get("v") || "";
      } else if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1];
      }
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}

function VideoTestimonials() {
  /*
   * =========================================================
   * DESKTOP STATE
   * =========================================================
   */

  const [visualIndex, setVisualIndex] = useState(0);
  const [contentIndex, setContentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  /*
   * =========================================================
   * REFS
   * =========================================================
   */

  const videoRef = useRef(null);

  /*
   * Mobile / tablet / iPad carousel
   */
  const responsiveScrollerRef = useRef(null);
  const responsiveCardRefs = useRef([]);

  /*
   * Scroll timer
   */
  const scrollTimerRef = useRef(null);

  const totalVideos = videos.length;

  /*
   * =========================================================
   * INDEX HELPER
   * =========================================================
   */

  const getIndex = useCallback(
    (index) => {
      return (index + totalVideos) % totalVideos;
    },
    [totalVideos]
  );

  const activeVideo = videos[contentIndex];

  /*
   * =========================================================
   * DESKTOP RELATIVE POSITION
   *
   * 0 = Main
   * 1 = Right Inner
   * 2 = Right Outer
   * 3 = Left Outer
   * 4 = Left Inner
   * =========================================================
   */

  const getRelativePosition = useCallback(
    (videoIndex) => {
      return getIndex(videoIndex - visualIndex);
    },
    [getIndex, visualIndex]
  );

  /*
   * =========================================================
   * DESKTOP TRANSITION
   * =========================================================
   */

  const startTransition = useCallback(
    (targetIndex) => {
      if (isAnimating) return;

      const nextIndex = getIndex(targetIndex);

      if (nextIndex === visualIndex) return;

      setIsAnimating(true);

      /*
       * Move the desktop cards first.
       */
      setVisualIndex(nextIndex);

      /*
       * Change the actual video after
       * the card movement finishes.
       */
      window.setTimeout(() => {
        setContentIndex(nextIndex);

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }

        setIsAnimating(false);
      }, 720);
    },
    [getIndex, isAnimating, visualIndex]
  );

  /*
   * =========================================================
   * DESKTOP NEXT
   * =========================================================
   */

  const goToNext = useCallback(() => {
    startTransition(getIndex(visualIndex + 1));
  }, [getIndex, startTransition, visualIndex]);

  /*
   * =========================================================
   * DESKTOP PREVIOUS
   * =========================================================
   */

  const goToPrevious = useCallback(() => {
    startTransition(getIndex(visualIndex - 1));
  }, [getIndex, startTransition, visualIndex]);

  /*
   * =========================================================
   * DESKTOP DIRECT SELECTION
   * =========================================================
   */

  const goToVideo = useCallback(
    (index) => {
      startTransition(index);
    },
    [startTransition]
  );

  /*
   * =========================================================
   * DESKTOP AUTOMATIC CAROUSEL
   *
   * Every 4 seconds.
   * =========================================================
   */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isAnimating) {
        startTransition(getIndex(visualIndex + 1));
      }
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    visualIndex,
    isAnimating,
    getIndex,
    startTransition,
  ]);

  /*
   * =========================================================
   * RESPONSIVE CARD SCROLL
   * =========================================================
   */

  const scrollResponsiveToIndex = useCallback(
    (index, smooth = true) => {
      const card = responsiveCardRefs.current[index];

      if (!card) return;

      card.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "nearest",
        inline: "center",
      });
    },
    []
  );

  /*
   * =========================================================
   * RESPONSIVE SELECT VIDEO
   *
   * Used by:
   * - Indicator
   * - Side-card click
   * - Swipe
   * =========================================================
   */

  const selectResponsiveVideo = useCallback(
    (index, smooth = true) => {
      const nextIndex = getIndex(index);

      setVisualIndex(nextIndex);
      setContentIndex(nextIndex);

      scrollResponsiveToIndex(nextIndex, smooth);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    },
    [getIndex, scrollResponsiveToIndex]
  );

  /*
   * =========================================================
   * DETECT ACTIVE CARD AFTER SWIPE
   * =========================================================
   */

  const handleResponsiveScroll = useCallback(() => {
    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      const scroller = responsiveScrollerRef.current;

      if (!scroller) return;

      const track = scroller.querySelector(
        ".responsive-video-track"
      );

      if (!track) return;

      const trackRect = track.getBoundingClientRect();

      const trackCenter =
        trackRect.left + trackRect.width / 2;

      let closestIndex = visualIndex;
      let closestDistance = Infinity;

      responsiveCardRefs.current.forEach(
        (card, index) => {
          if (!card) return;

          const cardRect = card.getBoundingClientRect();

          const cardCenter =
            cardRect.left + cardRect.width / 2;

          const distance = Math.abs(
            cardCenter - trackCenter
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      );

      if (closestIndex !== visualIndex) {
        setVisualIndex(closestIndex);
        setContentIndex(closestIndex);

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }
    }, 100);
  }, [visualIndex]);

  /*
   * =========================================================
   * CLEANUP SCROLL TIMER
   * =========================================================
   */

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  /*
   * =========================================================
   * DESKTOP CARD POSITION
   * =========================================================
   */

  const getCardStyle = (videoIndex) => {
    const position =
      getRelativePosition(videoIndex);

    /*
     * MAIN
     */

    if (position === 0) {
      return {
        left: "184px",
        top: "0px",
        width: "700px",
        height: "400px",
        zIndex: 30,
      };
    }

    /*
     * RIGHT INNER
     */

    if (position === 1) {
      return {
        left: "896px",
        top: "30px",
        width: "88px",
        height: "330px",
        zIndex: 20,
      };
    }

    /*
     * RIGHT OUTER
     */

    if (position === 2) {
      return {
        left: "996px",
        top: "60px",
        width: "72px",
        height: "280px",
        zIndex: 10,
      };
    }

    /*
     * LEFT OUTER
     */

    if (position === 3) {
      return {
        left: "0px",
        top: "60px",
        width: "72px",
        height: "280px",
        zIndex: 10,
      };
    }

    /*
     * LEFT INNER
     */

    return {
      left: "84px",
      top: "30px",
      width: "88px",
      height: "330px",
      zIndex: 20,
    };
  };

  /*
   * =========================================================
   * MAIN CARD CHECK
   * =========================================================
   */

  const isMainCard = (videoIndex) => {
    return getRelativePosition(videoIndex) === 0;
  };

  /*
   * =========================================================
   * ACTIVE YOUTUBE URL
   * =========================================================
   */

  const activeYouTubeUrl =
    getYouTubeEmbedUrl(activeVideo.videoUrl);

  return (
    <section className="bg-white px-4 py-7 text-white md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1450px]">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <SectionHeader
          title="Real stories from happy travellers"
          description="Hear directly from travellers who trusted us to plan their journey."
        />

        {/* =====================================================
            DESKTOP CAROUSEL
            xl AND ABOVE ONLY
        ====================================================== */}

        <div className="mt-14 hidden w-full items-center justify-center xl:flex">

          <div
            className="relative h-[394px] w-[1076px]"
            style={{
              perspective: "1200px",
            }}
          >
            {videos.map((video, index) => {
              const cardStyle =
                getCardStyle(index);

              const relativePosition =
                getRelativePosition(index);

              const mainCard =
                isMainCard(index);

              const youtubeUrl =
                index === contentIndex
                  ? getYouTubeEmbedUrl(
                      video.videoUrl
                    )
                  : null;

              return (
                <div
                  key={video.id}
                  className="
                    absolute
                    overflow-hidden
                    border
                    border-white/10
                    bg-white/5
                  "
                  style={{
                    left: cardStyle.left,
                    top: cardStyle.top,
                    width: cardStyle.width,
                    height: cardStyle.height,
                    zIndex: cardStyle.zIndex,

                    transition:
                      "left 720ms cubic-bezier(0.22, 1, 0.36, 1), top 720ms cubic-bezier(0.22, 1, 0.36, 1), width 720ms cubic-bezier(0.22, 1, 0.36, 1), height 720ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 720ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 720ms cubic-bezier(0.22, 1, 0.36, 1)",

                    boxShadow: mainCard
                      ? "0 25px 60px rgba(0,0,0,0.18)"
                      : "0 15px 35px rgba(0,0,0,0.12)",

                    borderRadius: mainCard
                      ? "16px"
                      : "12px",
                  }}
                >

                  {/* ==========================================
                      DESKTOP VIDEO
                  =========================================== */}

                  {mainCard &&
                  index === contentIndex ? (
                    youtubeUrl ? (
                      <iframe
                        key={`youtube-${video.id}`}
                        src={youtubeUrl}
                        title={video.title}
                        className="
                          absolute
                          inset-0
                          h-full
                          w-full
                        "
                        allow="
                          accelerometer;
                          autoplay;
                          clipboard-write;
                          encrypted-media;
                          gyroscope;
                          picture-in-picture;
                          web-share
                        "
                        allowFullScreen
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        key={`video-${video.id}`}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                        controls
                        playsInline
                        poster={video.thumbnail}
                      >
                        <source
                          src={video.videoUrl}
                          type="video/mp4"
                        />

                        Your browser does not support
                        the video tag.
                      </video>
                    )
                  ) : (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  )}

                  {/* ==========================================
                      DESKTOP ACTIVE VIDEO INFORMATION
                  =========================================== */}

                  {mainCard &&
                    index === contentIndex && (
                      <div
                        className="
                          pointer-events-none
                          absolute
                          bottom-0
                          left-0
                          right-0
                          p-6
                          pt-24
                        "
                      >
                        <p
                          className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
                            text-white/70
                          "
                        >
                          {video.location}
                        </p>

                        <h3
                          className="
                            mt-1
                            text-xl
                            font-semibold
                            text-white
                            md:text-2xl
                          "
                        >
                          {video.title}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-white/75
                          "
                        >
                          {video.customer}
                        </p>
                      </div>
                    )}

                  {/* ==========================================
                      DESKTOP LEFT INNER
                  =========================================== */}

                  {relativePosition === 4 && (
                    <button
                      type="button"
                      onClick={goToPrevious}
                      disabled={isAnimating}
                      aria-label="Previous testimonial"
                      className="
                        group
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <ChevronLeftIcon
                        className="
                          text-white
                          drop-shadow-lg
                          transition-transform
                          duration-300
                          group-hover:-translate-x-1
                        "
                        sx={{
                          fontSize: 36,
                        }}
                      />

                      <span
                        className="
                          absolute
                          bottom-4
                          whitespace-nowrap
                          text-[11px]
                          font-medium
                          text-white
                        "
                        style={{
                          writingMode:
                            "vertical-rl",
                          transform:
                            "rotate(180deg)",
                        }}
                      >
                        {video.title}
                      </span>
                    </button>
                  )}

                  {/* ==========================================
                      DESKTOP RIGHT INNER
                  =========================================== */}

                  {relativePosition === 1 && (
                    <button
                      type="button"
                      onClick={goToNext}
                      disabled={isAnimating}
                      aria-label="Next testimonial"
                      className="
                        group
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <ChevronRightIcon
                        className="
                          text-white
                          drop-shadow-lg
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                        sx={{
                          fontSize: 36,
                        }}
                      />

                      <span
                        className="
                          absolute
                          bottom-4
                          whitespace-nowrap
                          text-[11px]
                          font-medium
                          text-white
                        "
                        style={{
                          writingMode:
                            "vertical-rl",
                        }}
                      >
                        {video.title}
                      </span>
                    </button>
                  )}

                  {/* ==========================================
                      DESKTOP LEFT OUTER
                  =========================================== */}

                  {relativePosition === 3 && (
                    <button
                      type="button"
                      onClick={() =>
                        goToVideo(index)
                      }
                      disabled={isAnimating}
                      aria-label={`View ${video.title}`}
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <span
                        className="
                          whitespace-nowrap
                          text-[11px]
                          font-medium
                          text-white/90
                        "
                        style={{
                          writingMode:
                            "vertical-rl",
                          transform:
                            "rotate(180deg)",
                        }}
                      >
                        {video.title}
                      </span>
                    </button>
                  )}

                  {/* ==========================================
                      DESKTOP RIGHT OUTER
                  =========================================== */}

                  {relativePosition === 2 && (
                    <button
                      type="button"
                      onClick={() =>
                        goToVideo(index)
                      }
                      disabled={isAnimating}
                      aria-label={`View ${video.title}`}
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <span
                        className="
                          whitespace-nowrap
                          text-[11px]
                          font-medium
                          text-white/90
                        "
                        style={{
                          writingMode:
                            "vertical-rl",
                        }}
                      >
                        {video.title}
                      </span>
                    </button>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            DESKTOP INDICATOR
        ====================================================== */}

        <div
          className="
            mt-5
            hidden
            items-center
            justify-center
            gap-2
            xl:flex
          "
        >
          {videos.map((video, index) => (
            <button
              key={video.id}
              type="button"
              onClick={() => goToVideo(index)}
              disabled={isAnimating}
              aria-label={`Go to testimonial ${
                index + 1
              }`}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${
                  index === visualIndex
                    ? "w-8 bg-slate-900"
                    : "w-2 bg-slate-900/30 hover:bg-slate-900/60"
                }
              `}
            />
          ))}
        </div>

        {/* =====================================================
            MOBILE / TABLET / IPAD

            CENTER ACTIVE VIDEO
            PREVIOUS VIDEO PEEK
            NEXT VIDEO PEEK
        ====================================================== */}

        <div className="mt-10 block xl:hidden">

          {/* ===================================================
              RESPONSIVE VIDEO CAROUSEL
          ==================================================== */}

          <div
            ref={responsiveScrollerRef}
            className="
              w-full
              overflow-hidden
            "
          >
            <div
              className="
                w-full
                overflow-x-auto
                overscroll-x-contain
                scroll-smooth
                snap-x
                snap-mandatory
                touch-pan-x
                py-3
              "
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onScroll={
                handleResponsiveScroll
              }
            >

              <div
                className="
                  responsive-video-track
                  flex
                  w-max
                  items-center
                  gap-3
                "
                style={{
                  /*
                   * =================================================
                   * OUTER CORNER PADDING
                   * =================================================
                   *
                   * The active card width is:
                   *
                   * viewport - 96px
                   *
                   * Therefore 48px remains visible on
                   * both sides.
                   *
                   * This is what creates the reference
                   * design:
                   *
                   *     previous | ACTIVE | next
                   *
                   * without filling the screen completely.
                   */

                  paddingLeft:
                    "max(48px, calc((100vw - min(760px, calc(100vw - 96px))) / 2))",

                  paddingRight:
                    "max(48px, calc((100vw - min(760px, calc(100vw - 96px))) / 2))",
                }}
              >

                {videos.map((video, index) => {
                  const isActive =
                    index === visualIndex;

                  const youtubeUrl =
                    getYouTubeEmbedUrl(
                      video.videoUrl
                    );

                  return (
                    <article
                      key={video.id}
                      ref={(element) => {
                        responsiveCardRefs.current[
                          index
                        ] = element;
                      }}
                      onClick={() => {
                        if (!isActive) {
                          selectResponsiveVideo(
                            index,
                            true
                          );
                        }
                      }}
                      className="
                        relative
                        shrink-0
                        snap-center
                        overflow-hidden
                        rounded-xl
                        bg-black
                        shadow-[0_18px_40px_rgba(0,0,0,0.18)]
                      "
                      style={{
                        /*
                         * =================================================
                         * RESPONSIVE CARD WIDTH
                         * =================================================
                         *
                         * The active card NEVER takes 100vw.
                         *
                         * This guarantees that previous and next
                         * cards can always be seen.
                         */

                        width:
                          "min(760px, calc(100vw - 96px))",

                        /*
                         * IMPORTANT:
                         *
                         * Side cards are NOT blurred.
                         * Side cards are NOT faded.
                         * Side cards are NOT darkened.
                         */

                        opacity: 1,
                        filter: "none",
                        transform: "scale(1)",

                        transition:
                          "transform 300ms ease",
                      }}
                    >

                      {/* =============================================
                          VIDEO / THUMBNAIL
                      ============================================== */}

                      <div
                        className="
                          relative
                          aspect-video
                          w-full
                          overflow-hidden
                          rounded-xl
                          bg-black
                        "
                      >

                        {/* ACTIVE YOUTUBE */}

                        {isActive &&
                        youtubeUrl ? (
                          <iframe
                            key={`responsive-youtube-${video.id}`}
                            src={youtubeUrl}
                            title={video.title}
                            className="
                              absolute
                              inset-0
                              h-full
                              w-full
                            "
                            allow="
                              accelerometer;
                              autoplay;
                              clipboard-write;
                              encrypted-media;
                              gyroscope;
                              picture-in-picture;
                              web-share
                            "
                            allowFullScreen
                          />
                        ) : isActive ? (
                          /*
                           * ACTIVE MP4
                           */
                          <video
                            ref={videoRef}
                            key={`responsive-video-${video.id}`}
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                            controls
                            playsInline
                            poster={
                              video.thumbnail
                            }
                          >
                            <source
                              src={
                                video.videoUrl
                              }
                              type="video/mp4"
                            />

                            Your browser does not
                            support the video tag.
                          </video>
                        ) : (
                          /*
                           * SIDE VIDEO PREVIEW
                           *
                           * No blur.
                           * No overlay.
                           * No opacity.
                           */
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            draggable="false"
                            className="
                              h-full
                              w-full
                              object-cover
                              select-none
                            "
                          />
                        )}

                      </div>

                      {/* =============================================
                          ACTIVE VIDEO INFORMATION
                      ============================================== */}

                      {isActive && (
                        <div
                          className="
                            absolute
                            bottom-0
                            left-0
                            right-0
                            bg-gradient-to-t
                            from-black/95
                            via-black/45
                            to-transparent
                            px-4
                            pb-4
                            pt-16
                            sm:px-5
                            sm:pb-5
                            md:px-6
                            md:pb-6
                          "
                        >

                          <p
                            className="
                              text-[8px]
                              font-semibold
                              uppercase
                              tracking-[0.18em]
                              text-white/75
                              sm:text-[9px]
                              md:text-[10px]
                            "
                          >
                            {video.location}
                          </p>

                          <h3
                            className="
                              mt-1
                              text-sm
                              font-semibold
                              leading-tight
                              text-white
                              sm:text-base
                              md:text-xl
                            "
                          >
                            {video.title}
                          </h3>

                          <p
                            className="
                              mt-1
                              text-[11px]
                              text-white/70
                              sm:text-xs
                              md:text-sm
                            "
                          >
                            {video.customer}
                          </p>

                        </div>
                      )}

                    </article>
                  );
                })}

              </div>
            </div>
          </div>

          {/* ===================================================
              ONLY BOTTOM INDICATOR
          ==================================================== */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-1.5
            "
          >
            {videos.map((video, index) => (
              <button
                key={video.id}
                type="button"
                onClick={() =>
                  selectResponsiveVideo(
                    index,
                    true
                  )
                }
                aria-label={`Go to testimonial ${
                  index + 1
                }`}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    index === visualIndex
                      ? "w-7 bg-slate-900"
                      : "w-1.5 bg-slate-300"
                  }
                `}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default VideoTestimonials;