import api from "./api";
function toHowItWorksPayload(values) {
    return {
        iconKey: values.iconKey || null,
        title: values.title,
        description: values.description || null,
        status: values.status,
        sortOrder: Number(values.sortOrder),
    };
}
export async function getHowItWorksSteps() {
    const response = await api.get("/how-it-works");
    return response.data.data;
}
export async function getAdminHowItWorksSteps(filters) {
    const response = await api.get("/how-it-works/admin", { params: filters });
    return response.data;
}
export async function getAdminHowItWorksStep(id) {
    const response = await api.get(`/how-it-works/admin/${id}`);
    return response.data.data;
}
export async function createAdminHowItWorksStep(values) {
    const response = await api.post("/how-it-works/admin", toHowItWorksPayload(values));
    return response.data.data;
}
export async function updateAdminHowItWorksStep(id, values) {
    const response = await api.put(`/how-it-works/admin/${id}`, toHowItWorksPayload(values));
    return response.data.data;
}
export async function deleteAdminHowItWorksStep(id) {
    const response = await api.delete(`/how-it-works/admin/${id}`);
    return response.data;
}
