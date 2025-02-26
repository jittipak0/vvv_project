"use client";

import {
  createContext,
  useEffect,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { AxiosError } from "axios";
import API from "@/services/axiosConfig";
import { User } from "@/types/api";

interface AuthContextType {
  role: string;
  user: User | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserState: (newUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // ฟังก์ชัน Logout
  const logout = useCallback(async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error || "Unknown error");
    }

    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    window.location.href = "/login";
  }, []);

  // ฟังก์ชันรีเฟรช token เมื่อแอปโหลด
  const checkAuth = useCallback(async () => {
    // ไม่ทำงานถ้าอยู่ในหน้า login หรือ sign-up
    if (pathname === "/login" || pathname === "/sign-up") {
      return;
    }

    try {
      const { data } = await API.post("/auth/refresh");
      setUser(data.user);
      setRole(data.user.role);
    } catch (error) {
      console.warn("Token refresh failed. Logging out...", error);
      logout();
    }
  }, [pathname, logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ฟังก์ชัน Login ที่ได้รับข้อมูลผู้ใช้จาก backend
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      setUser(data.user);
      setRole(data.user.role);

      if (data.user.role === "admin" || data.user.role === "teacher") {
        router.push("/admin");
      } else if (data.user.role === "student") {
        if (data.user.pre_test_date === null) {
          router.push("/review/pre-test");
        } else {
          router.push("/");
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        console.error(
          "Login failed:",
          error.response.data?.error || "Unknown error"
        );
        throw new Error(error.response.data?.error || "Login failed");
      }
      console.error("Login error:", error);
      throw new Error("An unexpected error occurred.");
    }
  };

  // ฟังก์ชันสำหรับอัปเดต user state เมื่อมีการเปลี่ยนแปลง
  const updateUserState = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{ role, user, login, logout, updateUserState }}
    >
      {children}
    </AuthContext.Provider>
  );
};
