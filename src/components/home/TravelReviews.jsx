import { useEffect, useState } from "react";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const reviews = [
    {
        name: "Rohan Mehta",
        location: "Mumbai, India",
        image: "https://i.pravatar.cc/400?img=12",
        title: "Amazing Bali Experience",
        review: "Our trip to Bali was absolutely magical! Every detail was perfectly planned and we didn't have to worry about a thing. The hotels, transfers and experiences were excellent.",
    },
    {
        name: "Ananya Singh",
        location: "New Delhi, India",
        image: "https://i.pravatar.cc/400?img=47",
        title: "Excellent Europe Trip",
        review: "The team was very supportive throughout our Europe trip. Great hotels, smooth transfers and amazing local experiences made the entire journey completely hassle-free.",
    },
    {
        name: "Karan Patel",
        location: "Ahmedabad, India",
        image: "https://i.pravatar.cc/400?img=11",
        title: "Perfect Maldives Holiday",
        review: "From booking to the end of the trip, everything was seamless. The Maldives itinerary was beyond our expectations and every arrangement was handled perfectly.",
    },
    {
        name: "Priya & Family",
        location: "Bengaluru, India",
        image: "https://i.pravatar.cc/400?img=32",
        title: "Wonderful Family Vacation",
        review: "Best travel experience ever! The itinerary, stays and activities were perfect for our family. Everything was comfortable, well organized and enjoyable for everyone.",
    },
    {
        name: "Arjun Nair",
        location: "Chennai, India",
        image: "https://i.pravatar.cc/400?img=13",
        title: "Well Planned Experience",
        review: "Excellent service and a very well-curated itinerary. The local guides were knowledgeable and friendly, and the entire trip was organized beautifully.",
    },
    {
        name: "Neha Sharma",
        location: "Pune, India",
        image: "https://i.pravatar.cc/400?img=44",
        title: "Dream Honeymoon",
        review: "Our honeymoon in Switzerland was straight out of a dream. Thank you for making it so special and hassle-free. Every little detail was taken care of.",
    },
    {
        name: "Vikram Kapoor",
        location: "Delhi, India",
        image: "https://i.pravatar.cc/400?img=14",
        title: "Fantastic Dubai Holiday",
        review: "Our Dubai holiday was incredibly smooth from start to finish. The hotel was excellent, transfers were always on time and the sightseeing arrangements were perfect.",
    },
    {
        name: "Sneha Iyer",
        location: "Hyderabad, India",
        image: "https://i.pravatar.cc/400?img=25",
        title: "Beautiful Thailand Trip",
        review: "Thailand was such a memorable experience for us. The itinerary had the perfect balance of sightseeing, relaxation and activities. Everything was arranged wonderfully.",
    },
    {
        name: "Rahul Verma",
        location: "Jaipur, India",
        image: "https://i.pravatar.cc/400?img=68",
        title: "Great Service & Support",
        review: "The support throughout our trip was excellent. Whenever we had a question, the team was quick to respond and make sure everything was taken care of.",
    },
    {
        name: "Meera & Family",
        location: "Kolkata, India",
        image: "https://i.pravatar.cc/400?img=49",
        title: "Memories for a Lifetime",
        review: "Everything was planned beautifully for our family vacation. From the hotel to the sightseeing and transfers, we had a wonderful experience and created amazing memories.",
    },
];
export default function TravelReviews() {
    const [activeIndex, setActiveIndex] = useState(0);
    /*
     * Two cards are visible on desktop.
     * Therefore there are 9 possible carousel positions
     * for 10 reviews.
     */
    const maxIndex = reviews.length - 2;
    const nextReview = () => {
        setActiveIndex((current) => current >= maxIndex ? 0 : current + 1);
    };
    const previousReview = () => {
        setActiveIndex((current) => current <= 0 ? maxIndex : current - 1);
    };
    /* Automatic carousel */
    useEffect(() => {
        const timer = setInterval(() => {
            nextReview();
        }, 5000);
        return () => clearInterval(timer);
    }, []);
    return (<section className="relative  py-10 sm:py-14 lg:py-32">

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
              /> */}
        {/*
              Dark background overlay
              <div className="absolute inset-0 bg-slate-950/55" /> */}

      {/* =====================================================
            MAIN CONTAINER
        ====================================================== */}

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">

        <div className="relative overflow-visible rounded-[24px] bg-[black] shadow-[0_25px_70px_rgba(0,0,0,0.30)]">

          {/* <div className="grid lg:grid-cols-[310px_1fr]"> */}
            <div className="grid items-start lg:grid-cols-[310px_1fr]">

            {/* =================================================
            LEFT BLUE PANEL
        ================================================= */}

            <div className="relative flex flex-col justify-center overflow-hidden rounded-t-[24px] px-7 py-9 sm:px-10 lg:rounded-l-[24px] lg:rounded-tr-none lg:px-9">

              {/* Decorative circles */}
              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/5"/>

              <div className="absolute -bottom-28 -left-24 h-64 w-64 rounded-full border-[40px] border-white/5"/>

              {/* Quote */}
              <div className="relative mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[white] shadow-[0_8px_25px_rgba(0,0,0,0.20)]">

                <FormatQuoteIcon sx={{
            fontSize: 52,
            color: "black",
        }}/>

              </div>

              {/* Heading */}
              <h2 className="relative text-[30px] font-bold leading-[1.08] text-white sm:text-[34px]">
                What Our
                <span className="block">
                  Travelers Say
                </span>
              </h2>

              {/* Description */}
              <p className="relative mt-5 max-w-[250px] text-[14px] leading-6 text-blue-100">
                Real experiences from travelers who explored the world
                with us. Discover why thousands of travelers trust us
                with their holidays.
              </p>

              {/* Rating */}
              <div className="relative mt-5 flex items-center gap-2">

                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (<StarIcon key={star} sx={{
                fontSize: 17,
                color: "#fbbf24",
            }}/>))}
                </div>

                <span className="text-sm font-semibold text-white">
                  4.9/5
                </span>

              </div>

              <p className="relative mt-1 text-xs text-blue-200">
                Based on 500+ traveler reviews
              </p>

              {/* Read More */}
              <button type="button" className="relative mt-6 flex w-fit items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#8ed8c2]">
                Read More

                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#063b72]">
                  <ArrowForwardIosIcon sx={{ fontSize: 8 }}/>
                </span>
              </button>

            </div>

            {/* =================================================
            RIGHT CAROUSEL
        ================================================= */}

            <div className="absolute right-0 bottom-1 w-2/3 min-w-0 overflow-hidden rounded-b-[24px] px-4 pb-8 pt-8 sm:px-7 lg:rounded-r-[24px] lg:rounded-bl-none lg:px-6">

              {/* Cards */}
              <div className="overflow-hidden w-full h-full">

                <div className="flex transition-transform duration-700 ease-in-out h-full" style={{
            transform: `translateX(-${activeIndex * 50}%)`,
        }}>

                  {reviews.map((review, index) => (<div key={index} className="w-1/2 shrink-0 px-2 h-full">

                      {/* =================================================
                LARGE REVIEW CARD
            ================================================= */}

                      <article className="relative overflow-hidden rounded-[20px] bg-white">

                        {/* Customer Image */}
                        <div className="relative h-[170px] overflow-hidden">

                          <img src={review.image} alt={review.name} className="h-full w-full object-cover"/>

                          {/* Image gradient */}
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent"/>

                        </div>

                        {/* =================================================
                CARD CONTENT
            ================================================= */}

                        <div className="relative px-5 pb-5 pt-7">

                          {/* Curved white overlap */}
                         {/* Straight white transition */}
                         <div className="absolute left-0 right-0 top-0 h-5 bg-white"/>

                          {/* Quote */}
                          <FormatQuoteIcon className="absolute right-4 top-3" sx={{
                fontSize: 44,
                color: "#17694d",
                opacity: 0.10,
            }}/>

                          {/* Review title */}
                          <h3 className="relative pr-8 text-[14px] font-bold leading-5 text-slate-900">
                            {review.title}
                          </h3>

                          {/* Review */}
                          <p className="relative mt-3 min-h-[105px] text-[13px] leading-[1.55] text-slate-600">
                            {review.review}
                          </p>

                          {/* Bottom */}
                          <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">

                            {/* Customer */}
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">
                                {review.name}
                              </h4>

                              <p className="mt-0.5 text-[11px] text-slate-500">
                                {review.location}
                              </p>
                            </div>

                            {/* Stars */}
                            <div className="flex shrink-0">
                              {[1, 2, 3, 4, 5].map((star) => (<StarIcon key={star} sx={{
                    fontSize: 16,
                    color: "#f59e0b",
                }}/>))}
                            </div>

                          </div>

                        </div>

                      </article>

                    </div>))}

                </div>

              </div>

              {/* =================================================
            CONTROLS
        ================================================= */}

              <div className="mt-5 flex items-center justify-between px-2">

                {/* Arrow buttons */}
                <div className="flex gap-2">

                  <button type="button" onClick={previousReview} aria-label="Previous review" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[white] text-black transition-all hover:bg-white hover:text-[#063b72]">
                    <ArrowBackIosNewIcon sx={{ fontSize: 13 }}/>
                  </button>

                  <button type="button" onClick={nextReview} aria-label="Next review" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[white] text-black transition-all hover:bg-white hover:text-[#063b72]">
                    <ArrowForwardIosIcon sx={{ fontSize: 13 }}/>
                  </button>

                </div>

                {/* Pagination */}
                <div className="flex items-center gap-2">

                  {Array.from({ length: maxIndex + 1 }).map((_, index) => (<button key={index} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show reviews ${index + 1}`} className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index
                ? "w-6 bg-white"
                : "w-2 bg-white/40 hover:bg-white/70"}`}/>))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>);
}
