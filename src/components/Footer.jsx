import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MailIcon from "@mui/icons-material/Mail";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router-dom";
function Footer() {
    const brands = [
        {
            id: 1,
            content: (<span className="whitespace-nowrap text-[22px] font-semibold tracking-wide">
          amadeus
        </span>),
        },
        {
            id: 2,
            content: (<div className="flex flex-col items-center whitespace-nowrap">
          <span className="text-[8px] leading-none">
            Member of
          </span>

          <span className="text-[22px] font-semibold tracking-wide">
            OTAI
          </span>
        </div>),
        },
        {
            id: 3,
            content: (<span className="whitespace-nowrap text-[22px] font-bold tracking-tight">
          ◉ Expedia
        </span>),
        },
        {
            id: 4,
            content: (<span className="whitespace-nowrap text-[21px] font-bold italic tracking-tight">
          Malindo air
        </span>),
        },
        {
            id: 5,
            content: (<span className="whitespace-nowrap text-[23px] font-bold lowercase">
          viator
        </span>),
        },
        {
            id: 6,
            content: (<div className="flex flex-col items-center whitespace-nowrap">
          <span className="text-[20px] font-bold tracking-[2px]">
            ✈ IATA
          </span>

          <span className="mt-0.5 text-[6px] tracking-[1px]">
            ACCREDITED AGENT
          </span>
        </div>),
        },
        {
            id: 7,
            content: (<span className="whitespace-nowrap text-[20px] font-bold">
          DUBAI
          <span className="ml-1 text-[14px] font-normal">
            expert
          </span>
        </span>),
        },
        {
            id: 8,
            content: (<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white px-1 text-center">
          <span className="text-[7px] font-bold leading-tight tracking-wide">
            AUSSIE
            <br />
            SPECIALIST
          </span>
        </div>),
        },
        {
            id: 9,
            content: (<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white px-1 text-center">
          <span className="text-[6px] font-bold leading-tight tracking-wide">
            SOUTH AFRICA
            <br />
            SPECIALIST
          </span>
        </div>),
        },
        {
            id: 10,
            content: (<div className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-[25px] leading-none">
            ✦
          </span>

          <span className="text-center text-[8px] font-bold leading-tight tracking-wide">
            NEW ZEALAND
            <br />
            TOURISM
          </span>
        </div>),
        },
        {
            id: 11,
            content: (<span className="whitespace-nowrap text-center text-[9px] leading-tight tracking-[2px]">
          Austrian
          <br />
          Certified
          <br />
          Travel
          <br />
          Specialist
        </span>),
        },
        {
            id: 12,
            content: (<span className="whitespace-nowrap border border-white/70 px-3 py-3 text-center text-[8px] font-bold leading-tight tracking-wide">
          INSPIRED
          <br />
          BY ICELAND
        </span>),
        },
        {
            id: 13,
            content: (<span className="whitespace-nowrap text-center">
          <span className="block text-[18px] font-semibold tracking-wide">
            QATAR
          </span>

          <span className="block text-[9px]">
            Specialist
          </span>
        </span>),
        },
    ];
    return (<>
      {/* =================================================
            BRAND MARQUEE ANIMATION
        ================================================== */}

      <style>
        {`
          @keyframes footerBrandScroll {
            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(-50%);
            }
          }

          .footer-brand-track {
            animation: footerBrandScroll 35s linear infinite;
          }

          .footer-brand-track:hover {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .footer-brand-track {
              animation: none;
            }
          }
        `}
      </style>


      {/* =================================================
            FOOTER
        ================================================== */}

      <footer className="rounded-t-[32px] bg-black px-6 py-10 text-white sm:px-8 lg:px-12 lg:py-14">

        <div className="mx-auto max-w-7xl">


          {/* =================================================
            BRANDING SECTION
            DO NOT CHANGE
        ================================================== */}

          <section className="overflow-hidden pb-8">

            <div className="mb-8 text-center">
              <Typography component="h3" className="text-base font-medium text-white sm:text-lg">
                Partnered with the best in the industry
              </Typography>
            </div>


            <div className="relative w-full overflow-hidden">

              {/* LEFT FADE */}

              <div className="
                  pointer-events-none
                  absolute
                  left-0
                  top-0
                  z-10
                  h-full
                  w-16
                  bg-gradient-to-r
                  from-black
                  to-transparent
                "/>


              {/* RIGHT FADE */}

              <div className="
                  pointer-events-none
                  absolute
                  right-0
                  top-0
                  z-10
                  h-full
                  w-16
                  bg-gradient-to-l
                  from-black
                  to-transparent
                "/>


              {/* MOVING TRACK */}

              <div className="footer-brand-track flex w-max">

                {/* FIRST BRAND SET */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    gap-12
                    pr-12
                    sm:gap-16
                    sm:pr-16
                    lg:gap-20
                    lg:pr-20
                  ">
                  {brands.map((brand) => (<div key={brand.id} className="flex shrink-0 items-center justify-center text-white">
                      {brand.content}
                    </div>))}
                </div>


                {/* SECOND BRAND SET */}

                <div aria-hidden="true" className="
                    flex
                    shrink-0
                    items-center
                    gap-12
                    pr-12
                    sm:gap-16
                    sm:pr-16
                    lg:gap-20
                    lg:pr-20
                  ">
                  {brands.map((brand) => (<div key={`duplicate-${brand.id}`} className="flex shrink-0 items-center justify-center text-white">
                      {brand.content}
                    </div>))}
                </div>

              </div>

            </div>

          </section>


          {/* =================================================
            DIVIDER AFTER BRANDING
        ================================================== */}

          <Divider sx={{
            mb: 6,
            borderColor: "rgba(255,255,255,0.15)",
        }}/>


          {/* =================================================
            MAIN FOOTER DETAILS
        ================================================== */}

          <div className="
              grid
              grid-cols-1
              gap-12
              sm:grid-cols-2
              lg:grid-cols-[1.5fr_1fr_1fr_1.25fr]
              lg:gap-12
              xl:grid-cols-[1.55fr_1fr_1fr_1.25fr]
              xl:gap-16
            ">


            {/* =================================================
            COMPANY INFO
        ================================================== */}

            <div className="max-w-sm">

              {/* LOGO */}

              <Link to="/" className="
                  mb-6
                  flex
                  items-center
                  gap-2
                  no-underline
                ">

                <TravelExploreIcon sx={{
            fontSize: 34,
            color: "#ffffff",
        }}/>

                <Typography component="span" className="
                    text-xl
                    font-extrabold
                    tracking-tight
                    text-white
                    sm:text-2xl
                  ">
                  Travel Empire Holidays
                </Typography>

              </Link>


              {/* DESCRIPTION */}

              <Typography className="
                  max-w-[310px]
                  text-sm
                  leading-6
                  text-slate-400
                ">
                Thoughtfully planned journeys that turn travel into
                unforgettable experiences.
              </Typography>


              {/* SOCIAL LINKS */}

              <div className="mt-7 flex items-center gap-2">


                {/* LINKEDIN */}

                <IconButton component="a" href="#" aria-label="LinkedIn" sx={{
            width: 36,
            height: 36,
            padding: 0,
            color: "#ffffff",
            "&:hover": {
                color: "black",
                backgroundColor: "white",
            },
        }}>
                  <LinkedInIcon sx={{ fontSize: 18 }}/>
                </IconButton>


                {/* INSTAGRAM */}

                <IconButton component="a" href="#" aria-label="Instagram" sx={{
            width: 36,
            height: 36,
            padding: 0,
            color: "#ffffff",
            "&:hover": {
                color: "black",
                backgroundColor: "white",
            },
        }}>
                  <InstagramIcon sx={{ fontSize: 18 }}/>
                </IconButton>


                {/* FACEBOOK */}

                <IconButton component="a" href="#" aria-label="Facebook" sx={{
            width: 36,
            height: 36,
            padding: 0,
            color: "#ffffff",
            "&:hover": {
                color: "black",
                backgroundColor: "white",
            },
        }}>
                  <FacebookIcon sx={{ fontSize: 18 }}/>
                </IconButton>


                {/* YOUTUBE */}

                <IconButton component="a" href="#" aria-label="YouTube" sx={{
            width: 36,
            height: 36,
            padding: 0,
            color: "#ffffff",
            "&:hover": {
                color: "black",
                backgroundColor: "white",
            },
        }}>
                  <YouTubeIcon sx={{ fontSize: 18 }}/>
                </IconButton>

              </div>

            </div>


            {/* =================================================
            ALL PACKAGES
        ================================================== */}

            <div className="flex flex-col">

  <Typography component="h3" className="
      text-sm
      font-bold
      uppercase
      tracking-wide
      text-white
    ">
    All Packages
  </Typography>

  <div className="mt-8 flex flex-col items-start gap-5">

    <Link to="/packages" className="
        text-sm
        text-slate-400
        no-underline
        transition-colors
        hover:text-white
      ">
      Domestic Packages
    </Link>

    <Link to="/packages" className="
        text-sm
        text-slate-400
        no-underline
        transition-colors
        hover:text-white
      ">
      International Packages
    </Link>

  </div>

    </div>

            {/* =================================================
            QUICK LINKS
        ================================================== */}

            <div className="flex flex-col">

  <Typography component="h3" className="
      text-sm
      font-bold
      uppercase
      tracking-wide
      text-white
    ">
    Quick Links
  </Typography>

  <div className="mt-8 flex flex-col items-start gap-5">

    <Link to="/destinations" className="
        text-sm
        text-slate-400
        no-underline
        transition-colors
        hover:text-white
      ">
      Destinations
    </Link>

    <Link to="/packages" className="
        text-sm
        text-slate-400
        no-underline
        transition-colors
        hover:text-white
      ">
      Holiday Packages
    </Link>

    <Link to="/how-it-works" className="
        text-sm
        text-slate-400
        no-underline
        transition-colors
        hover:text-white
      ">
      How It Works
    </Link>

    <Link to="/reviews" className="
        text-sm
        text-slate-400
        no-underline
        transition-colors
        hover:text-white
      ">
      Testimonials
    </Link>

    <Link to="/contact" className="
        text-sm
        text-slate-400
        no-underline
        transition-colors
        hover:text-white
      ">
      Contact Us
    </Link>

  </div>

    </div>


            {/* =================================================
            CONTACT
        ================================================== */}

            <div className="flex flex-col">

  <Typography component="h3" className="
      text-sm
      font-bold
      uppercase
      tracking-wide
      text-white
    ">
    Contact Us
  </Typography>

  <div className="mt-8 flex flex-col gap-7">

    {/* EMAIL */}

    <div className="flex items-start gap-3">

      <div className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-white/10
          bg-white/5
        ">
        <MailIcon sx={{
            fontSize: 18,
            color: "white",
        }}/>
      </div>

      <div className="pt-0.5">

        {/* <span className="block text-xs text-slate-500">
          Email
        </span> */}

        <span className="mt-1.5 block text-sm text-slate-400">
          hello@travelempireholidays.com
        </span>

      </div>

    </div>


    {/* PHONE */}

    <div className="flex items-start gap-3">

      <div className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-white/10
          bg-white/5
        ">
        <PhoneIcon sx={{
            fontSize: 18,
            color: "white",
        }}/>
      </div>

      <div className="pt-0.5">

        {/* <span className="block text-xs text-slate-500">
          Phone
        </span> */}

        <span className="mt-1.5 block text-sm text-slate-400">
          +91 90000 00000
        </span>

      </div>

    </div>


    {/* LOCATION */}

    <div className="flex items-start gap-3">

      <div className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-white/10
          bg-white/5
        ">
        <LocationOnIcon sx={{
            fontSize: 18,
            color: "white",
        }}/>
      </div>

      <div className="pt-0.5">

        {/* <span className="block text-xs text-slate-500">
          Location
        </span> */}

        <span className="mt-1.5 block text-sm text-slate-400">
          Mumbai, India
        </span>

      </div>

    </div>

  </div>

    </div>
          </div>


          {/* =================================================
            BOTTOM DIVIDER
            SAME
        ================================================== */}

          <Divider sx={{
            my: 2,
            borderColor: "rgba(255,255,255,0.15)",
        }}/>


          {/* =================================================
            BOTTOM ROW
            SAME
        ================================================== */}

          <div className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            ">

            {/* COPYRIGHT */}

            <Typography className="text-xs text-slate-500">
              © {new Date().getFullYear()} Travel Empire Holidays. All rights
              reserved.
            </Typography>


            {/* LEGAL LINKS */}

            <div className="
                flex
                flex-wrap
                items-center
                gap-x-7
                gap-y-3
              ">

              <Link to="/terms" className="
                  text-xs
                  text-slate-500
                  no-underline
                  transition-colors
                  hover:text-white
                ">
                Terms & Conditions
              </Link>


              <Link to="/privacy" className="
                  text-xs
                  text-slate-500
                  no-underline
                  transition-colors
                  hover:text-white
                ">
                Privacy Policy
              </Link>


              <Link to="/cookies" className="
                  text-xs
                  text-slate-500
                  no-underline
                  transition-colors
                  hover:text-white
                ">
                Cookies
              </Link>

            </div>

          </div>

        </div>

      </footer>
    </>);
}
export default Footer;
