import api from "./api";
import { getDestinationsByTheme } from "./destination.service";

/* ---------------------------------------------------------------
   Helpers
---------------------------------------------------------------- */

// Backend may send an array, or { packages | items | results | rows: [] }
function extractPackages(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  for (const key of ["packages", "items", "results", "rows", "data"]) {
    if (Array.isArray(data[key])) return data[key];
  }

  return [];
}

const isCanceled = (error) =>
  error?.name === "CanceledError" || error?.code === "ERR_CANCELED";

// Slugs of destinations that have this theme (1 = Domestic, 2 = International)
async function getThemeDestinationSlugs(themeId) {
  const lists = await Promise.allSettled([
    getDestinationsByTheme(1, themeId),
    getDestinationsByTheme(2, themeId),
  ]);

  const slugs = [];
  lists.forEach((result) => {
    if (result.status === "fulfilled" && Array.isArray(result.value)) {
      result.value.forEach((destination) => {
        if (destination?.slug && !slugs.includes(destination.slug)) {
          slugs.push(destination.slug);
        }
      });
    }
  });

  return slugs;
}

// Fallback: every destination (used only if the theme has no destinations)
async function getAllDestinationSlugs(signal) {
  try {
    const res = await api.get("/destinations", { signal });
    const list = res.data?.data;

    return Array.isArray(list)
      ? list.map((destination) => destination?.slug).filter(Boolean)
      : [];
  } catch (error) {
    if (!isCanceled(error)) console.error("Failed to load destinations:", error);
    return [];
  }
}

// Packages of one destination for one theme.
async function getDestinationThemePackages(slug, themeId, signal) {
  // 1) destination + theme endpoint (used by the destination page sections)
  try {
    const res = await api.get(`/destinations/${slug}/themes/${themeId}`, {
      signal,
    });
    const list = extractPackages(res.data?.data);
    if (list.length) return list;
  } catch (error) {
    if (!isCanceled(error)) {
      console.warn(`[theme packages] ${slug}: themes endpoint failed`, error);
    }
  }

  // 2) packages filtered by theme (used by the destination page filter)
  try {
    const res = await api.get(`/packages/slug/${slug}`, {
      params: { themeId },
      signal,
    });
    return extractPackages(res.data?.data);
  } catch (error) {
    if (!isCanceled(error)) {
      console.warn(`[theme packages] ${slug}: packages endpoint failed`, error);
    }
    return [];
  }
}

/**
 * All packages of a theme (across every destination that has the theme).
 *
 * Backend has no "packages by theme" endpoint, so:
 *  1) get destinations that have the theme
 *  2) for each destination get its packages for that theme
 *  3) merge + remove duplicates
 */
export async function getPackagesByTheme(themeId, { signal } = {}) {
  let slugs = await getThemeDestinationSlugs(themeId);
  let usedFallback = false;

  if (slugs.length === 0) {
    slugs = await getAllDestinationSlugs(signal);
    usedFallback = true;
  }

  const lists = await Promise.all(
    slugs.map((slug) => getDestinationThemePackages(slug, themeId, signal)),
  );

  const seen = new Set();
  const packages = [];

  lists.flat().forEach((travelPackage) => {
    if (!travelPackage) return;

    const key =
      travelPackage.id ??
      travelPackage.slug ??
      travelPackage.packageId ??
      travelPackage._id;

    // only de-duplicate when the package has some kind of key
    if (key != null) {
      if (seen.has(key)) return;
      seen.add(key);
    }

    packages.push(travelPackage);
  });

  // Debug info (open browser console to see it)
  console.info("[theme packages]", {
    themeId,
    destinations: slugs,
    usedFallbackAllDestinations: usedFallback,
    packages: packages.length,
  });

  return packages;
}