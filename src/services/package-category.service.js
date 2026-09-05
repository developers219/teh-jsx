import api from "./api";
function toPayload(values) {
    return {
        title: values.title,
        slug: values.slug,
        description: values.description || null,
        status: values.status,
        sortOrder: Number(values.sortOrder),
    };
}
export async function getPackageCategories() {
    const response = await api.get("/package-categories");
    return response.data.data;
}
export async function getAdminPackageCategories(filters) {
    const response = await api.get("/package-categories/admin", { params: filters });
    return response.data;
}
export async function getAdminPackageCategory(id) {
    const response = await api.get(`/package-categories/admin/${id}`);
    return response.data.data;
}
export async function createAdminPackageCategory(values) {
    const response = await api.post("/package-categories/admin", toPayload(values));
    return response.data.data;
}
export async function updateAdminPackageCategory(id, values) {
    const response = await api.put(`/package-categories/admin/${id}`, toPayload(values));
    return response.data.data;
}
export async function deleteAdminPackageCategory(id) {
    const response = await api.delete(`/package-categories/admin/${id}`);
    return response.data;
}
