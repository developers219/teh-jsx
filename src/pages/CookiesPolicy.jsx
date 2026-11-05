import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import api from "../services/api";

/*
 * Cookies Policy - everything comes from the backend:
 *   GET /api/public/pages/cookies-policy
 *   -> { data: { title, content (HTML), updatedAt, metaTitle } }
 * Fonts: headings = font-eb, text = font-inter (website font).
 */
const SLUG = "cookies-policy";
const FALLBACK_TITLE = "Cookies Policy";
const SITE_NAME = "Travel Empire Holidays";

/* ---------------------------------------------------------------
   Safe HTML (CMS content): unknown tags are unwrapped, script /
   iframe / img / forms are removed, only safe attributes and
   http / https / mailto / tel links are kept.
---------------------------------------------------------------- */
const ALLOWED_TAGS = new Set([
  "p", "br", "hr", "div", "span",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "b", "em", "i", "u", "s", "sup", "sub", "small", "mark",
  "ul", "ol", "li", "blockquote", "pre", "code", "a",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td",
]);

const DROP_TAGS = new Set([
  "script", "style", "iframe", "object", "embed", "form", "input",
  "button", "textarea", "select", "svg", "math", "link", "meta",
  "base", "noscript", "template", "img", "video", "audio",
]);

const ALLOWED_ATTRIBUTES = {
  a: ["href", "target", "rel", "title"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
};

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

function getProtocol(href) {
  try {
    return new URL(href).protocol;
  } catch {
    try {
      return new URL(href, "https://relative.invalid").protocol;
    } catch {
      return null;
    }
  }
}

function isSafeHref(value) {
  const href = String(value || "").trim();

  if (!href) return false;
  if (href.startsWith("#")) return true;

  return SAFE_PROTOCOLS.has(getProtocol(href));
}

function cleanNode(node, documentRef) {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === 3) return;

    if (child.nodeType !== 1) {
      child.remove();
      return;
    }

    const tag = child.tagName.toLowerCase();

    if (DROP_TAGS.has(tag)) {
      child.remove();
      return;
    }

    cleanNode(child, documentRef);

    if (!ALLOWED_TAGS.has(tag)) {
      const fragment = documentRef.createDocumentFragment();
      while (child.firstChild) fragment.appendChild(child.firstChild);
      child.replaceWith(fragment);
      return;
    }

    const allowed = ALLOWED_ATTRIBUTES[tag] || [];

    Array.from(child.attributes).forEach((attribute) => {
      if (!allowed.includes(attribute.name.toLowerCase())) {
        child.removeAttribute(attribute.name);
      }
    });

    if (tag === "a") {
      if (!isSafeHref(child.getAttribute("href"))) {
        child.removeAttribute("href");
      }

      if (child.getAttribute("target") === "_blank") {
        child.setAttribute("rel", "noopener noreferrer");
      } else {
        child.removeAttribute("target");
        child.removeAttribute("rel");
      }
    }
  });
}

function sanitizeHtml(html) {
  if (typeof html !== "string" || !html.trim()) return "";

  const parsed = new DOMParser().parseFromString(html, "text/html");

  cleanNode(parsed.body, parsed);

  return parsed.body.innerHTML;
}

