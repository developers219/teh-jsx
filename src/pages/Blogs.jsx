import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import blogs from "../constants/blogs";
import SectionHeader from "../components/home/SectionHeader";

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1];
const SLIDE_INTERVAL = 5000;
const FEATURED_COUNT = 6;

const slugify = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Uses blog.id when present, otherwise a slug of the title.
const getId = (blog) => blog.id ?? slugify(blog.title);

const pad = (n) => String(n).padStart(2, "0");

/*
 * Tags mix places and themes, so we classify them. Anything in this set is
 * treated as a destination; every other tag becomes a theme. Add new places
 * here as your content grows. Only values present in the data are shown.
 */
const DESTINATION_TAGS = new Set(
  [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
    "India",
    "UAE",
    "Dubai",
    "Abu Dhabi",
    "Japan",
    "Vietnam",
    "Thailand",
    "Indonesia",
    "Bali",
    "Nepal",
    "Bhutan",
    "Sri Lanka",
    "Maldives",
    "Singapore",
    "Malaysia",
    "Cambodia",
    "Turkey",
    "Egypt",
    "Morocco",
    "Italy",
    "France",
    "Spain",
    "Portugal",
    "Greece",
    "Switzerland",
    "Germany",
    "Czech Republic",
    "Prague",
    "Paris",
    "Rome",
    "London",
    "Tokyo",
    "Kyoto",
    "Meghalaya",
    "Rajasthan",
    "Kerala",
    "Goa",
    "Ladakh",
    "Himachal",
    "Australia",
    "USA",
  ].map((t) => t.toLowerCase()),
);

const isDestination = (tag) => DESTINATION_TAGS.has(tag.toLowerCase());

const uniqueSorted = (arr) =>
  [...new Set(arr)].sort((a, b) => a.localeCompare(b));

/* ------------------------------------------------------------------ *
 * Shared UI
 * ------------------------------------------------------------------ */

// function SectionHeader({ title, description, id }) {
//   return (
//     <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-12">
//       <h2
//         id={id}
//         className="font-cg text-4xl leading-[1.05] tracking-tight text-black md:text-6xl"
//       >
//         {title}
//       </h2>
//       <p className="max-w-md font-mont text-sm leading-7 text-black/60 md:text-base md:leading-8">
//         {description}
//       </p>
//     </div>
//   );
// }

/* ------------------------------------------------------------------ *
 * Section 1: Featured carousel
 * ------------------------------------------------------------------ */

const contentVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function FeaturedCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const go = useCallback(
    (next) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Restarts whenever the slide changes, so manual navigation resets the 5s timer.
  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = setTimeout(() => go(index + 1), SLIDE_INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused, count, go]);

  if (!count) return null;
  const blog = items[index];

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      className="relative isolate h-[600px] overflow-hidden rounded-[28px] bg-black sm:h-[640px] md:rounded-[40px] lg:h-[720px]"
    >
      {/* Background image */}
      <AnimatePresence initial={false}>
        <motion.img
          key={getId(blog)}
          src={blog.thumbnail}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 1.4, ease: EASE },
          }}
          exit={{ opacity: 0, transition: { duration: 0.9 } }}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

      <div className="flex h-full flex-col justify-end p-6 sm:p-8 md:p-12">
        <div aria-live="polite" className="max-w-3xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={getId(blog)}
              variants={contentVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.p
                variants={itemVariants}
                className="mb-4 font-mont text-[11px] uppercase tracking-[0.18em] text-[#F5F3EA]/85 md:text-xs"
              >
                {blog.tags?.slice(0, 3).join(" · ")}
              </motion.p>

              <motion.h2
                variants={itemVariants}
                className="font-cg text-[2rem] leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
                style={{ textWrap: "balance" }}
              >
                <Link
                  to={`/blogs/${index % 6}`}
                  className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-white"
                >
                  {blog.title}
                </Link>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mt-4 line-clamp-3 max-w-xl font-mont text-sm leading-7 text-white/80 md:mt-5 md:text-base md:leading-8"
              >
                {blog.short_desc}
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="mt-5 font-mont text-xs uppercase tracking-[0.16em] text-[#F5F3EA]/70"
              >
                {blog.read_time}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls live in normal flow, so they never sit on top of the text */}
        {count > 1 && (
          <div className="relative z-20 mt-8 flex items-center justify-between gap-4 md:mt-10">
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Choose slide"
            >
              {items.map((b, i) => (
                <button
                  key={getId(b)}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to story ${i + 1}: ${b.title}`}
                  aria-current={i === index}
                  className="group flex h-8 items-center focus-visible:outline-none"
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black ${
                      i === index
                        ? "w-10 bg-white"
                        : "w-4 bg-white/40 group-hover:bg-white/70"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <p className="font-mont text-xs tabular-nums tracking-[0.14em] text-white/80">
                {pad(index + 1)} / {pad(count)}
              </p>
              <div className="flex gap-2">
                {[
                  { label: "Previous story", Icon: ArrowLeft, to: index - 1 },
                  { label: "Next story", Icon: ArrowRight, to: index + 1 },
                ].map(({ label, Icon, to }) => (
                  <motion.button
                    key={label}
                    type="button"
                    onClick={() => go(to)}
                    aria-label={label}
                    whileTap={{ scale: 0.92 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Section 3: Filters
 * ------------------------------------------------------------------ */

function FilterSelect({ id, label, value, onChange, allLabel, options }) {
  const active = value !== "all";
  return (
    <div className="relative w-full lg:w-56">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 w-full cursor-pointer appearance-none rounded-full border border-black py-0 pl-5 pr-11 font-mont text-sm text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
          active ? "bg-[#F5F3EA]" : "bg-white hover:bg-[#F5F3EA]/60"
        }`}
      >
        <option value="all">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-black"
      />
    </div>
  );
}

function FilterBar({
  search,
  setSearch,
  destination,
  setDestination,
  theme,
  setTheme,
  destinations,
  themes,
  count,
  hasFilters,
  onClear,
}) {
  return (
    <div className="mb-10 md:mb-14">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-3 lg:flex-row lg:items-center"
      >
        <div className="relative w-full lg:flex-1">
          <label htmlFor="blog-search" className="sr-only">
            Search stories
          </label>
          <Search
            size={17}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-black/60"
          />
          <input
            id="blog-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories..."
            autoComplete="off"
            className={`h-12 w-full rounded-full border border-black pl-12 pr-5 font-mont text-sm text-black placeholder:text-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
              search ? "bg-[#F5F3EA]" : "bg-white"
            }`}
          />
        </div>

        <FilterSelect
          id="blog-destination"
          label="Filter by destination"
          value={destination}
          onChange={setDestination}
          allLabel="All Destinations"
          options={destinations}
        />
        <FilterSelect
          id="blog-theme"
          label="Filter by theme"
          value={theme}
          onChange={setTheme}
          allLabel="All Themes"
          options={themes}
        />
      </form>

      <div className="mt-6 flex items-center justify-between border-b border-black/10 pb-4">
        <p aria-live="polite" className="font-mont text-sm text-black/60">
          Showing {count} {count === 1 ? "story" : "stories"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-full font-mont text-sm text-black underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <X size={14} aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Blog card
 * ------------------------------------------------------------------ */

function BlogCard({ blog, index }) {
  const large = index % 6 === 2;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.08 }}
      whileHover="hover"
      className={"sm:w-[47%] lg:w-[30%]"}
    >
      <Link
        to={`/blogs/${index % 6}`}
        className="group block rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
      >
        <div className="aspect-[4/3] overflow-hidden rounded-[24px] bg-[#F5F3EA] md:rounded-[32px]">
          <motion.img
            src={blog.thumbnail}
            alt={`${blog.title}`}
            loading="lazy"
            decoding="async"
            variants={{ hover: { scale: 1.05 } }}
            transition={{ duration: 0.8, ease: EASE }}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="pt-5 md:pt-6">
          <p className="font-mont text-[11px] uppercase tracking-[0.16em] text-black/55">
            {blog.tags?.slice(0, 3).join(" · ")}
          </p>

          <div className="mt-3 flex items-start justify-between gap-4">
            <h3
              className={`font-cg leading-[1.1] tracking-tight text-black 
                
                  text-2xl md:text-3xl`}
              style={{ textWrap: "balance" }}
            >
              {blog.title}
            </h3>
            <motion.span
              aria-hidden="true"
              variants={{ hover: { x: 3, y: -3 } }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 text-black transition-colors group-hover:bg-black group-hover:text-white sm:flex"
            >
              <ArrowUpRight size={18} strokeWidth={1.5} />
            </motion.span>
          </div>

          <p className="mt-3 line-clamp-3 max-w-xl font-mont text-sm leading-7 text-black/60 md:text-[0.95rem]">
            {blog.short_desc}
          </p>

          <p className="mt-5 font-mont text-[11px] uppercase tracking-[0.14em] text-black/45">
            {blog.date_published} · {blog.read_time}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center rounded-[28px] bg-[#F5F3EA] px-6 py-20 text-center md:py-28">
      <h3 className="font-cg text-3xl text-black md:text-4xl">
        No stories found.
      </h3>
      <p className="mt-3 max-w-sm font-mont text-sm leading-7 text-black/60">
        Try another destination, theme or search term.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-8 h-12 rounded-full bg-black px-8 font-mont text-sm text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        Clear Filters
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function Blogs() {
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("all");
  const [theme, setTheme] = useState("all");

  const featured = useMemo(() => blogs.slice(0, FEATURED_COUNT), []);

  // Filter options are derived from the data.
  const { destinations, themes } = useMemo(() => {
    const tags = blogs.flatMap((b) => b.tags ?? []);
    return {
      destinations: uniqueSorted(tags.filter(isDestination)),
      themes: uniqueSorted(tags.filter((t) => !isDestination(t))),
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blogs.filter((b) => {
      const tags = (b.tags ?? []).map((t) => t.toLowerCase());
      if (destination !== "all" && !tags.includes(destination.toLowerCase()))
        return false;
      if (theme !== "all" && !tags.includes(theme.toLowerCase())) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.short_desc.toLowerCase().includes(q) ||
        tags.some((t) => t.includes(q))
      );
    });
  }, [search, destination, theme]);

  const hasFilters =
    Boolean(search.trim()) || destination !== "all" || theme !== "all";
  const clearFilters = () => {
    setSearch("");
    setDestination("all");
    setTheme("all");
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="h-18 md:h-40 bg-black"></div>
      <main className="bg-white pb-8">
        <div className="mx-auto max-w-7xl px-5 md:px-8 pt-5">
          {/* Page label + carousel */}
          <h1 className="sr-only">Travel Journal</h1>
          {/* <p className="mb-5 font-mont text-[11px] uppercase tracking-[0.18em] text-black/50 md:mb-6">
            Blogs / Travel Journal
          </p> */}
          <FeaturedCarousel items={featured} />

          {/* Trending */}
          <section aria-labelledby="trending-heading" className="my-16">
            <SectionHeader
              id="trending-heading"
              title="Trending Stories"
              description="The stories our readers keep coming back to, from quiet markets to far-flung coastlines."
            />
            {/* Trending blogs will be added later */}
            <div className="flex min-h-[200px] mt-8 items-center justify-center rounded-[28px] border border-black/10 bg-[#F5F3EA]/60 px-6 py-12 text-center">
              <p className="max-w-xs font-cg text-xl leading-snug text-black/45 md:text-2xl">
                A fresh selection is being curated.
              </p>
            </div>
          </section>

          {/* Explore */}
          <section aria-labelledby="explore-heading" className="my-16">
            <SectionHeader
              id="explore-heading"
              title="Explore the Journal"
              description="Stories, guides and inspiration for wherever you're headed next."
            />
            <div className="mt-8">
              <FilterBar
                search={search}
                setSearch={setSearch}
                destination={destination}
                setDestination={setDestination}
                theme={theme}
                setTheme={setTheme}
                destinations={destinations}
                themes={themes}
                count={filtered.length}
                hasFilters={hasFilters}
                onClear={clearFilters}
              />
            </div>

            {filtered.length ? (
              <div className="flex flex-wrap justify-between gap-5">
                {filtered.map((blog, i) => (
                  <BlogCard key={getId(blog)} blog={blog} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState onClear={clearFilters} />
            )}
          </section>
        </div>
      </main>
    </MotionConfig>
  );
}
