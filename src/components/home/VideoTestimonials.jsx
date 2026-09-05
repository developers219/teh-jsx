import { useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SectionHeader from "./SectionHeader";
const videos = [
    {
        id: 1,
        title: "Family holiday experience",
        customer: "Happy Family",
        location: "Dubai & Abu Dhabi",
        thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
        videoUrl: "YOUR_DUBAI_VIDEO_URL",
    },
    {
        id: 2,
        title: "Honeymoon trip review",
        customer: "Happy Couple",
        location: "Bali",
        thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
        videoUrl: "YOUR_DUBAI_VIDEO_URL",
    },
    {
        id: 3,
        title: "Group tour feedback",
        customer: "Happy Traveller",
        location: "Thailand",
        thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
        videoUrl: "YOUR_THAILAND_VIDEO_URL",
    },
    {
        id: 4,
        title: "Couple Tour",
        customer: "Couple Moments",
        location: "Singapore",
        thumbnail: "https://plus.unsplash.com/premium_photo-1675549150924-283eaed11725?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        videoUrl: "YOUR_THAILAND_VIDEO_URL",
    },
    {
        id: 5,
        title: "Family Tour",
        customer: "Family Moments",
        location: "Kerala",
        thumbnail: "https://plus.unsplash.com/premium_photo-1718146019714-a7a0ab9e8e8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
            }
            else if (parsedUrl.pathname.startsWith("/watch")) {
                videoId = parsedUrl.searchParams.get("v") || "";
            }
            else if (parsedUrl.pathname.startsWith("/embed/")) {
                videoId = parsedUrl.pathname.split("/embed/")[1];
            }
        }
        if (!videoId) {
            return null;
        }
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    catch {
        return null;
    }
}
function VideoTestimonials() {
    /*
     * visualIndex controls where the cards are positioned.
     *
     * contentIndex controls which video is actually loaded
     * inside the main video player.
     *
     * Keeping these separate allows the card to physically
     * move first, then the actual video changes after the
     * animation finishes.
     */
    const [visualIndex, setVisualIndex] = useState(0);
    const [contentIndex, setContentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const videoRef = useRef(null);
    const totalVideos = videos.length;
    const getIndex = (index) => {
        return (index + totalVideos) % totalVideos;
    };
    const activeVideo = videos[contentIndex];
    /*
     * Determine the position of every video relative
     * to the currently visible main video.
     *
     * 0 = Main
     * 1 = Right Inner
     * 2 = Right Outer
     * 3 = Left Outer
     * 4 = Left Inner
     */
    const getRelativePosition = (videoIndex) => {
        return getIndex(videoIndex - visualIndex);
    };
    /*
     * Start carousel movement.
     *
     * First the cards move.
     * After 700ms the actual video changes.
     */
    const startTransition = (targetIndex) => {
        if (isAnimating)
            return;
        const nextIndex = getIndex(targetIndex);
        if (nextIndex === visualIndex)
            return;
        setIsAnimating(true);
        /*
         * Move cards immediately.
         */
        setVisualIndex(nextIndex);
        /*
         * Wait until the physical card animation
         * is almost complete, then change the video.
         */
        window.setTimeout(() => {
            setContentIndex(nextIndex);
            /*
             * Reset normal MP4 video.
             */
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
            setIsAnimating(false);
        }, 720);
    };
    /*
     * NEXT
     */
    const goToNext = () => {
        startTransition(getIndex(visualIndex + 1));
    };
    /*
     * PREVIOUS
     */
    const goToPrevious = () => {
        startTransition(getIndex(visualIndex - 1));
    };
    /*
     * DOT / DIRECT SELECTION
     */
    const goToVideo = (index) => {
        startTransition(index);
    };
    /*
     * AUTOMATIC CAROUSEL
     *
     * Every 4 seconds the carousel moves
     * one position forward.
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
    }, [visualIndex, isAnimating]);
    /*
     * YouTube URL for the video currently loaded
     * inside the main player.
     */
    const activeYouTubeUrl = getYouTubeEmbedUrl(activeVideo.videoUrl);
    /*
     * CARD POSITION STYLES
     *
     * These measurements intentionally match
     * your previous design.
     */
    const getCardStyle = (videoIndex) => {
        const position = getRelativePosition(videoIndex);
        /*
         * MAIN
         *
         * 700 x 393.75 approximately because
         * aspect ratio is 16:9.
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
     * Whether this card is currently the main card.
     */
    const isMainCard = (videoIndex) => {
        return getRelativePosition(videoIndex) === 0;
    };
    return (<section className="bg-white px-4 py-7 text-white md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1450px]">

        {/* =========================================
            SECTION HEADER
        ========================================== */}

        <SectionHeader title="Real stories from happy travellers" description="Hear directly from travellers who trusted us to plan their journey."/>

        {/* =========================================
            DESKTOP
            2 LEFT + MAIN + 2 RIGHT
        ========================================== */}

        <div className="mt-14 hidden w-full items-center justify-center xl:flex">

          {/* =====================================
            ANIMATED DESKTOP CAROUSEL
        ====================================== */}

          <div className="relative h-[394px] w-[1076px]" style={{
            perspective: "1200px",
        }}>
            {videos.map((video, index) => {
            const cardStyle = getCardStyle(index);
            const relativePosition = getRelativePosition(index);
            const mainCard = isMainCard(index);
            const youtubeUrl = index === contentIndex
                ? getYouTubeEmbedUrl(video.videoUrl)
                : null;
            return (<div key={video.id} className="absolute overflow-hidden rounded-xl border border-white/10 bg-white/5" style={{
                    left: cardStyle.left,
                    top: cardStyle.top,
                    width: cardStyle.width,
                    height: cardStyle.height,
                    zIndex: cardStyle.zIndex,
                    /*
                     * THIS IS THE MAIN ANIMATION
                     *
                     * The width, height, left and top all
                     * smoothly transition.
                     *
                     * Therefore:
                     *
                     * Right video -> Main
                     * Main -> Left
                     *
                     * happens physically rather than
                     * simply swapping the content.
                     */
                    transition: "left 720ms cubic-bezier(0.22, 1, 0.36, 1), top 720ms cubic-bezier(0.22, 1, 0.36, 1), width 720ms cubic-bezier(0.22, 1, 0.36, 1), height 720ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 720ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 720ms cubic-bezier(0.22, 1, 0.36, 1)",
                    boxShadow: mainCard
                        ? "0 25px 60px rgba(0,0,0,0.18)"
                        : "0 15px 35px rgba(0,0,0,0.12)",
                    borderRadius: mainCard ? "16px" : "12px",
                }}>

                  {/* =================================
                    MAIN VIDEO
                ================================== */}

                  {mainCard && index === contentIndex ? (youtubeUrl ? (<iframe key={`youtube-${video.id}`} src={youtubeUrl} title={video.title} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>) : (<video ref={videoRef} key={`video-${video.id}`} className="h-full w-full object-cover" controls playsInline poster={video.thumbnail}>
                        <source src={video.videoUrl} type="video/mp4"/>

                        Your browser does not support the video tag.
                      </video>)) : (
                /*
                 * SIDE CARDS
                 *
                 * During the animation the incoming
                 * card uses its thumbnail.
                 *
                 * This allows the thumbnail to physically
                 * grow into the main video position.
                 */
                <img src={video.thumbnail} alt={video.title} className="absolute inset-0 h-full w-full object-cover"/>)}

                  {/* =================================
                    SIDE CARD DARK OVERLAY
                ================================== */}

                  {/* {!mainCard && (
                  <div
                    className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${
                      relativePosition === 1 ||
                      relativePosition === 4
                        ? "hover:bg-black/40"
                        : "bg-black/70"
                    }`}
                  />
                )} */}

                  {/* =================================
                    MAIN VIDEO INFORMATION
                ================================== */}

                  {mainCard && index === contentIndex && (<div className="pointer-events-none absolute bottom-0 left-0 right-0  p-6 pt-24">

                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                        {video.location}
                      </p>

                      <h3 className="mt-1 text-xl font-semibold text-white md:text-2xl">
                        {video.title}
                      </h3>

                      <p className="mt-1 text-sm text-white/75">
                        {video.customer}
                      </p>

                    </div>)}

                  {/* =================================
                    LEFT INNER ARROW
                ================================== */}

                  {relativePosition === 4 && (<button type="button" onClick={goToPrevious} disabled={isAnimating} aria-label="Previous testimonial" className="group absolute inset-0 flex items-center justify-center">
                      <ChevronLeftIcon className="text-white drop-shadow-lg transition-transform duration-300 group-hover:-translate-x-1" sx={{ fontSize: 36 }}/>

                      <span className="absolute bottom-4 whitespace-nowrap text-[11px] font-medium text-white" style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                    }}>
                        {video.title}
                      </span>
                    </button>)}

                  {/* =================================
                    RIGHT INNER ARROW
                ================================== */}

                  {relativePosition === 1 && (<button type="button" onClick={goToNext} disabled={isAnimating} aria-label="Next testimonial" className="group absolute inset-0 flex items-center justify-center">
                      <ChevronRightIcon className="text-white drop-shadow-lg transition-transform duration-300 group-hover:translate-x-1" sx={{ fontSize: 36 }}/>

                      <span className="absolute bottom-4 whitespace-nowrap text-[11px] font-medium text-white" style={{
                        writingMode: "vertical-rl",
                    }}>
                        {video.title}
                      </span>
                    </button>)}

                  {/* =================================
                    OUTER LEFT CARD
                ================================== */}

                  {relativePosition === 3 && (<button type="button" onClick={() => goToVideo(index)} disabled={isAnimating} aria-label={`View ${video.title}`} className="absolute inset-0 flex items-center justify-center">
                      <span className="whitespace-nowrap text-[11px] font-medium text-white/90" style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                    }}>
                        {video.title}
                      </span>
                    </button>)}

                  {/* =================================
                    OUTER RIGHT CARD
                ================================== */}

                  {relativePosition === 2 && (<button type="button" onClick={() => goToVideo(index)} disabled={isAnimating} aria-label={`View ${video.title}`} className="absolute inset-0 flex items-center justify-center">
                      <span className="whitespace-nowrap text-[11px] font-medium text-white/90" style={{
                        writingMode: "vertical-rl",
                    }}>
                        {video.title}
                      </span>
                    </button>)}

                </div>);
        })}
          </div>
        </div>

        {/* =========================================
            DESKTOP DOTS
        ========================================== */}

        <div className="mt-5 hidden items-center justify-center gap-2 xl:flex">
          {videos.map((video, index) => (<button key={video.id} type="button" onClick={() => goToVideo(index)} disabled={isAnimating} aria-label={`Go to testimonial ${index + 1}`} className={`h-2 rounded-full transition-all duration-300 ${index === visualIndex
                ? "w-8 bg-slate-900"
                : "w-2 bg-slate-900/30 hover:bg-slate-900/60"}`}/>))}
        </div>

        {/* =========================================
            TABLET
            1 LEFT + MAIN + 1 RIGHT
        ========================================== */}

        <div className="mt-12 hidden items-center justify-center gap-4 md:flex xl:hidden">

          {/* LEFT */}

          <button type="button" onClick={goToPrevious} disabled={isAnimating} aria-label="Previous testimonial" className="group relative h-[300px] w-[90px] shrink-0 overflow-hidden rounded-xl border border-white/10">
            <img src={videos[getIndex(contentIndex - 1)].thumbnail} alt={videos[getIndex(contentIndex - 1)].title} className="absolute inset-0 h-full w-full object-cover"/>

            <div className="absolute inset-0 bg-black/60"/>

            <div className="absolute inset-0 flex items-center justify-center">
              <ChevronLeftIcon className="text-white" sx={{ fontSize: 32 }}/>
            </div>
          </button>

          {/* MAIN */}

          <div className="w-full max-w-[650px]">

            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">

              {activeYouTubeUrl ? (<iframe key={activeVideo.id} src={activeYouTubeUrl} title={activeVideo.title} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>) : (<video key={activeVideo.id} className="h-full w-full object-cover" controls playsInline poster={activeVideo.thumbnail}>
                  <source src={activeVideo.videoUrl} type="video/mp4"/>
                </video>)}

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5 pt-16">

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                  {activeVideo.location}
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  {activeVideo.title}
                </h3>

                <p className="text-sm text-white/70">
                  {activeVideo.customer}
                </p>

              </div>
            </div>

            {/* DOTS */}

            <div className="mt-5 flex justify-center gap-2">
              {videos.map((video, index) => (<button key={video.id} type="button" onClick={() => goToVideo(index)} disabled={isAnimating} className={`h-2 rounded-full transition-all ${index === visualIndex
                ? "w-8 bg-slate-900"
                : "w-2 bg-slate-900/30"}`} aria-label={`Go to testimonial ${index + 1}`}/>))}
            </div>

          </div>

          {/* RIGHT */}

          <button type="button" onClick={goToNext} disabled={isAnimating} aria-label="Next testimonial" className="group relative h-[300px] w-[90px] shrink-0 overflow-hidden rounded-xl border border-white/10">
            <img src={videos[getIndex(contentIndex + 1)].thumbnail} alt={videos[getIndex(contentIndex + 1)].title} className="absolute inset-0 h-full w-full object-cover"/>

            <div className="absolute inset-0 bg-black/60"/>

            <div className="absolute inset-0 flex items-center justify-center">
              <ChevronRightIcon className="text-white" sx={{ fontSize: 32 }}/>
            </div>
          </button>

        </div>

        {/* =========================================
            MOBILE
        ========================================== */}

        <div className="mt-10 md:hidden">

          {/* MAIN VIDEO */}

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">

            {activeYouTubeUrl ? (<div className="relative aspect-video">
                <iframe key={activeVideo.id} src={activeYouTubeUrl} title={activeVideo.title} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
              </div>) : (<video key={activeVideo.id} className="aspect-video w-full object-cover" controls playsInline poster={activeVideo.thumbnail}>
                <source src={activeVideo.videoUrl} type="video/mp4"/>
              </video>)}

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-5 pt-16">

              <p className="text-xs uppercase tracking-wider text-white/70">
                {activeVideo.location}
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                {activeVideo.title}
              </h3>

              <p className="text-sm text-white/70">
                {activeVideo.customer}
              </p>

            </div>

          </div>

          {/* MOBILE CONTROLS */}

          <div className="mt-5 flex items-center justify-between">

            {/* PREVIOUS */}

            <button type="button" onClick={goToPrevious} disabled={isAnimating} aria-label="Previous testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10">
              <ChevronLeftIcon />
            </button>

            {/* DOTS */}

            <div className="flex gap-2">
              {videos.map((video, index) => (<button key={video.id} type="button" onClick={() => goToVideo(index)} disabled={isAnimating} aria-label={`Go to testimonial ${index + 1}`} className={`h-2 rounded-full transition-all ${index === visualIndex
                ? "w-7 bg-slate-900"
                : "w-2 bg-slate-900/30"}`}/>))}
            </div>

            {/* NEXT */}

            <button type="button" onClick={goToNext} disabled={isAnimating} aria-label="Next testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10">
              <ChevronRightIcon />
            </button>

          </div>

          {/* MOBILE COUNT */}

          {/* <p className="mt-4 text-center text-xs text-slate-500">
          {visualIndex + 1} / {totalVideos}
        </p> */}

        </div>

      </div>
    </section>);
}
export default VideoTestimonials;
