import axios from "axios";

const API_URL = "http://localhost:5024/api/Auth";

export const login = (data) => axios.post(`${API_URL}/login`, data);

export const register = (data) => axios.post(`${API_URL}/register`, data);

export const verifyOtp = (data) => axios.post(`${API_URL}/verify-otp`, data);

export const resendRegisterOtp = (data) => axios.post(`${API_URL}/resend-otp`, data);

export const forgotPassword = (data) =>
    axios.post(`${API_URL}/forgot-password`, data);

export const verifyResetOtp = (data) =>
    axios.post(`${API_URL}/verify-reset-otp`, data);

export const resetPassword = (data) =>
    axios.post(`${API_URL}/reset-password`, data);