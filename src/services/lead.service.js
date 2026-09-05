import api from "./api";
function toLeadPayload(values) {
    return {
        name: values.name,
        email: values.email,
        phone: values.phone,
        destinationInterest: values.destinationInterest,
        packageInterest: values.packageInterest || null,
        travelDate: values.travelDate || null,
        travellersCount: values.travellersCount,
        message: values.message || null,
        status: values.status,
        source: values.source,
    };
}
export async function getLeads(filters) {
    const response = await api.get("/leads", {
        params: filters,
    });
    return response.data;
}
export async function getLeadById(id) {
    const response = await api.get(`/leads/${id}`);
    return response.data.data;
}
export async function createLead(values) {
    const response = await api.post("/leads", toLeadPayload(values));
    return response.data.data;
}
export async function updateLead(id, values) {
    const response = await api.put(`/leads/${id}`, toLeadPayload(values));
    return response.data.data;
}
export async function updateLeadStatus(id, status) {
    const response = await api.patch(`/leads/${id}/status`, {
        status,
    });
    return response.data.data;
}
export async function convertLeadToInquiry(id) {
    const response = await api.post(`/leads/${id}/convert-to-inquiry`);
    return response.data.data;
}
export async function deleteLead(id) {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
}
