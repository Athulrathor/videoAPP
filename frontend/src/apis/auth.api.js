import api from "./axios";

// 🔐 LOGIN
export const loginUser = (data) => api.post("/users/login", data);

// 🔐 VERIFY LOGIN (OTP / email code)
export const verifyLogin = (data) =>
    api.post("/users/verify-login", data);

// 📝 REGISTER
export const registerUser = (data) =>
    api.post("/users/register", data);

export const logoutUser = async () =>
    await api.post("/users/logout");

export const logoutAllUser = () =>
    api.post("/users/logout-all");

// 🔄 REFRESH TOKEN
export const refreshToken = async () =>
    await api.post("/users/refreshtoken");

export const forgetPassword = (data) =>
    api.post("/users/forgot-password", data);

export const getSession = () =>
    api.get("/users/sessions");

export const deleteSession = (sessionId) =>
    api.delete(`/users/sessions/${sessionId}`, {
        withCredentials: true,
    });

export const deleteOtherSessions = () =>
    api.delete("/users/sessions/others", {
        withCredentials: true,
    });

export const set2FA = async () => {
    return await api.post("users/2fa/setup");
}

export const verify2FAOtp = async (data) => {
    return await api.post("users/2fa/verify",data);
}

export const disable2FA = async (data) => {
    return await api.post("users/2fa/disable",data);
}

export const TwoFactorEnable = async (data) => {
    return await api.post("users/2fa/verify-enable", data);
}

export const changePassword = async (data) => {
    return await api.post("users/change-password", data);
}