import api from "./api";
export async function createBooking(values) {
    const response = await api.post("/bookings", values);
    return response.data.data;
}
export async function getBookings() {
    const response = await api.get("/bookings");
    return response.data.data;
}
export async function getBookingById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data;
}
export async function updateBookingStatus(id, status) {
    const response = await api.patch(`/bookings/${id}/status`, {
        status,
    });
    return response.data.data;
}
