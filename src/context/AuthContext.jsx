"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const accessTokenRef = useRef(null);
    const refreshTokenRef = useRef(null);
    const isRefreshingRef = useRef(false);
    const queueRef = useRef([]);

    accessTokenRef.current = accessToken;
    refreshTokenRef.current = refreshToken;

    const apiRef = useRef(null);
    if (!apiRef.current) {
        apiRef.current = axios.create({
            baseURL: "https://api.manmarket.ir",
            headers: { "Content-Type": "application/json" },
        });

        apiRef.current.interceptors.request.use(config => {
            if (accessTokenRef.current)
                config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
            return config;
        });

        apiRef.current.interceptors.response.use(null, async error => {
            const original = error.config;
            const status = error.response?.status;

            if (![401, 403].includes(status) || original._retry || !refreshTokenRef.current)
                return Promise.reject(error);

            original._retry = true;

            if (isRefreshingRef.current) {
                return new Promise((resolve, reject) =>
                    queueRef.current.push({ resolve, reject })
                ).then(token => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return apiRef.current(original);
                });
            }

            isRefreshingRef.current = true;
            try {
                const res = await apiRef.current.post("/accounts/v1/jwt/refresh/", {
                    refresh: refreshTokenRef.current,
                });
                const newAccess = res.data.access;
                setAccessToken(newAccess);
                localStorage.setItem("access", newAccess);
                queueRef.current.forEach(p => p.resolve(newAccess));
                queueRef.current = [];
                original.headers.Authorization = `Bearer ${newAccess}`;
                return apiRef.current(original);
            } catch (err) {
                queueRef.current.forEach(p => p.reject(err));
                queueRef.current = [];
                logout();
                return Promise.reject(err);
            } finally {
                isRefreshingRef.current = false;
            }
        });
    }

    useEffect(() => {
        const access = localStorage.getItem("access");
        const refresh = localStorage.getItem("refresh");
        if (access) {
            console.log("✅ توکن داری");
            setAccessToken(access); setRefreshToken(refresh);
        } else {
            console.log("❌ توکن نداری");
        }
        setLoading(false);
    }, []);

    const login = async data => {
        const res = await apiRef.current.post("/accounts/v1/jwt/create/", data);
        setAccessToken(res.data.access);
        setRefreshToken(res.data.refresh);
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        return res.data;
    };

    const register = async data => apiRef.current.post("/accounts/v1/registration/", data);

    const logout = async () => {
        try {
            if (refreshTokenRef.current) {
                await apiRef.current.post("/accounts/v1/jwt/logout/", {
                    refresh: refreshTokenRef.current,
                });
            }
        } catch (err) {
            console.warn("logout request failed:", err.message);
        } finally {
            setAccessToken(null);
            setRefreshToken(null);
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            window.location.href = "/login";
        }
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ api: apiRef.current, accessToken, refreshToken, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
