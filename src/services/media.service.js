import api from "./api";
export async function getMediaLibrary() {
    const response = await api.get("/media");
    return response.data.data;
}
export async function uploadMedia(image) {
    const formData = new FormData();
    formData.append("image", image);
    const response = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
}
export async function deleteMedia(id) {
    await api.delete(`/media/${id}`);
}
