"use client";
import axios from "axios";

// เปลี่ยนให้อ่านจาก environment variable ก่อน
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Interceptor: ใส่ Token ในทุก Request
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

// Interceptor: จัดการกรณี Token หมดอายุ
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("[API] Token expired, attempting refresh...");

      try {
        // ขอ Refresh Token ใหม่
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

        // ลบ Token ที่หมดอายุ และ Logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect ไปหน้า Login
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default API;
