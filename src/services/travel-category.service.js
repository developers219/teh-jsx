import api from "./api";
function toTravelCategoryPayload(values) {
    return {
        categoryType: values.categoryType,
        title: values.title,
        description: values.description || null,
        imageUrl: values.imageUrl,
        imageAltText: values.imageAltText || null,
        ctaLabel: values.ctaLabel,
        ctaUrl: values.ctaUrl,
        status: values.status,
        sortOrder: Number(values.sortOrder),
    };
}
export async function getTravelCategories() {
    const response = await api.get("/travel-categories");
    return response.data.data;
}
export async function getAdminTravelCategories(filters) {
    const response = await api.get("/travel-categories/admin", { params: filters });
    return response.data;
}
export async function getAdminTravelCategory(id) {
    const response = await api.get(`/travel-categories/admin/${id}`);
    return response.data.data;
}
export async function createAdminTravelCategory(values) {
    const response = await api.post("/travel-categories/admin", toTravelCategoryPayload(values));
    return response.data.data;
}
export async function updateAdminTravelCategory(id, values) {
    const response = await api.put(`/travel-categories/admin/${id}`, toTravelCategoryPayload(values));
    return response.data.data;
}
export async function deleteAdminTravelCategory(id) {
    const response = await api.delete(`/travel-categories/admin/${id}`);
    return response.data;
}
