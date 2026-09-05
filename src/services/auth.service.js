import api from "./api";
export async function login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data.data;
}
export async function logout(refreshToken) {
    await api.post("/auth/logout", { refreshToken });
}
export async function getMe() {
    const response = await api.get("/auth/me");
    return response.data.data;
}
