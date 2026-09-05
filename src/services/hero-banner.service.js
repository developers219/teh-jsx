import api from "./api";
function toHeroBannerPayload(values) {
    return {
        eyebrow: values.eyebrow,
        headline: values.headline,
        subheadline: values.subheadline || null,
        mediaType: values.mediaType,
        mediaUrl: values.mediaUrl,
        mediaAltText: values.mediaAltText || null,
        callLabel: values.callLabel,
        callPhone: values.callPhone,
        whatsappLabel: values.whatsappLabel,
        whatsappNumber: values.whatsappNumber,
        itineraryLabel: values.itineraryLabel,
        itineraryUrl: values.itineraryUrl,
        stats: values.stats.filter((stat) => stat.label && stat.value),
        status: values.status,
        sortOrder: Number(values.sortOrder),
    };
}
export async function getActiveHeroBanner() {
    const response = await api.get("/hero-banners/active");
    return response.data.data;
}
export async function getAdminHeroBanners(filters) {
    const response = await api.get("/hero-banners/admin", { params: filters });
    return response.data;
}
export async function getAdminHeroBanner(id) {
    const response = await api.get(`/hero-banners/admin/${id}`);
    return response.data.data;
}
export async function createAdminHeroBanner(values) {
    const response = await api.post("/hero-banners/admin", toHeroBannerPayload(values));
    return response.data.data;
}
export async function updateAdminHeroBanner(id, values) {
    const response = await api.put(`/hero-banners/admin/${id}`, toHeroBannerPayload(values));
    return response.data.data;
}
export async function deleteAdminHeroBanner(id) {
    const response = await api.delete(`/hero-banners/admin/${id}`);
    return response.data;
}
