import api from "../lib/axios";

export const registerUser = (data) =>
    api.post("/accounts/v1/registration/", data);

export const loginUser = async (data) => {
    const res = await api.post("/accounts/v1/jwt/create/", data);
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    return res.data;
};

export const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh");
    const res = await api.post("/accounts/v1/jwt/refresh/", { refresh });
    localStorage.setItem("access", res.data.access);
    return res.data.access;
};

export const logoutUser = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};
