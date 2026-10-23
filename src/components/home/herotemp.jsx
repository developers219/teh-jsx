import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, Star } from "lucide-react";
import Typewriter from "../ui/Typewriter";
import api from "../../services/api";

const HERO_API = "https://cms.trvldeals.com/api/public/hero-sections";

// Local fallback video inside the public folder
const STATIC_HERO_VIDEO = "/hero_compressed.mp4";

// Used for the typing placeholder until the real destinations load
const FALLBACK_DESTINATIONS = [
  "Bali",
  "Dubai",
  "Thailand",
  "Vietnam",
  "Maldives",
  "Mauritius",
  "Japan",
  "Sri Lanka",
];

const DEFAULT_STATS = [
  "15+ Years Experience",
  "24/7 Expert Travel Support",
  "50+ Happy Travellers",
  "80+ International Trips",
  "100+ Handpicked Destinations",
  "150+ India Tour Packages",
];

// Shown only until backend reviews load (or if they fail to load)
const GOOGLE_RATING = "4.6";

/* ---------------------------------------------------------------
   Reviews helper
---------------------------------------------------------------- */
// Average rating + count from backend reviews
function getReviewStats(reviews) {
  const ratings = (Array.isArray(reviews) ? reviews : [])
    .map((r) => Number(r?.rating))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (!ratings.length) return null;

  const average = ratings.reduce((sum, n) => sum + n, 0) / ratings.length;
  return { average: average.toFixed(1), count: ratings.length };
}

/* ---------------------------------------------------------------
   Search helpers
---------------------------------------------------------------- */
const norm = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim();

// Backend categories: 1 = Domestic, 2 = International
const categorySlug = (destination) =>
  destination?._cat ??
  (destination?.categoryName === "International" ? "intl" : "dom");

const buildPath = (destination, theme) =>
  `/destinations/${categorySlug(destination)}/${destination.slug}${
    theme ? `?themeId=${theme.id}` : ""
  }`;

/*
 * Read the video URL from common CMS response formats.
 * If your backend uses a different field name, add it here.
 */
function getCmsVideoUrl(data) {
  const possibleUrls = [
    data?.videoUrl,
    data?.videoURL,
    data?.video_url,
    data?.video,
    data?.backgroundVideo,
    data?.backgroundVideoUrl,
    data?.background_video,
    data?.background_video_url,
    data?.mediaUrl,
    data?.media_url,
    data?.heroVideo,
    data?.heroVideoUrl,
    data?.hero_video,
    data?.hero_video_url,
    data?.video?.url,
    data?.video?.secure_url,
    data?.backgroundVideo?.url,
    data?.background_video?.url,
  ];

  return (
    possibleUrls.find(
      (url) => typeof url === "string" && url.trim().length > 0,
    ) || null
  );
}

/* Rotating statistics list */
function Statistics({ items }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return undefined;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <ul className="flex flex-col items-end gap-2">
      {items.map((stat, i) => (
        <li
          key={stat}
          className={`w-fit rounded-full px-6 py-2 text-right text-sm font-semibold backdrop-blur-xs ${
            active === i
              ? "-translate-x-4 border-2 border-[#b8934a] bg-gray-900/50 text-white shadow-[0_0_12px_rgba(250,204,21,0.35)] transition duration-700"
              : "bg-gray-900/30 text-gray-400"
          }`}
        >
          {stat}
        </li>
      ))}
    </ul>
  );
}

