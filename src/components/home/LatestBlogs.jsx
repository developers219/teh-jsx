import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader";

/* =========================================================
   BLOG DATA
========================================================= */

const blogs = [
  {
    id: 1,
    category: "Beach Escapes",
    title: "The Best Beach Destinations for Your Next Escape",
    description:
      "Discover beautiful beaches, crystal-clear waters and unforgettable coastal experiences for your next holiday.",
    date: "Mar 09, 2024",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=90",
  },

  {
    id: 2,
    category: "Travel Inspiration",
    title: "Beautiful Journeys Worth Taking Once in a Lifetime",
    description:
      "From hidden escapes to iconic destinations, explore journeys that deserve a place on your travel list.",
    date: "Mar 05, 2024",
    image:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1600&q=90",
  },

  {
    id: 3,
    category: "Travel Guide",
    title: "A Complete Guide to Planning Your Dream Vacation",
    description:
      "Everything you need to know before turning your holiday plans into a beautifully planned travel experience.",
    date: "Feb 28, 2024",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=90",
  },

  {
    id: 4,
    category: "Luxury Travel",
    title: "Luxury Experiences That Make Every Journey Special",
    description:
      "Explore handpicked stays, remarkable experiences and destinations designed for travellers who want something more.",
    date: "Feb 22, 2024",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=90",
  },

  {
    id: 5,
    category: "Adventure",
    title: "Adventure Holidays for Those Who Love to Explore",
    description:
      "Take the road less travelled with exciting destinations, unforgettable landscapes and experiences full of adventure.",
    date: "Feb 18, 2024",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=90",
  },

  {
    id: 6,
    category: "Family Holidays",
    title: "Family Holiday Ideas for an Unforgettable Escape",
    description:
      "Find inspiring destinations and memorable experiences designed to bring the whole family closer together.",
    date: "Feb 12, 2024",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=90",
  },

  {
    id: 7,
    category: "International",
    title: "International Destinations You Should Visit This Year",
    description:
      "Discover incredible international destinations and start planning your next unforgettable journey.",
    date: "Feb 08, 2024",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=90",
  },

  {
    id: 8,
    category: "Honeymoon",
    title: "Romantic Getaways for an Unforgettable Honeymoon",
    description:
      "From private villas to beautiful beaches, discover romantic escapes perfect for celebrating your love.",
    date: "Feb 02, 2024",
    image:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1600&q=90",
  },
];

/* =========================================================
   CALENDAR ICON
========================================================= */

function CalendarIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

/* =========================================================
   ARROW ICON
========================================================= */

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 19L19 5" />
      <path d="M9 5h10v10" />
    </svg>
  );
}

/* =========================================================
   BLOG CARD
========================================================= */

function BlogCard({ blog }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="
                relative
                h-[520px]
                w-full
                shrink-0
                overflow-hidden
                bg-slate-200
                md:h-[570px]
                lg:h-[620px]
            "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* =================================================
                IMAGE
            ================================================== */}

      <img
        src={blog.image}
        alt={blog.title}
        draggable="false"
        className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-[1800ms]
                    ease-out
                    hover:scale-[1.04]
                "
      />

      {/* =================================================
                IMAGE OVERLAY
            ================================================== */}

      <div
        className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/75
                    via-black/10
                    to-transparent
                "
      />

      {/* =================================================
                TOP CATEGORY BADGE
            ================================================== */}

      {/* <div
                className="
                    absolute
                    left-6
                    top-6
                    z-20
                    rounded-full
                    border
                    border-white/40
                    bg-black/20
                    px-4
                    py-2
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-white
                    backdrop-blur-md
                "
            >
                {blog.category}
            </div> */}

      {/* =================================================
                NORMAL BOTTOM CONTENT
            ================================================== */}

      <div
        className={`
                    absolute
                    bottom-0
                    left-0
                    right-0
                    z-10
                    p-6
                    transition-all
                    duration-500
                    ease-out
                    ${
                      hovered
                        ? "translate-y-3 opacity-0"
                        : "translate-y-0 opacity-100"
                    }
                `}
      >
        {/* DATE */}

        {/* <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                        text-[11px]
                        font-medium
                        text-white/75
                    "
                >
                    <CalendarIcon />

                    <span>{blog.date}</span>
                </div> */}

        {/* TITLE */}

        <div className="flex items-end justify-between gap-4">
          <h3
            className="
                            max-w-[90%]
                            text-[21px]
                            font-semibold
                            leading-[1.18]
                            tracking-[-0.025em]
                            text-white
                            md:text-[23px]
                        "
          >
            {blog.title}
          </h3>

          {/* ARROW */}

          {/* <span
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/40
                            bg-white/10
                            text-white
                            backdrop-blur-md
                        "
                    >
                        <ArrowIcon />
                    </span> */}
        </div>
      </div>

      {/* =================================================
                HOVER GLASSMORPHISM DESCRIPTION
            ================================================== */}

      <div
        className={`
                    absolute
                    bottom-0
                    
                   
                   
                    border
                    border-white/30
                    bg-white/[0.14]
                    p-5
                    text-white
                    shadow-2xl
                    backdrop-blur-xl
                    transition-all
                    duration-700
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${
                      hovered
                        ? "translate-y-0 opacity-100"
                        : "translate-y-[110%] opacity-0"
                    }
                `}
      >
        {/* CATEGORY */}

        <div
          className="
                        text-[10px]
                        font-mont
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-white/70
                    "
        >
          {blog.category}
        </div>

        {/* TITLE */}

        <h3
          className="
                        mt-2
                        text-[21px]
                        font-semibold
                        leading-[1.2]
                        tracking-[-0.02em]
                        text-white
                    "
        >
          {blog.title}
        </h3>

        {/* DESCRIPTION */}

        <p
          className="
                        mt-3
                        text-[13px]
                        font-mont
                        leading-[1.55]
                        text-white/80
                    "
        >
          {blog.description}
        </p>

        {/* BOTTOM */}

        <div
          className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        border-t
                        border-white/20
                        pt-4
                    "
        >
          <div
            className="
                            flex
                            items-center
                            gap-2
                            text-[11px]
                            font-mont
                            text-white/70
                        "
          >
            <CalendarIcon />

            {blog.date}
          </div>

          <span
            className="
                            flex
                            items-center
                            gap-1.5
                            text-[12px]
                            font-semibold
                            text-white
                            font-mont
                        "
          >
            Read More
            <ArrowIcon />
          </span>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   LATEST BLOGS
