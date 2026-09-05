import api from "./api";
export async function getAdminPackages(params) {
    const response = await api.get("/packages/admin", {
        params,
    });
    return response.data;
}
export async function getAdminPackage(id) {
    const response = await api.get(`/packages/admin/${id}`);
    return response.data.data;
}
export async function createAdminPackage(values) {
    const response = await api.post("/packages/admin", values);
    return response.data.data;
}
export async function updateAdminPackage(id, values) {
    const response = await api.put(`/packages/admin/${id}`, values);
    return response.data.data;
}
export async function deleteAdminPackage(id) {
    const response = await api.delete(`/packages/admin/${id}`);
    return response.data;
}
export async function createPackageImage(packageId, values) {
    const response = await api.post(`/packages/admin/${packageId}/images`, values);
    return response.data.data;
}
export async function updatePackageImage(packageId, imageId, values) {
    const response = await api.put(`/packages/admin/${packageId}/images/${imageId}`, values);
    return response.data.data;
}
export async function deletePackageImage(packageId, imageId) {
    const response = await api.delete(`/packages/admin/${packageId}/images/${imageId}`);
    return response.data.data;
}
export async function createItinerary(packageId, values) {
    const response = await api.post(`/packages/admin/${packageId}/itineraries`, values);
    return response.data.data;
}
export async function updateItinerary(packageId, itineraryId, values) {
    const response = await api.put(`/packages/admin/${packageId}/itineraries/${itineraryId}`, values);
    return response.data.data;
}
export async function deleteItinerary(packageId, itineraryId) {
    const response = await api.delete(`/packages/admin/${packageId}/itineraries/${itineraryId}`);
    return response.data.data;
}
export async function getPackageDetailSections(packageId) {
    const response = await api.get(`/packages/admin/${packageId}/detail-sections`);
    return response.data.data;
}
export async function createPackageDetailSection(packageId, values) {
    const response = await api.post(`/packages/admin/${packageId}/detail-sections`, values);
    return response.data.data;
}
export async function updatePackageDetailSection(packageId, sectionId, values) {
    const response = await api.put(`/packages/admin/${packageId}/detail-sections/${sectionId}`, values);
    return response.data.data;
}
export async function deletePackageDetailSection(packageId, sectionId) {
    const response = await api.delete(`/packages/admin/${packageId}/detail-sections/${sectionId}`);
    return response.data;
}
