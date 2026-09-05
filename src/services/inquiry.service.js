import api from "./api";
export async function getInquiries(filters) {
    const response = await api.get("/inquiries", {
        params: filters,
    });
    return response.data;
}
export async function getInquiryById(id) {
    const response = await api.get(`/inquiries/${id}`);
    return response.data.data;
}
export async function updateInquiryStatus(id, status) {
    const response = await api.patch(`/inquiries/${id}/status`, { status });
    return response.data.data;
}
export async function convertInquiryToDeal(id) {
    const response = await api.post(`/inquiries/${id}/convert-to-deal`);
    return response.data.data;
}
export async function deleteInquiry(id) {
    const response = await api.delete(`/inquiries/${id}`);
    return response.data;
}
