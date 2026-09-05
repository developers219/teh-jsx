import api from "./api";
function toPayload(values) {
    return {
        categoryId: Number(values.categoryId),
        title: values.title,
        slug: values.slug,
        description: values.description || null,
        status: values.status,
        sortOrder: Number(values.sortOrder),
    };
}
export async function getPackageSubcategories(categoryId) {
    const response = await api.get("/package-subcategories", {
        params: categoryId ? { categoryId } : undefined,
    });
    return response.data.data;
}
export async function getAdminPackageSubcategories(filters) {
    const response = await api.get("/package-subcategories/admin", { params: filters });
    return response.data;
}
export async function getAdminPackageSubcategory(id) {
    const response = await api.get(`/package-subcategories/admin/${id}`);
    return response.data.data;
}
export async function createAdminPackageSubcategory(values) {
    const response = await api.post("/package-subcategories/admin", toPayload(values));
    return response.data.data;
}
export async function updateAdminPackageSubcategory(id, values) {
    const response = await api.put(`/package-subcategories/admin/${id}`, toPayload(values));
    return response.data.data;
}
export async function deleteAdminPackageSubcategory(id) {
    const response = await api.delete(`/package-subcategories/admin/${id}`);
    return response.data;
}
