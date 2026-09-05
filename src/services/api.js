import axios from "axios";
import { clearAuthSession, getAccessToken, getRefreshToken, storeAuthSession, } from "./auth-token.storage";
// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
const API_BASE_URL = 'https://wildcat-mammogram-curvy.ngrok-free.dev/api/public';
const AUTH_SESSION_EXPIRED_EVENT = "trailvista:auth-session-expired";
// A single Axios instance keeps API settings consistent across the frontend.
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
    },
    timeout: 10000,
});
api.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 ||
        originalRequest?._retry ||
        originalRequest?.url === "/auth/refresh") {
        return Promise.reject(error);
    }
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        clearAuthSession();
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
        return Promise.reject(error);
    }
    try {
        originalRequest._retry = true;
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        storeAuthSession(response.data.data);
        originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
        return api(originalRequest);
    }
    catch (refreshError) {
        clearAuthSession();
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
        return Promise.reject(refreshError);
    }
});
export { AUTH_SESSION_EXPIRED_EVENT };
export default api;
