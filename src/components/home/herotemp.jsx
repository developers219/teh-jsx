import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
      "
    >
      {/* =========================================================
            HERO VIDEO
        ========================================================== */}
      {/* <video
        autoPlay
        muted
        loop
        playsInline
        src={heroVideo}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      /> */}
      <video
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
      </video>

      {/* =========================================================
            GENERAL DARK OVERLAY
        ========================================================== */}
      {/* <div className="absolute inset-0 " /> */}

      {/* =========================================================
            LEFT GRADIENT
            Stronger on desktop, softer on mobile
        ========================================================== */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-b from-black/60 via-black/60 to-transparent
        
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

          px-5
          py-16

          sm:min-h-[600px]
          sm:px-6
          sm:py-20

          md:min-h-[640px]
          md:px-8
          md:py-20

          lg:min-h-[680px]
          lg:px-10
          lg:py-48

          xl:min-h-[720px]
          xl:px-12
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
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
            className="text-white/80 text-6xl font-cg font-thin"
          >
            Your next great escape starts here
          </h2>

          {/* =====================================================
            DESCRIPTION
        ====================================================== */}
          <p
            className="
              mt-5
              
              text-xs
              text-white/80 uppercase tracking-[8px]
text-center
              sm:mt-6
            

              lg:mt-5
              
            "
            style={{ fontFamily: "Montserrat" }}
          >
            Discover handpicked destinations, thoughtfully crafted holidays
          </p>

          {/* =====================================================
            SEARCH BAR
        ====================================================== */}
          <div
            className="
              mt-7
              w-full
              max-w-[800px]
              absolute -bottom-16
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
                  flex
                  
                  
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
                  p-4
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
