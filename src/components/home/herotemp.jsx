import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, Star } from "lucide-react";
import Typewriter from "../ui/Typewriter";
import api from "../../services/api";

const HERO_API = "https://cms.trvldeals.com/api/public/hero-sections";

const STATIC_HERO_VIDEO = "/hero_compressed.mp4";

const STATIC_HERO_MOBILE_VIDEO = "";

const STATIC_HERO_POSTER = "/hero_poster.jpg";

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

/* ---------------------------------------------------------------
   CMS media helpers
---------------------------------------------------------------- */

// First non-empty string from a list of possible values
const firstValidUrl = (urls) =>
  urls.find((url) => typeof url === "string" && url.trim().length > 0) || null;

/*
 * Read the video URL from common CMS response formats.
 * If your backend uses a different field name, add it here.
 */
function getCmsVideoUrl(data) {
  return firstValidUrl([
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
  ]);
}

/*
 * Optional: separate portrait (9:16 / 4:5) video for small screens.
 * If the CMS does not send one, the normal video is used on mobile too.
 */
function getCmsMobileVideoUrl(data) {
  return firstValidUrl([
    data?.mobileVideo,
    data?.mobileVideoUrl,
    data?.mobile_video,
    data?.mobile_video_url,
    data?.videoMobile,
    data?.video_mobile,
    data?.mobileVideo?.url,
    data?.mobile_video?.url,
  ]);
}

/*
 * Optional: poster / background image (desktop).
 */
function getCmsPosterUrl(data) {
  return firstValidUrl([
    data?.posterUrl,
    data?.poster_url,
    data?.poster,
    data?.imageUrl,
    data?.image_url,
    data?.image,
    data?.backgroundImage,
    data?.background_image,
    data?.heroImage,
    data?.hero_image,
    data?.poster?.url,
    data?.image?.url,
    data?.backgroundImage?.url,
    data?.background_image?.url,
  ]);
}

/*
 * Optional: poster / background image for mobile (portrait).
 */
function getCmsMobilePosterUrl(data) {
  return firstValidUrl([
    data?.mobilePosterUrl,
    data?.mobile_poster_url,
    data?.mobilePoster,
    data?.mobile_poster,
    data?.mobileImageUrl,
    data?.mobile_image_url,
    data?.mobileImage,
    data?.mobile_image,
    data?.mobileBackgroundImage,
    data?.mobile_background_image,
    data?.mobilePoster?.url,
    data?.mobileImage?.url,
    data?.mobile_image?.url,
  ]);
}

/*
 * Optional: which part of the video/image stays visible when it gets cropped.
 * Accepts: left | center | right | "30% 50%" etc. Default: center.
 * On mobile, `mobileVideoFocus` is used first (if the CMS sends it).
 */
function getCmsVideoFocus(data, isMobile) {
  const pick = (value) =>
    typeof value === "string" && value.trim() ? value.trim() : null;

  const mobileFocus = isMobile
    ? pick(data?.mobileVideoFocus ?? data?.mobile_video_focus)
    : null;

  const focus = pick(data?.videoFocus ?? data?.video_focus);

  return mobileFocus || focus || "center";
}

/*
 * The 6 chips (stats) from the CMS.
 * Works with any of these list fields: stats / statistics / chips /
 * highlights / badges / counters, and with items like
 *   "15+ Years Experience"
 *   { value: "15+", label: "Years Experience" }
 *   { title: "24/7 Expert Travel Support" }   (text / name also work)
 * Inactive items are skipped and `sortOrder` is respected.
 */
const STAT_LIST_KEYS = [
  "stats",
  "statistics",
  "chips",
  "highlights",
  "badges",
  "counters",
];

function getStatText(item) {
  if (typeof item === "string" || typeof item === "number") {
    return String(item).trim();
  }

  if (!item || typeof item !== "object") return "";
  if (item.isActive === false || item.status === "inactive") return "";

  const value = item.value ?? item.count ?? item.number ?? item.stat;
  const label =
    item.label ?? item.title ?? item.name ?? item.text ?? item.description;

  return [value, label]
    .map((part) =>
      part === null || part === undefined ? "" : String(part).trim(),
    )
    .filter(Boolean)
    .join(" ");
}

function getCmsStats(data) {
  for (const key of STAT_LIST_KEYS) {
    let list = data?.[key];

    // "a | b | c" or one chip per line
    if (typeof list === "string") list = list.split(/\r?\n|\|/);

    if (!Array.isArray(list)) continue;

    const items = [...list]
      .sort((a, b) => Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0))
      .map(getStatText)
      .filter(Boolean);

    if (items.length) return items;
  }

  return [];
}

