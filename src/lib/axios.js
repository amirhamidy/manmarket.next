import axios from "axios";
import { refreshAccessToken, logoutUser } from "../services/auth";

const api = axios.create({
    baseURL: "https://api.manmarket.ir",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

let isRefreshing = false;
let queue = [];

const resolveQueue = (error, token = null) => {
    queue.forEach((p) => {
        error ? p.reject(error) : p.resolve(token);
    });
    queue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({
                        resolve: (token) => {
                            original.headers.Authorization = `Bearer ${token}`;
                            resolve(api(original));
                        },
                        reject,
                    });
                });
            }

            original._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                resolveQueue(null, newToken);
                original.headers.Authorization = `Bearer ${newToken}`;
                return api(original);
            } catch (err) {
                resolveQueue(err, null);
                logoutUser();
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
