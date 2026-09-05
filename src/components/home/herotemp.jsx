import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import heroVideo from "../../assets/images/hero-video.mp4";
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
        if (!destination.trim())
            return;
        console.log("Searching for:", destination);
    };
    return (<section className="
        relative
        min-h-[560px]
        w-full
        overflow-hidden

        sm:min-h-[600px]
        md:min-h-[640px]
        lg:min-h-[680px]
        xl:min-h-[720px]
      ">
      {/* =========================================================
            HERO VIDEO
        ========================================================== */}
      <video autoPlay muted loop playsInline src={heroVideo} className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "/>

      {/* =========================================================
            GENERAL DARK OVERLAY
        ========================================================== */}
      <div className="absolute inset-0 "/>

      {/* =========================================================
            LEFT GRADIENT
            Stronger on desktop, softer on mobile
        ========================================================== */}
      <div className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black/3
          via-black/2
          to-transparent

          sm:from-black/6
          md:from-black/8
          lg:from-black/43
        "/>

      {/* =========================================================
            HERO CONTENT
        ========================================================== */}
      <div className="
          relative
          z-10
          mx-auto
          flex
          min-h-[560px]
          w-full
          max-w-7xl
          items-center

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
          lg:py-24

          xl:min-h-[720px]
          xl:px-12
        ">
        <div className="
            w-full
            max-w-3xl
            text-white
          ">
          {/* =====================================================
            HEADING
        ====================================================== */}
          <h1 className="
              max-w-[650px]
              text-4xl
              font-semibold
              leading-[1.05]
              tracking-tight
              text-white

              sm:text-5xl

              md:text-6xl

              lg:text-7xl

              xl:max-w-[720px]
              xl:text-[76px]
            ">
            Your next
            <br />
            <span className="text-white">
              great escape
            </span>
            <br />
            starts here.
          </h1>

          {/* =====================================================
            DESCRIPTION
        ====================================================== */}
          <p className="
              mt-5
              max-w-[520px]
              text-sm
              leading-6
              text-white

              sm:mt-6
              sm:text-base
              sm:leading-7

              md:max-w-xl
              md:text-lg

              lg:mt-7
            ">
            Discover handpicked destinations, thoughtfully crafted
            holidays, and unforgettable experiences designed around
            the way you love to travel.
          </p>

          {/* =====================================================
            SEARCH BAR
        ====================================================== */}
          <div className="
              mt-7
              w-full
              max-w-[560px]

              sm:mt-8

              md:mt-9
            ">
            <div className="
                flex
                h-[54px]
                w-full
                items-center
                rounded-full
                bg-white
                px-4
                shadow-[0_12px_40px_rgba(0,0,0,0.25)]
                transition-all
                duration-300

                sm:h-[58px]
                sm:px-5

                md:px-6

                focus-within:shadow-[0_15px_45px_rgba(0,0,0,0.35)]
              ">
              {/* =================================================
            SEARCH ICON
        ================================================== */}
              <SearchIcon sx={{
            fontSize: 24,
            color: "black",
            flexShrink: 0,
        }}/>

              {/* =================================================
            SEARCH INPUT
        ================================================== */}
              <div className="
                  ml-3
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  justify-center

                  sm:ml-4
                ">
                <input id="destination" type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Search destinations..." autoComplete="off" list="destinations" className="
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
                  "/>

                {/* Destination Suggestions */}
                <datalist id="destinations">
                  {destinations.map((item) => (<option key={item} value={item}/>))}
                </datalist>
              </div>

              {/* =================================================
            EXPLORE BUTTON
        ================================================== */}
              <button type="button" onClick={handleExplore} aria-label="Explore destination" className="
                  ml-2
                  flex
                  h-[40px]
                  w-[40px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  text-white
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-neutral-800
                  active:scale-95

                  sm:ml-3
                  sm:h-[42px]
                  sm:w-[42px]
                ">
                <ArrowForwardIcon sx={{
            fontSize: 23,
        }}/>
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
    </section>);
}