// Plain text from the CMS -> paragraphs (real HTML is kept as it is)
function toHtml(value) {
  const text = typeof value === "string" ? value.trim() : "";

  if (!text) return "";
  if (/<[a-z][\s\S]*>/i.test(text)) return text;

  return text
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p>${paragraph
          .trim()
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</p>`,
    )
    .join("");
}

/* ---------------------------------------------------------------
   Content styling (Tailwind removes list / heading styles)
---------------------------------------------------------------- */
const CONTENT_STYLES = [
  "font-inter text-sm leading-7 text-slate-600 sm:text-base",
  "[&_h1]:mb-5 [&_h1]:mt-12 [&_h1]:font-eb [&_h1]:text-3xl [&_h1]:font-medium [&_h1]:text-slate-900 sm:[&_h1]:text-4xl",
  "[&_h2]:mb-5 [&_h2]:mt-12 [&_h2]:font-eb [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-slate-900 sm:[&_h2]:text-3xl",
  "[&_h3]:mb-4 [&_h3]:mt-10 [&_h3]:font-eb [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-slate-900 sm:[&_h3]:text-2xl",
  "[&_h4]:mb-3 [&_h4]:mt-8 [&_h4]:font-eb [&_h4]:text-lg [&_h4]:font-medium [&_h4]:text-slate-900",
  "[&_h5]:mb-3 [&_h5]:mt-6 [&_h5]:font-inter [&_h5]:text-base [&_h5]:font-semibold [&_h5]:text-slate-900",
  "[&_h6]:mb-3 [&_h6]:mt-6 [&_h6]:font-inter [&_h6]:text-sm [&_h6]:font-semibold [&_h6]:uppercase [&_h6]:text-slate-900",
  "[&>:first-child]:mt-0",
  "[&_p]:mt-5 [&_h1+p]:mt-0 [&_h2+p]:mt-0 [&_h3+p]:mt-0 [&_h4+p]:mt-0",
  "[&_strong]:font-semibold [&_strong]:text-slate-900 [&_b]:font-semibold [&_b]:text-slate-900",
  "[&_a]:text-slate-900 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-black",
  "[&_blockquote]:mt-5 [&_blockquote]:border-l-2 [&_blockquote]:border-slate-300 [&_blockquote]:pl-5 [&_blockquote]:italic",
  "[&_hr]:my-10 [&_hr]:border-slate-200",
  "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
  "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
  "[&_li>ul]:mt-2 [&_li>ol]:mt-2",
  "[&_table]:mt-5 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-sm",
  "[&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
  "[&_td]:border [&_td]:border-slate-200 [&_td]:px-4 [&_td]:py-2",
].join(" ");

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

/* ---------------------------------------------------------------
   Page
---------------------------------------------------------------- */
const CookiesPolicy = () => {
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setHasError(false);

    api
      .get(`/legal-pages/${SLUG}`, { signal: controller.signal })
      .then((response) => {
        const record = response.data?.data;

        if (!record || typeof record !== "object") {
          throw new Error("Page not found");
        }

        const hasStructured = record.intro || record.sections?.length;

        setPage({
          title: record.title || "",
          content: hasStructured
            ? buildLegalHtml(record)
            : toHtml(
                record.content ??
                  record.body ??
                  record.html ??
                  record.description,
              ),
          updatedAt: record.updatedAt ?? record.updated_at ?? null,
          metaTitle: record.metaTitle ?? record.meta_title ?? "",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.code === "ERR_CANCELED") return;

        console.error(`Failed to load "${SLUG}" page:`, error);
        setHasError(true);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const title = page?.title || FALLBACK_TITLE;
  const updatedAt = formatDate(page?.updatedAt);
  const cleanHtml = useMemo(() => sanitizeHtml(page?.content), [page]);

  // Browser tab title
  useEffect(() => {
    const previous = document.title;

    document.title = `${page?.metaTitle || title} | ${SITE_NAME}`;

    return () => {
      document.title = previous;
    };
  }, [page?.metaTitle, title]);

  return (
    <div className="min-h-screen bg-white font-inter text-slate-900">
      {/* Dark strip behind the fixed navbar */}
      <section className="h-18 bg-black lg:h-22"></section>

      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="bg-white px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <h1 className="text-center font-eb text-[clamp(2rem,4vw,3rem)] font-medium tracking-tight text-slate-900">
              {title}
            </h1>

            {updatedAt && !isLoading && !hasError && (
              <p className="mt-3 text-center font-inter text-xs uppercase tracking-[0.14em] text-slate-400">
                Last updated: {updatedAt}
              </p>
            )}

            {/* Loading */}
            {isLoading && (
              <div
                role="status"
                aria-live="polite"
                aria-label="Loading page"
                className="mx-auto mt-10 max-w-4xl animate-pulse space-y-4"
              >
                {[100, 92, 96, 70, 100, 88, 94, 60].map((width, index) => (
                  <div
                    key={index}
                    className="h-4 rounded bg-slate-200"
                    style={{ width: `${width}%` }}
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!isLoading && hasError && (
              <div className="mx-auto mt-10 max-w-xl rounded-md border border-red-200 bg-red-50 p-8 text-center">
                <p className="font-inter text-sm text-red-700">
                  We could not load this page right now. Please try again.
                </p>

                <button
                  type="button"
                  onClick={() => setAttempt((value) => value + 1)}
                  className="mt-5 cursor-pointer rounded-full bg-black px-6 py-2.5 font-inter text-sm text-white"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !hasError && !cleanHtml && (
              <p className="mx-auto mt-10 max-w-xl text-center font-inter text-sm text-slate-500">
                This page has no content yet.
              </p>
            )}

            {/* Content from the backend */}
            {!isLoading && !hasError && cleanHtml && (
              <div
                className={`mx-auto mt-8 max-w-4xl ${CONTENT_STYLES}`}
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default CookiesPolicy;