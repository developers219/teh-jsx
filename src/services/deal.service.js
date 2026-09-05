import api from "./api";
function toNullableNumber(value) {
    if (value === undefined || value === null || value === "") {
        return null;
    }
    return Number(value);
}
function toDealPayload(values) {
    return {
        customerId: values.customerId,
        leadId: values.leadId || null,
        inquiryId: values.inquiryId || null,
        packageId: values.packageId || null,
        destinationId: values.destinationId || null,
        stageId: values.stageId || null,
        title: values.title,
        description: values.description || null,
        expectedTravelDate: values.expectedTravelDate || null,
        expectedTravellers: toNullableNumber(values.expectedTravellers),
        estimatedValue: toNullableNumber(values.estimatedValue),
        currency: values.currency || "INR",
        winProbability: toNullableNumber(values.winProbability),
    };
}
export async function getDeals(filters) {
    const response = await api.get("/deals", {
        params: filters,
    });
    return response.data;
}
export async function getDealById(id) {
    const response = await api.get(`/deals/${id}`);
    return response.data.data;
}
export async function getDealStages() {
    const response = await api.get("/deals/stages");
    return response.data.data;
}
export async function createDeal(values) {
    const response = await api.post("/deals", toDealPayload(values));
    return response.data.data;
}
export async function updateDeal(id, values) {
    const response = await api.patch(`/deals/${id}`, toDealPayload(values));
    return response.data.data;
}
export async function moveDealStage(id, stageId, notes) {
    const response = await api.patch(`/deals/${id}/stage`, {
        stageId,
        notes: notes || null,
    });
    return response.data.data;
}
export async function markDealWon(id, notes) {
    const response = await api.patch(`/deals/${id}/mark-won`, {
        notes: notes || null,
    });
    return response.data.data;
}
export async function markDealLost(id, lostReason, notes) {
    const response = await api.patch(`/deals/${id}/mark-lost`, {
        lostReason,
        notes: notes || null,
    });
    return response.data.data;
}
export async function getDealStageHistory(id) {
    const response = await api.get(`/deals/${id}/stage-history`);
    return response.data.data;
}
