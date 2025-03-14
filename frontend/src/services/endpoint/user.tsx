import apiClient from "@/services/axiosConfig";
import { UpdateSatisfactionSurveyResponse, User } from "@/types/api";

export const updateUser = async (
  userId: number,
  updatedData: Partial<User>
): Promise<User> => {
  const response = await apiClient.put(`/users/update/${userId}`, updatedData);
  return response.data.data;
};

export const getUserByID = async (userId: number): Promise<User> => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

export const updateSatisfactionSurvey = async (
  userId: number,
  surveyData: {
    age: string;
    occupation: string;
    usage_count: string;
    usage_period: string;
    ease_of_use: string;
    overall_satisfaction: string;
    suggestions?: string;
    date: string;
  }
): Promise<UpdateSatisfactionSurveyResponse> => {
  const response = await apiClient.put(
    `/users/update/satisfaction-survey/${userId}`,
    surveyData
  );
  return response.data;
};

export const signUp = async (
  fname: string,
  lname: string,
  email: string,
  password: string,
  role: string,
  student_id?: string | null,
  section?: string | null,
  adviser?: string | null
) => {
  const response = await apiClient.post("/auth/signup", {
    fname: fname,
    lname: lname,
    student_id: student_id,
    email: email,
    password: password,
    role: role,
    section,
    adviser,
  });
  return response.data;
};

export const getUserByRole = async (role: string): Promise<User[]> => {
  const response = await apiClient.get(`/users/role/${role}`);
  return response.data;
};

export const delUserByID = async (userId: number) => {
  const response = await apiClient.delete(`/users/delete/${userId}`);
  return response.data;
};
