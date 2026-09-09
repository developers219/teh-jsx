import SectionHeader from "./SectionHeader";
import Carousel from "../ui/Carousel";
import { Link } from "react-router-dom";

const blogs = [
    {
        id: 1,
        category: "Data Science",
        author: "William Ashford",
        readTime: "5 min read",
        title: "Optimizing Business decisions with Advanced data Analytics",
        description:
            "Discover how web solutions are reshaping the business landscape.",
        date: "Mar 09, 2024",
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    },
    {
        id: 2,
        category: "Travel Tips",
        author: "Emily Carter",
        readTime: "6 min read",
        title: "How to Plan the Perfect International Holiday",
        description:
            "Simple planning strategies to make your next international trip smoother.",
        date: "Mar 05, 2024",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    },
    {
        id: 3,
        category: "Destinations",
        author: "Daniel Wilson",
        readTime: "4 min read",
        title: "Top Destinations to Add to Your Travel List",
        description:
            "Explore beautiful destinations and discover experiences worth planning for.",
        date: "Feb 28, 2024",
        image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
    },
    {
        id: 4,
        category: "Travel Guide",
        author: "Sophia Martin",
        readTime: "7 min read",
        title: "A Complete Guide to Planning Your Dream Vacation",
        description:
            "Everything you need to know before turning your holiday plans into reality.",
        date: "Feb 22, 2024",
        image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=85",
    },
    {
        id: 5,
        category: "Holiday Ideas",
        author: "James Anderson",
        readTime: "5 min read",
        title: "Family Holiday Ideas for an Unforgettable Escape",
        description:
            "Find inspiring holiday ideas designed for memorable family experiences.",
        date: "Feb 18, 2024",
        image:
            "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85",
    },
    {
        id: 6,
        category: "Travel Trends",
        author: "Olivia Brown",
        readTime: "5 min read",
        title: "The Travel Trends Shaping Holidays This Year",
        description:
            "Discover the latest travel trends and how they are changing the way we explore.",
        date: "Feb 12, 2024",
        image:
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85",
    },
];

/* =========================================================
   CALENDAR ICON
========================================================= */

function CalendarIcon() {
    return (
        <svg
            width="17"
            height="17"
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
            width="22"
            height="22"
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
    return (
        <article
            className="
        group
        h-full
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200
        bg-white
       
        transition-all
        duration-700
        hover:scale-105
       
      "
        >
            {/* =================================================
          IMAGE
      ================================================== */}

            <div className="relative m-3 overflow-hidden rounded-[16px]">
                <div className="aspect-[1.65/1] w-full overflow-hidden bg-slate-100">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.04]
            "
                        loading="lazy"
                    />
                </div>

                {/* CATEGORY BADGE */}

                <div
                    className="
            absolute
            left-3
            top-3
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-white/95
            px-3
            py-1.5
            text-[11px]
            font-semibold
            text-slate-800
            shadow-sm
            backdrop-blur-sm
          "
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />

                    {blog.category}
                </div>
            </div>

            {/* =================================================
          CONTENT
      ================================================== */}

            <div className="px-4 pb-5 pt-1 sm:px-5">
                {/* AUTHOR + READ TIME */}

                <div
                    className="
            flex
            items-center
            gap-2
            text-[11px]
            font-medium
            text-slate-500
          "
                >
                    <span className="text-slate-700">
                        {blog.author}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-400" />

                    <span>{blog.readTime}</span>
                </div>

                {/* TITLE + ARROW */}

                <div className="mt-3 flex items-start gap-3">
                    <h3
                        className="
              min-w-0
              flex-1
              text-[17px]
              font-extrabold
              leading-[1.25]
              tracking-[-0.02em]
              text-slate-950
            "
                    >
                        {blog.title}
                    </h3>

                    <button
                        type="button"
                        aria-label={`Read ${blog.title}`}
                        className="
              mt-0.5
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-slate-600
              transition-all
              duration-300
              group-hover:bg-slate-100
              group-hover:text-slate-950
            "
                    >
                        <ArrowIcon />
                    </button>
                </div>

                {/* DESCRIPTION */}

                <p
                    className="
            mt-2.5
            line-clamp-2
            text-[13px]
            leading-[1.55]
            text-slate-500
          "
                >
                    {blog.description}
                </p>

                {/* DATE */}

                <div
                    className="
            mt-4
            flex
            items-center
            gap-2
            text-[12px]
            font-medium
            text-slate-500
          "
                >
                    <CalendarIcon />

                    <span>{blog.date}</span>
                </div>
            </div>
        </article>
    );
}

/* =========================================================
   LATEST BLOGS SECTION
========================================================= */

function LatestBlogs() {
    return (
        <section className="bg-slate-50 px-6 py-20 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* SECTION HEADER */}

                <SectionHeader
                    // eyebrow="OUR BLOG"
                    title="Latest Blogs"
                    description="Explore travel inspiration, destination guides, useful tips, and ideas to help you plan your next journey."
                />

                {/* BLOG CAROUSEL */}

                <div >
                    <Carousel
                        items={blogs}
                        gap={20}
                        showArrows={true}
                        renderItem={(blog) => (
                            <Link to="/blogs/random"><BlogCard blog={blog} /></Link>
                        )}
                    />
                </div>

            </div>
        </section>
    );
}

export default LatestBlogs;