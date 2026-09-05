import api from "./api";
function toDestinationPayload(values) {
  return {
    name: values.name,
    slug: values.slug,
    country: values.country,
    city: values.city || null,
    description: values.description || null,
    imageUrl: values.imageUrl || null,
    isFeatured: values.isFeatured,
    status: values.status,
  };
}
export async function getAdminDestinations(filters) {
  const response = await api.get("/destinations/admin", { params: filters });
  return response.data;
}
export async function getThemes() {
  const response = await api.get("/themes");
  return response.data;
}
export async function getAdminDestinationById(id) {
  const response = await api.get(`/destinations/admin/${id}`);
  return response.data.data;
}
export async function getDestinationsByTheme(categoryId, themeId) {
  const response = await api.get(
    `/destinations/${categoryId}/theme/${themeId}`
  );
  console.log(response.data.data);
  return response.data.data;
}
export async function createAdminDestination(values) {
  const response = await api.post(
    "/destinations/admin",
    toDestinationPayload(values)
  );
  return response.data.data;
}
export async function updateAdminDestination(id, values) {
  const response = await api.put(
    `/destinations/admin/${id}`,
    toDestinationPayload(values)
  );
  return response.data.data;
}
export async function deleteAdminDestination(id) {
  const response = await api.delete(`/destinations/admin/${id}`);
  return response.data;
}