/* One suggestion row inside the search dropdown */
function SuggestionRow({ row, active, onSelect }) {
  let title;
  let tag;
  let hint = "";

  if (row.type === "combo") {
    title = `${row.dest.name} · ${row.theme.name}`;
    tag = "Packages";
    hint = [row.dest.city, row.dest.country].filter(Boolean).join(", ");
  } else if (row.type === "destination") {
    title = row.dest.name;
    tag = "Destination";
    hint = [row.dest.city, row.dest.country].filter(Boolean).join(", ");
  } else {
    title = row.theme.name;
    tag = "Theme";
    hint = "View packages";
  }

  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      // keep focus in the input while clicking a suggestion
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelect(row)}
      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition ${
        active ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-gray-900">
          {title}
        </span>
        {hint && (
          <span className="block truncate text-xs text-gray-500">{hint}</span>
        )}
      </span>
      <span className="shrink-0 rounded-full bg-gray-900/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
        {tag}
      </span>
    </button>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [heroData, setHeroData] = useState(null);

  // Tracks whether the local fallback video should be used
  const [useStaticVideo, setUseStaticVideo] = useState(false);

  // ---- Search state (all data comes from the backend) ----
  const [destinationList, setDestinationList] = useState([]);
  const [themeList, setThemeList] = useState([]);
  const [searchDataLoading, setSearchDataLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // { average, count } calculated from backend reviews
  const [reviewStats, setReviewStats] = useState(null);
  const searchRef = useRef(null);

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
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching hero section:", error);
        }
        // heroData remains null, so the static video is used
      }
    };

    fetchHeroData();

    return () => controller.abort();
  }, []);

  // Fetch destinations + themes (search) and reviews (rating) from backend
  useEffect(() => {
    const controller = new AbortController();

    const fetchSearchData = async () => {
      const [destRes, themeRes, reviewRes] = await Promise.allSettled([
        api.get("/destinations", { signal: controller.signal }),
        api.get("/themes", { signal: controller.signal }),
        api.get("/reviews", { signal: controller.signal }),
      ]);

      if (controller.signal.aborted) return;

      if (destRes.status === "fulfilled") {
        const list = destRes.value.data?.data;
        setDestinationList(
          Array.isArray(list) ? list.filter((d) => d?.name && d?.slug) : [],
        );
      }

      if (themeRes.status === "fulfilled") {
        const list = themeRes.value.data?.data;
        setThemeList(
          Array.isArray(list)
            ? list.filter((t) => t?.name && t?.id != null)
            : [],
        );
      }

      if (reviewRes.status === "fulfilled") {
        setReviewStats(getReviewStats(reviewRes.value.data?.data));
      }

      setSearchDataLoading(false);
    };

    fetchSearchData();

    return () => controller.abort();
  }, []);

  // Close the dropdown when clicking outside the search box
  useEffect(() => {
    const handleOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Typing placeholder uses real destination names once loaded
  const placeholderWords = useMemo(
    () =>
      destinationList.length
        ? destinationList.map((d) => d.name)
        : FALLBACK_DESTINATIONS,
    [destinationList],
  );

  const query = norm(destination);

  // Suggestion rows: destination + theme combos, destinations, themes
  const rows = useMemo(() => {
    if (!query) return [];

    const result = [];

    // "bali honeymoon" -> destination + theme combination
    const mentionedDest = destinationList.find((d) =>
      query.includes(norm(d.name)),
    );
    const mentionedTheme = themeList.find((t) => query.includes(norm(t.name)));

    if (mentionedDest && mentionedTheme) {
      result.push({
        type: "combo",
        dest: mentionedDest,
        theme: mentionedTheme,
      });
    }

    const matchedDestinations = destinationList
      .filter((d) =>
        [d.name, d.city, d.country].some((v) => norm(v).includes(query)),
      )
      .sort(
        (a, b) =>
          Number(!norm(a.name).startsWith(query)) -
          Number(!norm(b.name).startsWith(query)),
      );

    const uniqueDestinations = [
      ...(mentionedDest ? [mentionedDest] : []),
      ...matchedDestinations,
    ].filter(
      (d, index, all) => all.findIndex((x) => x.slug === d.slug) === index,
    );

    const destinationRows = uniqueDestinations
      .slice(0, 5)
      .map((dest) => ({ type: "destination", dest }));

    const themeRows = themeList
      .filter((t) => norm(t.name).includes(query))
      .slice(0, 3)
      .map((theme) => ({ type: "theme", theme }));

    // Exact theme name (e.g. "honeymoon") -> theme packages come first,
    // so pressing Enter opens that theme's packages
    const exactTheme = themeRows.some((row) => norm(row.theme.name) === query);

    result.push(
      ...(exactTheme
        ? [...themeRows, ...destinationRows]
        : [...destinationRows, ...themeRows]),
    );

    return result;
  }, [query, destinationList, themeList]);

  const handleSelect = (row) => {
    if (!row) return;

    setIsOpen(false);

    // Theme -> open that theme's packages
    if (row.type === "theme") {
      navigate(`/themes/${row.theme.id}`);
      return;
    }

    // Destination (optionally with a theme) -> destination page
    navigate(buildPath(row.dest, row.theme));
  };

  const handleSearchChange = (value) => {
    setDestination(value);
    setActiveIndex(-1);
    setIsOpen(true);
  };

  const handleExplore = (event) => {
    event?.preventDefault();

    if (!destination.trim()) return;

    const row = activeIndex >= 0 ? rows[activeIndex] : rows[0];

    if (row) {
      handleSelect(row);
    } else {
      // nothing matched: dropdown shows the "no results" message
      setIsOpen(true);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (rows.length ? (prev + 1) % rows.length : -1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        rows.length ? (prev <= 0 ? rows.length - 1 : prev - 1) : -1,
      );
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showDropdown = isOpen && Boolean(query);

  // Dynamic video URL from CMS
  const dynamicVideo = getCmsVideoUrl(heroData);

  // Reset video selection whenever the CMS video changes
  useEffect(() => {
    setUseStaticVideo(false);
  }, [dynamicVideo]);

  // Use the CMS video when available; otherwise use the local video
  const videoSrc =
    dynamicVideo && !useStaticVideo ? dynamicVideo : STATIC_HERO_VIDEO;

  // Dynamic heading + description
  const heading = (
    heroData?.heading || "This is where your love for travel begins."
  ).trim();

  const description =
    heroData?.description ||
    "Discover handpicked destinations, thoughtfully crafted holidays";

  // Last word of the heading is highlighted in gold
  const headingWords = heading.split(/\s+/);
  const highlight = headingWords.length > 1 ? headingWords.pop() : "";
  const headingStart = headingWords.join(" ");

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

  // Optional CMS stats
  const cmsStats = Array.isArray(heroData?.stats)
    ? heroData.stats
        .filter((s) => s?.label && s?.value)
        .map((s) => `${s.value} ${s.label}`)
    : [];

  const stats = cmsStats.length ? cmsStats : DEFAULT_STATS;

  // If the CMS video fails to load, switch to the local video.
  // If the local video itself fails, avoid repeatedly switching sources.
  const handleVideoError = () => {
    if (dynamicVideo && !useStaticVideo) {
      console.warn("CMS hero video failed to load. Using the static fallback.");
      setUseStaticVideo(true);
    } else {
      console.error("The local hero fallback video could not be loaded.");
    }
  };

  return (
    <section className="relative h-svh max-h-[1000px] min-h-[600px] w-full overflow-hidden">
      {/* Background video: CMS first, local fallback when needed */}
      <video
        key={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={handleVideoError}
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Bottom gradient for text contrast */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 from-1% to-transparent to-80%" />

      {/* Hero content */}
      <div className="absolute inset-0">
        <div className="mx-auto flex h-full w-full max-w-7xl items-end px-2 sm:px-4 lg:px-6 xl:px-0">
          <div className="flex w-full flex-col justify-end gap-8 pb-[clamp(2rem,6vw,4rem)] lg:flex-row lg:items-end">
            {/* LEFT */}
            <div className="flex w-full flex-col gap-[clamp(1rem,2vw,2rem)] px-2 lg:w-2/3">
              {/* Badge */}
              <div
                style={descriptionStyle}
                className="w-fit max-w-full rounded-full border-gray-100 bg-black/20 px-6 py-2 font-mont text-xs font-semibold uppercase text-gray-300 backdrop-blur-sm"
              >
                {description}
              </div>

              {/* Heading */}
              <h2
                style={headingStyle}
                className="font-cg text-[clamp(2.4rem,5.5vw,4rem)] font-medium leading-[1.1] text-white"
              >
                {headingStart}{" "}
                {highlight && (
                  <span className="italic text-yellow-400">{highlight}</span>
                )}
              </h2>

              {/* Search pill */}
              <form
                ref={searchRef}
                onSubmit={handleExplore}
                className="relative flex w-full items-center rounded-full bg-white p-1 font-mont text-slate-500 shadow-lg sm:w-[80%]"
              >
                <span className="shrink-0 rounded-full p-3 sm:p-4">
                  <Search size={20} />
                </span>

                <div className="min-w-0 flex-1 text-sm text-gray-500 sm:text-base">
                  <Typewriter
                    words={placeholderWords}
                    value={destination}
                    onChange={handleSearchChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>

                <button
                  type="submit"
                  aria-label="Explore destination"
                  className="shrink-0 cursor-pointer rounded-full bg-gray-900 p-3 text-white transition hover:bg-black sm:p-4"
                >
                  <ArrowRight size={20} />
                </button>

                {/* Suggestions (opens upward so the hero never clips it) */}
                {showDropdown && (
                  <div
                    role="listbox"
                    className="absolute bottom-full left-0 z-30 mb-2 max-h-72 w-full overflow-y-auto rounded-2xl bg-white p-2 text-left shadow-xl"
                  >
                    {rows.map((row, index) => (
                      <SuggestionRow
                        key={`${row.type}-${row.dest?.slug ?? ""}-${row.theme?.id ?? ""}`}
                        row={row}
                        active={index === activeIndex}
                        onSelect={handleSelect}
                      />
                    ))}

                    {rows.length === 0 && (
                      <p className="px-4 py-3 text-sm text-gray-500">
                        {searchDataLoading
                          ? "Searching…"
                          : `No destination or theme found for “${destination.trim()}”.`}
                      </p>
                    )}
                  </div>
                )}
              </form>

              {/* Rating (calculated from backend reviews) */}
              <div className="flex items-center font-mont">
                <Star
                  size={24}
                  className="text-yellow-400"
                  fill="currentColor"
                />

                <div className="ml-2 text-sm font-semibold italic text-gray-100">
                  {reviewStats ? (
                    <>
                      {reviewStats.average}{" "}
                      <span>
                        based on {reviewStats.count}{" "}
                        {reviewStats.count === 1 ? "Review" : "Reviews"}
                      </span>
                    </>
                  ) : (
                    <>
                      {GOOGLE_RATING} <span>based on Google Reviews</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: rotating stats (desktop only) */}
            <div className="hidden font-mont lg:flex lg:w-1/3 lg:justify-end">
              <Statistics items={stats} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}