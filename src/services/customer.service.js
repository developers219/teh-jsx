import api from "./api";
function toCustomerPayload(values) {
    return {
        salutation: values.salutation || null,
        firstName: values.firstName,
        lastName: values.lastName || null,
        dateOfBirth: values.dateOfBirth || null,
        gender: values.gender || null,
        nationality: values.nationality || null,
        addressLine1: values.addressLine1 || null,
        addressLine2: values.addressLine2 || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country,
        postalCode: values.postalCode || null,
        customerStatus: values.customerStatus,
        customerTier: values.customerTier,
        source: values.source,
        preferredContactMethod: values.preferredContactMethod,
        travelNotes: values.travelNotes || null,
        internalNotes: values.internalNotes || null,
        emails: values.emails,
        phones: values.phones,
        travelPreferences: values.travelPreferences,
    };
}
export async function getCustomers(filters) {
    const response = await api.get("/customers", {
        params: filters,
    });
    return response.data;
}
export async function getCustomerById(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
}
export async function createCustomer(values) {
    const response = await api.post("/customers", toCustomerPayload(values));
    return response.data.data;
}
export async function updateCustomer(id, values) {
    const response = await api.put(`/customers/${id}`, toCustomerPayload(values));
    return response.data.data;
}
export async function deleteCustomer(id) {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
}
