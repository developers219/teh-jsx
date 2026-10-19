import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import heroVideo from "../../assets/images/hero1.mp4";

const HERO_API = "https://cms.trvldeals.com/api/public/hero-sections";

const destinations = [
  "Bali",
  "Dubai",
  "Thailand",
  "Vietnam",
  "Maldives",
  "Mauritius",
  "Japan",
  "Sri Lanka",
];

export default function HeroSection() {
  const [destination, setDestination] = useState("");
  const [heroData, setHeroData] = useState(null);

  // Fetch dynamic hero content from CMS
  useEffect(() => {
    const controller = new AbortController();

    const fetchHeroData = async () => {
      try {
        const response = await fetch(HERO_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Hero API failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setHeroData(result.data);
          console.log("Fetched hero section by shivam: ", result.data);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching hero section:", error);
        }
      }
    };

    fetchHeroData();

    return () => controller.abort();
  }, []);

  // Dynamic heading and description
  const heading = heroData?.heading || "Your next great escape starts here";

  const description =
    heroData?.description ||
    "Discover handpicked destinations, thoughtfully crafted holidays";

  // Dynamic text styles from CMS
  const headingStyle = {
    ...(heroData?.headingStyle?.color && {
      color: heroData.headingStyle.color,
    }),
    ...(heroData?.headingStyle?.fontFamily && {
      fontFamily: heroData.headingStyle.fontFamily,
    }),
  };

  const descriptionStyle = {
    ...(heroData?.descriptionStyle?.color && {
      color: heroData.descriptionStyle.color,
    }),
    ...(heroData?.descriptionStyle?.fontFamily && {
      fontFamily: heroData.descriptionStyle.fontFamily,
    }),
  };

  // Dynamic background media
  const imageSrc = heroData?.images?.[0]?.url;

  const videoSrc =
    typeof heroData?.video === "string" ? heroData.video : heroData?.video?.url;

  const isImage = heroData?.mediaType === "image" && Boolean(imageSrc);

  const handleExplore = () => {
    if (!destination.trim()) return;
    console.log("Searching for:", destination);
  };

  return (
    <section
      className="
        relative
        w-full
        h-[110vh]
        px-5

          sm:px-6
          sm:py-20

          md:px-8
          md:py-20

          lg:px-10
          lg:py-0

          xl:px-12
      "
    >
      {/* =========================================================
            HERO VIDEO
        ========================================================== */}

      {/* Dynamic background image from CMS */}
      {/* {isImage ? (
        <img
          src={imageSrc}
          alt={heroData?.images?.[0]?.altText || ""}
          aria-hidden="true"
          fetchPriority="high"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          src={
            videoSrc ||
            "https://res.cloudinary.com/fxjte8jz/video/upload/f_auto,q_auto/hero1"
          }
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />
      )} */}

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source
          src="https://res.cloudinary.com/fxjte8jz/video/upload/f_auto,q_auto/hero1"
          type="video/mp4"
        />
      </video>
      {/* <video
        autoplay=""
        loop
        muted
        id="myVideo"
        className="absolute
          inset-0
          h-full
          w-full
          object-cover"
        preload="true"
        playsinline=""
      >
        <source
          src="https://maryculterhouse.com/wp-content/uploads/2020/10/Home-short-loop-1.webm"
          type="video/webm"
        />
        <source
          src="https://maryculterhouse.com/wp-content/uploads/2020/10/Home-short-loop-1.mp4"
          type="video/mp4"
        />
      </video> */}
      
{/* Active hero background video */}
{/* <video
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  poster={heroData?.images?.[0]?.url}
  className="absolute inset-0 h-full w-full object-cover object-center"
>
  <source
    src={videoSrc || heroVideo}
    type="video/mp4"
  />
</video> */}


      {/* =========================================================
            GENERAL DARK OVERLAY
        ========================================================== */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent via-50% to-black" />

      {/* =========================================================
            LEFT GRADIENT
            Stronger on desktop, softer on mobile
        ========================================================== */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-b from-black/50 via-black/30 to-transparent

        "
      />

      {/* =========================================================
            HERO CONTENT
        ========================================================== */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[560px]
          w-full
          max-w-7xl
          items-end
          justify-center
        "
      >
        <div
          className="
            w-full
            text-white

            text-center
          "
        >
          {/* =====================================================
            HEADING
        ====================================================== */}
          {/* <h1
            className="
              max-w-[650px]
              text-4xl
              text-white
              leading-tight
text-center
              sm:text-5xl

              md:text-6xl

              lg:text-xl

              xl:max-w-[720px]
              xl:text-[76px]
            "
            style={{ fontWeight: 100 }}
          >
            Your next
            {/* <br /> */}

          {/* <SectionHeader title={"Your next great escape starts here"} dark /> */}
          {/* <Typography
            variant="h2"
            className={"font-black text-white text-8xl font-cg"}
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
            sx={{
              lineHeight: 1.12,
              fontSize: 80,
            }}
          >
            {"Your next great escape starts here"}
          </Typography> */}

          <h2
            style={headingStyle}
            className="text-white/80 text-[clamp(2.8rem,5vw,3.75rem)] font-cg font-thin"
          >
            {heading}
          </h2>

          {/* =====================================================
            DESCRIPTION
        ====================================================== */}
          <p
            style={descriptionStyle}
            className="
              mt-5
              text-xs
              text-white/80 font-bold font-mont uppercase tracking-[8px] text-center sm:mt-6 lg:mt-5
            "
          >
            {description}
          </p>

          {/* =====================================================
            SEARCH BAR
        ====================================================== */}
          <div
            className="
              mt-7
              w-full
              max-w-[800px]
              absolute -bottom-48
              left-1/2 -translate-x-1/2
              font-mont
            "
          >
            <div
              className="
                flex

                w-full
                items-center
                rounded-full
                bg-white
                p-2
                shadow-[0_12px_40px_rgba(0,0,0,0.25)]
                transition-all
                duration-300
                focus-within:shadow-[0_15px_45px_rgba(0,0,0,0.35)]
              "
            >
              {/* =================================================
            SEARCH ICON
        ================================================== */}
              <SearchIcon
                sx={{
                  fontSize: 24,
                  color: "black",
                  flexShrink: 0,
                  margin: 1,
                }}
              />

              {/* =================================================
            SEARCH INPUT
        ================================================== */}
              <div
                className="
                  ml-3
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  justify-center

                  sm:ml-4
                "
              >
                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search destinations"
                  autoComplete="off"
                  list="destinations"
                  className="
                    mt-0.5
                    w-full
                    border-none
                    bg-transparent
                    text-sm
                    font-medium
                    text-black
                    outline-none
                    placeholder:text-slate-400

                    sm:text-[15px]
                  "
                />

                {/* Destination Suggestions */}
                <datalist id="destinations">
                  {destinations.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>

              {/* =================================================
            EXPLORE BUTTON
        ================================================== */}
              <button
                type="button"
                onClick={handleExplore}
                aria-label="Explore destination"
                className="
                  ml-2


                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-beige
                  text-white
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-beigeD
                  active:scale-95
                  cursor-pointer
                  p-2
                  lg:p-4
                "
              >
                <ArrowForwardIcon
                  sx={{
                    fontSize: 23,
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
            OPTIONAL SCROLL INDICATOR
        ========================================================== */}
      {/*
        <div
          className="
            absolute
            bottom-7
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-3
            text-xs
            uppercase
            tracking-[0.25em]
            text-white/70

            md:flex
          "
        >
          <span className="h-px w-10 bg-white/50" />
          Explore
          <span className="h-px w-10 bg-white/50" />
        </div>
        */}
    </section>
  );
}
