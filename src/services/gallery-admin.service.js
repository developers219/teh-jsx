import api from "./api";
export async function getAdminGallery(params) {
    const response = await api.get("/gallery/admin", {
        params,
    });
    return response.data;
}
export async function getAdminGalleryImage(id) {
    const response = await api.get(`/gallery/admin/${id}`);
    return response.data.data;
}
export async function createAdminGalleryImage(values) {
    const response = await api.post("/gallery/admin", values);
    return response.data.data;
}
export async function updateAdminGalleryImage(id, values) {
    const response = await api.put(`/gallery/admin/${id}`, values);
    return response.data.data;
}
export async function deleteAdminGalleryImage(id) {
    const response = await api.delete(`/gallery/admin/${id}`);
    return response.data;
}
