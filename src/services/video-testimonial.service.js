import api from "./api";

/*
 * Backend contract (GET /api/public/video-testimonials)
 *
 * {
 *   data: [
 *     {
 *       id,
 *       customerName,   // "Ananya & Rohan"
 *       destination,    // "Bali, Indonesia"
 *       travelDate,     // "2026-06-12" (or any text such as "June 2026")
 *       quote,          // short line shown on the video
 *       videoUrl,       // uploaded mp4 / webm url
 *       thumbnailUrl,   // poster image url
 *       sortOrder,      // optional
 *       status          // optional: "active" | "inactive"
 *     }
 *   ]
 * }
 *
 * The normalizer below also accepts a few alternative field names,
 * so small differences in the backend response will not break the UI.
 */

function formatTravelDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    // Already human text such as "June 2026".
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function normalizeVideoTestimonial(item, index) {
  return {
    id: item.id ?? item._id ?? index + 1,
    name: item.customerName ?? item.name ?? item.customer ?? "",
    destination: item.destination ?? item.location ?? "",
    date: formatTravelDate(item.travelDate ?? item.date ?? item.tripDate),
    quote: item.quote ?? item.testimonial ?? item.message ?? item.description ?? "",
    video: item.videoUrl ?? item.video?.url ?? item.video ?? "",
    poster:
      item.thumbnailUrl ??
      item.posterUrl ??
      item.thumbnail?.url ??
      item.imageUrl ??
      "",
    sortOrder: Number(item.sortOrder ?? index),
    status: item.status ?? "active",
  };
}

export async function getVideoTestimonials() {
  const response = await api.get("/video-testimonials");

  const payload = response?.data?.data;

  const list = Array.isArray(payload)
    ? payload
    : (payload?.videoTestimonials ?? payload?.testimonials ?? []);

  return list
    .map(normalizeVideoTestimonial)
    .filter((item) => item.status !== "inactive" && item.video)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}