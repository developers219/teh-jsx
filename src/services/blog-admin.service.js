import api from "./api";
export async function getAdminBlogs(params) {
    const response = await api.get("/blogs/admin", { params });
    return response.data;
}
export async function getAdminBlog(id) {
    const response = await api.get(`/blogs/admin/${id}`);
    return response.data.data;
}
export async function createAdminBlog(values) {
    const response = await api.post("/blogs/admin", values);
    return response.data.data;
}
export async function updateAdminBlog(id, values) {
    const response = await api.put(`/blogs/admin/${id}`, values);
    return response.data.data;
}
export async function deleteAdminBlog(id) {
    const response = await api.delete(`/blogs/admin/${id}`);
    return response.data;
}
