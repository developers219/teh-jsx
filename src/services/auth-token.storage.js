const ACCESS_TOKEN_KEY = "trailvista_access_token";
const REFRESH_TOKEN_KEY = "trailvista_refresh_token";
const AUTH_USER_KEY = "trailvista_auth_user";
export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}
export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}
export function getStoredUser() {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    if (!userJson) {
        return null;
    }
    try {
        return JSON.parse(userJson);
    }
    catch {
        clearAuthSession();
        return null;
    }
}
export function storeAuthSession(session) {
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
}
export function storeAccessToken(accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}
export function clearAuthSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}
