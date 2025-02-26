"use client";

import { User, UserInStorage } from "@/types/api";

export const getUserFromLocalStorage = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const userString = localStorage.getItem("user");
    if (!userString) return null;

    return JSON.parse(userString) as User;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
};

export const saveUserToStorage = (user: UserInStorage) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => localStorage.removeItem("user");

export const setRememberMeToStorage = (rememberMe: boolean) => {
  localStorage.setItem("remember me", JSON.stringify(rememberMe));
};

export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

export const saveAnswersToStorage = (answers: Record<number, number[]>) => {
  localStorage.setItem("answers", JSON.stringify(answers));
};

export const getAnswersFromStorage = (): Record<number, number[]> | null => {
  const storedAnswers = localStorage.getItem("answers");
  return storedAnswers ? JSON.parse(storedAnswers) : null;
};

export const removeAnswersFromStorage = () => {
  localStorage.removeItem("answers");
};
