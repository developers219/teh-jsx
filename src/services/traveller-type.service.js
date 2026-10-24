import api from "./api";

// GET /traveller-types -> { data: [{ id, slug, travellerTypeName, imageUrl, ... }] }
export async function getTravellerTypes() {
  const response = await api.get("/traveller-types");
  return response.data.data;
}

// GET /packages/traveller-type/:slug
export async function getPackagesByTravellerType(slug) {
  const response = await api.get(
    `/packages/traveller-type/${encodeURIComponent(slug)}`,
  );
  const data = response.data.data;
  // Backend kabhi array bhejta hai, kabhi { packages: [...] }
  return Array.isArray(data) ? data : (data?.packages ?? []);
}