========================================================= */

function LatestBlogs() {
  const trackRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);

  const animationFrame = useRef(null);

  const position = useRef(0);

  const lastTime = useRef(null);

  /*
   * Speed of movement.
   *
   * Lower number = slower.
   *
   * 0.035 gives a very slow premium
   * travel-site style movement.
   */
  const SPEED = 0.035;

  /* =======================================================
       CONTINUOUS MOVEMENT
    ======================================================= */

  useEffect(() => {
    const move = (time) => {
      if (lastTime.current === null) {
        lastTime.current = time;
      }

      const delta = time - lastTime.current;

      lastTime.current = time;

      if (!isPaused && trackRef.current) {
        position.current -= SPEED * delta;

        /*
         * We have two identical copies of the cards.
         *
         * Once the first copy has completely moved away,
         * reset position by exactly half of the track.
         *
         * This creates a seamless infinite loop.
         */

        const halfWidth = trackRef.current.scrollWidth / 2;

        if (Math.abs(position.current) >= halfWidth) {
          position.current += halfWidth;
        }

        trackRef.current.style.transform = `translate3d(${position.current}px, 0, 0)`;
      }

      animationFrame.current = requestAnimationFrame(move);
    };

    animationFrame.current = requestAnimationFrame(move);

    return () => {
      cancelAnimationFrame(animationFrame.current);
    };
  }, [isPaused]);

  /* =======================================================
       RESET TIMER WHEN PAUSED / RESUMED
    ======================================================= */

  useEffect(() => {
    lastTime.current = null;
  }, [isPaused]);

  /* =======================================================
       DUPLICATE CARDS
    ======================================================= */

  const duplicatedBlogs = [...blogs, ...blogs];

  return (
    <section
      className="
                overflow-hidden
                bg-slate-50
                py-20
                lg:py-24
            "
    >
      {/* =================================================
                HEADER
            ================================================== */}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          title="Latest Blogs"
          description="Explore travel inspiration, destination guides, useful tips, and ideas to help you plan your next journey."
        />
      </div>

      {/* =================================================
                SPACE
            ================================================== */}

      <div className="h-12" />

      {/* =================================================
                CAROUSEL VIEWPORT
            ================================================== */}

      <div
        className="
                    relative
                    w-full
                    overflow-hidden
                "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* =================================================
                    MOVING TRACK
                ================================================== */}

        <div
          ref={trackRef}
          className="
                        flex
                        w-max
                        will-change-transform
                    "
        >
          {duplicatedBlogs.map((blog, index) => (
            <div
              key={`${blog.id}-${index}`}
              className="
                                w-[88vw]
                                shrink-0
                                sm:w-[65vw]
                                md:w-[50vw]
                                lg:w-[25vw]
                                xl:w-[25vw]
                            "
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
                BOTTOM INDICATOR
            ================================================== */}

      {/* <div
                className="
                    mx-auto
                    mt-8
                    flex
                    items-center
                    justify-center
                    gap-3
                "
            >
                <span
                    className="
                        h-1.5
                        w-8
                        rounded-full
                        bg-slate-900
                    "
                />

                <span
                    className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.18em]
                        text-slate-400
                    "
                >
                    Explore Stories
                </span>
            </div> */}
    </section>
  );
}

export default LatestBlogs;
