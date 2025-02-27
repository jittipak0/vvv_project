"use client";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") ?? "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      alert("Network error: กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      console.warn("[API] Token expired, attempting refresh...");

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.token;
        localStorage.setItem("token", newToken);

        // อัปเดต Header และ Retry Request เดิม
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios(error.config);
      } catch (refreshError) {
        console.error("[API] Refresh Token failed:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default API;
