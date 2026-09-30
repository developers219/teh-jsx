import React from "react";

/* ------------------------------------------------------------------ *
 * Design tokens
 * BEIGE is the single accent. Warm paper is used only for quiet
 * supporting surfaces; the page itself stays white so images and
 * type carry the design.
 * ------------------------------------------------------------------ */
const BEIGE = "#c5bd96";
const BEIGE_DEEP = "#b1aa87";
const PAPER = "#F5F3EA";

const slugify = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toISO = (d) => {
  const t = new Date(String(d).replace(",", ""));
  return isNaN(t) ? undefined : t.toISOString().slice(0, 10);
};

// Wide blocks (hero, images) break out of the reading column.
const WIDE =
  "relative left-1/2 w-[min(64rem,calc(100vw-2.5rem))] -translate-x-1/2";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#556B2F] focus-visible:ring-offset-2";

/* ------------------------------------------------------------------ *
 * A single content block
 * ------------------------------------------------------------------ */
export default function BlogBlock({ block }) {
  switch (block.type) {
    case "hero":
      return (
        <figure className={`${WIDE} mb-14 mt-2`}>
          <img
            src={block.src}
            alt={block.alt}
            loading="eager"
            fetchPriority="high"
            className="aspect-[16/10] w-full rounded-[28px] object-cover md:aspect-[2/1]"
          />
        </figure>
      );

    case "intro":
    case "paragraph": {
      // Lead paragraphs: explicit, or detected from the original data's className.
      const isLead =
        block.type === "intro" ||
        block.variant === "lead" ||
        block.className?.includes("md:text-lg");

      return isLead ? (
        <p className="mb-7 font-mont leading-[1.45] tracking-[-0.005em] text-black/85 text-base">
          {block.text}
        </p>
      ) : (
        <p className="mb-6 font-mont text-[1.0625rem] leading-[1.85] text-black/75 md:text-[1.125rem]">
          {block.text}
        </p>
      );
    }

    case "heading": {
      const id = slugify(block.text);
      if (block.level === 3) {
        return (
          <h3
            id={id}
            className="mb-3 mt-11 scroll-mt-24 font-cg text-2xl leading-snug text-black md:text-[1.75rem]"
          >
            {block.text}
          </h3>
        );
      }
      return (
        <h2
          id={id}
          className="mb-6 mt-20 scroll-mt-24 font-cg text-[2rem] leading-[1.1] tracking-tight text-black md:text-[2.75rem]"
          style={{ textWrap: "balance" }}
        >
          {block.text}
        </h2>
      );
    }

    case "toc":
      return (
        <nav
          aria-label={block.title}
          className="mb-16 rounded-2xl border border-black/10 p-6 md:p-8"
        >
          <p className="mb-4 font-cg text-2xl text-black">{block.title}</p>
          <ul className="gap-x-10 sm:columns-2">
            {block.items.map((item) => (
              <li
                key={item}
                className="break-inside-avoid border-t border-black/10 py-3 font-mont text-[0.95rem] leading-6 text-black/70"
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      );

    case "image":
      return (
        <figure className={`${WIDE} my-14`}>
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full rounded-2xl object-cover"
          />
          {block.caption && (
            <figcaption className="mx-auto mt-3 max-w-[42rem] font-mont text-sm leading-6 text-black/50">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "list":
      return (
        <ul className="mb-10 mt-2 space-y-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-7 font-mont text-[1.0625rem] leading-8 text-black/75 before:absolute before:left-1 before:top-[0.8rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#556B2F] before:content-['']"
            >
              {item}
            </li>
          ))}
        </ul>
      );

    case "numbered":
      // Genuinely sequential content, so numbering is meaningful here.
      return (
        <ol className="my-10 space-y-8">
          {block.items.map((item, index) => (
            <li key={item.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
              <span
                className="font-cg text-3xl leading-none"
                style={{ color: BEIGE }}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="mb-2 font-cg text-2xl md:text-[1.75rem]">
                  {item.title}
                </h3>
                <p className="font-mont text-[1.0625rem] leading-8 text-black/70">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "quote":
      return (
        <blockquote className="relative my-16 pl-0 md:-mx-6 md:pl-6">
          <span
            aria-hidden="true"
            className="absolute -top-6 left-0 select-none font-cg text-8xl leading-none md:left-6"
            style={{ color: BEIGE, opacity: 0.35 }}
          >
            “
          </span>
          <p
            className="pt-8 font-cg text-[1.75rem] italic leading-[1.3] text-black md:text-[2.25rem]"
            style={{ textWrap: "balance" }}
          >
            {block.text}
          </p>
        </blockquote>
      );

    case "info":
    case "callout": {
      const dark =
        block.tone === "dark" ||
        (block.tone === undefined && block.className?.includes("bg-black"));

      return (
        <aside
          className={`my-12 flex gap-4 rounded-2xl p-6 md:gap-5 md:p-8 ${
            dark ? "text-[#F5F3EA]" : "text-black"
          }`}
          style={{ background: dark ? BEIGE_DEEP : PAPER }}
        >
          <span
            aria-hidden="true"
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{
              background: dark
                ? "rgba(245,243,234,.14)"
                : "rgba(85,107,47,.14)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: dark ? "#F5F3EA" : BEIGE }}
            >
              <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2v.1h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
            </svg>
          </span>
          <div>
            <p className="mb-1 font-cg text-2xl leading-tight">{block.title}</p>
            <p
              className={`font-mont text-[0.95rem] leading-7 ${
                dark ? "text-[#F5F3EA]/75" : "text-black/65"
              }`}
            >
              {block.text}
            </p>
          </div>
        </aside>
      );
    }

    case "faq":
      // Native <details>: keyboard accessible, no state needed.
      // schema.org microdata makes the block eligible for FAQ rich results.
      return (
        <div
          className="mb-14 border-b border-black/10"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          {block.items.map((item) => (
            <details
              key={item.question}
              className="group border-t border-black/10"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary
                className={`flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden ${FOCUS}`}
              >
                <h3
                  itemProp="name"
                  className="font-cg text-xl leading-snug text-black md:text-2xl"
                >
                  {item.question}
                </h3>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-black/50 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p
                  itemProp="text"
                  className="max-w-[38rem] pb-6 font-mont text-[0.975rem] leading-7 text-black/65"
                >
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ *
 * Renders a list of blocks inside the reading column.
 * ------------------------------------------------------------------ */
export function BlogContent({ blocks = [] }) {
  return (
    <div className="mx-auto w-full max-w-[42rem] px-5 md:px-0">
      {blocks.map((block, i) => (
        <BlogBlock key={`${block.type}-${i}`} block={block} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Post header: tags, h1, summary and publishing details.
 * ------------------------------------------------------------------ */
export function BlogHeader({ blog }) {
  return (
    <header className="mx-auto w-full max-w-[48rem] px-5 pb-10 pt-12 md:px-0 md:pb-14 md:pt-20">
      {blog.tags?.length > 0 && (
        <ul className="mb-6 flex flex-wrap gap-2" aria-label="Topics">
          {blog.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-black/15 px-3 py-1 font-mont text-xs text-black/65"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <h1
        className="font-cg text-[2.5rem] leading-[1.04] tracking-tight text-black md:text-[4rem]"
        style={{ textWrap: "balance" }}
      >
        {blog.title}
      </h1>

      {blog.short_desc && (
        <p className="mt-6 max-w-[40rem] font-mont text-lg leading-8 text-black/60 md:text-xl md:leading-9">
          {blog.short_desc}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-black/10 pt-5 font-mont text-sm text-black/55">
        <time dateTime={toISO(blog.date_published)}>{blog.date_published}</time>
        <span aria-hidden="true" className="h-3 w-px bg-black/20" />
        <span>{blog.read_time}</span>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ *
 * Full article: header + content + closing tags + JSON-LD for SEO.
 * Usage: <BlogArticle blog={blogs[0]} />
 * ------------------------------------------------------------------ */
export function BlogArticle({ blog }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.short_desc,
    image: blog.thumbnail,
    datePublished: toISO(blog.date_published),
    keywords: blog.tags?.join(", "),
  };

  return (
    <article className="overflow-x-clip bg-white pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogHeader blog={blog} />
      <BlogContent blocks={blog.content} />

      {blog.tags?.length > 0 && (
        <footer className="mx-auto mt-6 w-full max-w-[42rem] border-t border-black/10 px-5 pt-6 md:px-0">
          <ul className="flex flex-wrap gap-2" aria-label="Filed under">
            {blog.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full px-3 py-1 font-mont text-xs text-black/70"
                style={{ background: PAPER }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  );
}