/* ---------------------------------------------------------------
   Screen size hook (true below the breakpoint, default 768px)
---------------------------------------------------------------- */
function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);

    onChange();
    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return isMobile;
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
  const isMobile = useIsMobile();

  const [destination, setDestination] = useState("");
  const [heroData, setHeroData] = useState(null);


  const [failedCount, setFailedCount] = useState(0);

  const [videoRatio, setVideoRatio] = useState(16 / 9);

  const videoRef = useRef(null);

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
        // `_t` = throw-away param so browser / CDN can never serve an old copy
        const response = await fetch(`${HERO_API}?_t=${Date.now()}`, {
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
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
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

  /* ---------------------------------------------------------------
     Dynamic media:
     video  -> mobile video -> CMS video -> local mobile -> local static
     image  -> mobile poster -> CMS poster -> local poster
  ---------------------------------------------------------------- */
  const dynamicVideo = getCmsVideoUrl(heroData);
  const mobileVideo = getCmsMobileVideoUrl(heroData);
  const videoFocus = getCmsVideoFocus(heroData, isMobile);

  const dynamicPoster = getCmsPosterUrl(heroData);
  const mobilePoster = getCmsMobilePosterUrl(heroData);

  // Poster/image: mobile one first on small screens
  const posterSrc =
    (isMobile ? mobilePoster : null) ||
    dynamicPoster ||
    STATIC_HERO_POSTER ||
    null;

  // Ordered list of sources to try (duplicates removed)
  const videoCandidates = useMemo(() => {
    const list = [
      isMobile ? mobileVideo : null,
      dynamicVideo,
      isMobile ? STATIC_HERO_MOBILE_VIDEO || null : null,
      STATIC_HERO_VIDEO,
    ].filter(Boolean);

    return list.filter((src, index) => list.indexOf(src) === index);
  }, [isMobile, mobileVideo, dynamicVideo]);

  const candidatesKey = videoCandidates.join("|");

  // Start again from the first source whenever the sources change
  useEffect(() => {
    setFailedCount(0);
  }, [candidatesKey]);

  const videoSrc =
    videoCandidates[Math.min(failedCount, videoCandidates.length - 1)];

  /*
   * Layout mode:
   * - Desktop/tablet: hero = full screen height, video covers it.
   * - Mobile + portrait video: hero = full screen height (same as desktop).
   * - Mobile + normal (landscape) video: hero ki height = video ki height
   *   (real ratio). Saara text video ke UPAR overlay hota hai.
   *   Agar text video se zyada jagah maange to hero thoda sa badh jata hai.
   */
  const isPortraitMobileVideo =
    isMobile &&
    Boolean(videoSrc) &&
    (videoSrc === mobileVideo ||
      (Boolean(STATIC_HERO_MOBILE_VIDEO) &&
        videoSrc === STATIC_HERO_MOBILE_VIDEO));

  const fullBleed = !isMobile || isPortraitMobileVideo;

  // Mobile browsers (iOS Safari / Android Chrome) need muted + play()
  // to be set manually for autoplay to work reliably
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay blocked (e.g. Low Power Mode) -> poster image stays visible
      });
    }
  }, [videoSrc]);

  // Console hint: the CMS answered but sent no usable chips
  useEffect(() => {
    if (heroData && !getCmsStats(heroData).length) {
      console.warn(
        "Hero chips: no usable stats in the hero data, default chips are shown. Hero data:",
        heroData,
      );
    }
  }, [heroData]);

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

  // The 6 chips: from the CMS, or the defaults when the CMS sends none
  const cmsStats = getCmsStats(heroData);

  const stats = cmsStats.length ? cmsStats : DEFAULT_STATS;

  // Video load hote hi uska asli ratio save kar lo
  const handleLoadedMetadata = (event) => {
    const { videoWidth, videoHeight } = event.currentTarget;
    if (videoWidth && videoHeight) {
      setVideoRatio(videoWidth / videoHeight);
    }
  };

  // If a video fails to load, try the next source in the chain.
  // If the last (local) video fails too, stop switching sources
  // (the poster image stays visible behind it).
  const handleVideoError = () => {
    if (failedCount < videoCandidates.length - 1) {
      console.warn("Hero video failed to load. Trying the next source.");
      setFailedCount((prev) => prev + 1);
    } else {
      console.error("The local hero fallback video could not be loaded.");
    }
  };

  // Mobile text ko video ke upar readable rakhne ke liye halka shadow
  // (koi dark gradient / black background nahi)
  const textShadow = fullBleed
    ? undefined
    : { textShadow: "0 1px 6px rgba(0,0,0,0.55)" };

  return (
    <section
      // Mobile (landscape video): section ki height = video ka real ratio.
      // aspect-ratio ki wajah se content zyada ho to section apne aap badh jata hai.
      style={fullBleed ? undefined : { aspectRatio: videoRatio }}
      className={`relative w-full bg-gray-900 ${
        fullBleed
          ? "h-svh max-h-[1000px] min-h-[560px] overflow-hidden"
          : "flex flex-col justify-end"
      }`}
    >
      {/* Media box: hamesha poore hero ko cover karta hai (video + poster) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image (mobile poster -> CMS poster -> local poster).
            Visible while the video loads, or if every video fails. */}
        {posterSrc && (
          <div
            aria-hidden="true"
            className="absolute inset-0 h-full w-full bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url("${posterSrc}")`,
              backgroundPosition: videoFocus,
            }}
          />
        )}

        {/* Background video: mobile -> CMS -> local fallback */}
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          poster={posterSrc || undefined}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload={isMobile ? "metadata" : "auto"}
          onError={handleVideoError}
          onLoadedMetadata={handleLoadedMetadata}
          style={{ objectPosition: videoFocus }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient sirf desktop / full-screen mode me.
            Mobile (video ke size wale hero) me koi dark fade nahi */}
        {fullBleed && (
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 via-45% to-transparent md:from-black/60 md:from-1% md:via-transparent md:to-transparent md:to-80%" />
        )}
      </div>

      {/* Hero content (hamesha video ke upar) */}
      <div className={fullBleed ? "absolute inset-0" : "relative z-10"}>
        <div className="mx-auto flex h-full w-full max-w-7xl items-end px-4 sm:px-4 lg:px-6 xl:px-0">
          <div
            className={`flex w-full flex-col justify-end gap-6 sm:gap-8 lg:flex-row lg:items-end ${
              fullBleed ? "pb-[clamp(1.5rem,6vw,4rem)]" : "gap-3 pb-4 pt-20"
            }`}
          >
            {/* LEFT */}
            <div
              style={textShadow}
              className="flex w-full flex-col gap-[clamp(0.625rem,2vw,2rem)] px-0 sm:px-2 lg:w-2/3"
            >
              {/* Badge */}
              <div
                style={descriptionStyle}
                className={`w-fit max-w-full rounded-2xl border-gray-100 px-4 py-2 font-mont text-[11px] font-semibold uppercase leading-snug text-gray-100 sm:rounded-full sm:px-6 sm:text-xs ${
                  fullBleed
                    ? "bg-black/20 text-gray-300 backdrop-blur-sm"
                    : "bg-white/15 backdrop-blur-sm"
                }`}
              >
                {description}
              </div>

              {/* Heading */}
              <h2
                style={headingStyle}
                className={`font-cg font-medium leading-[1.1] text-white ${
                  fullBleed
                    ? "text-[clamp(2rem,5.5vw,4rem)]"
                    : "text-[clamp(1.6rem,7vw,2rem)]"
                }`}
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
  style={{
    textShadow: "none",
    width: "min(100%, 40rem)",
    padding: "0.375rem",
  }}
  className="relative flex items-center gap-1 rounded-full bg-white font-mont text-slate-500 shadow-lg"
>
  <span className="flex size-[clamp(2.25rem,5vw,3rem)] shrink-0 items-center justify-center rounded-full">
    <Search className="size-[clamp(1rem,2vw,1.25rem)]" />
  </span>

  <div className="min-w-0 flex-1 text-[clamp(0.75rem,1.6vw,1rem)] text-gray-500">
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
    className="flex size-[clamp(2.25rem,5vw,3rem)] shrink-0 cursor-pointer items-center justify-center rounded-full bg-black text-white transition hover:bg-black"
  >
    <ArrowRight className="size-[clamp(1rem,2vw,1.25rem)]" />
  </button>


                {/* Suggestions (opens upward so the hero never clips it) */}
                {showDropdown && (
                  <div
                    role="listbox"
                    className="absolute bottom-full left-0 z-30 mb-2 max-h-60 w-full overflow-y-auto rounded-2xl bg-white p-2 text-left shadow-xl sm:max-h-72"
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
                          ? "Searching..."
                          : `No destination or theme found for “${destination.trim()}”.`}
                      </p>
                    )}
                  </div>
                )}
              </form>

              {/* Rating (calculated from backend reviews) */}
              <div className="flex items-center font-inter">
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