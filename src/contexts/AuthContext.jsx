import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { getMe, login, logout } from "../services/auth.service";
import { AUTH_SESSION_EXPIRED_EVENT } from "../services/api";
import { clearAuthSession, getRefreshToken, getStoredUser, storeAuthSession, } from "../services/auth-token.storage";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getStoredUser());
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let isMounted = true;
        async function hydrateUser() {
            try {
                if (!getRefreshToken()) {
                    clearAuthSession();
                    setUser(null);
                    return;
                }
                const currentUser = await getMe();
                if (isMounted) {
                    setUser(currentUser);
                }
            }
            catch {
                clearAuthSession();
                if (isMounted) {
                    setUser(null);
                }
            }
            finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }
        hydrateUser();
        return () => {
            isMounted = false;
        };
    }, []);
    useEffect(() => {
        function handleSessionExpired() {
            setUser(null);
        }
        window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
        return () => {
            window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
        };
    }, []);
    const loginAdmin = useCallback(async (credentials) => {
        const session = await login(credentials);
        storeAuthSession(session);
        setUser(session.user);
        return session;
    }, []);
    const logoutAdmin = useCallback(async () => {
        const refreshToken = getRefreshToken();
        try {
            await logout(refreshToken);
        }
        finally {
            clearAuthSession();
            setUser(null);
        }
    }, []);
    const hasRole = useCallback((roles) => {
        return Boolean(user?.roles.some((role) => roles.includes(role)));
    }, [user]);
    const contextValue = useMemo(() => ({
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        loginAdmin,
        logoutAdmin,
        hasRole,
    }), [hasRole, isLoading, loginAdmin, logoutAdmin, user]);
    return (<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>);
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider.");
    }
    return context;
}
