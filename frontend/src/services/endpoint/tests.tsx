import apiClient from "../axiosConfig";
import { SubmitTestResponse, Test, UserAnswer } from "../../types/api"; // นำเข้าประเภทที่เกี่ยวข้องจาก types/api

export const getTestById = async (testId: number): Promise<Test> => {
  const response = await apiClient.get(`/tests/${testId}`);
  return response.data;
};

export const getTestByTitle = async (
  title: string
): Promise<{ data: Test }> => {
  const response = await apiClient.get(`/tests/title/${title}`);
  return response.data;
};

export const adminGetTestById = async (testId: number): Promise<Test> => {
  const response = await apiClient.get(`admin/tests/${testId}`);
  return response.data;
};

export const adminGetTestByTitle = async (
  title: string
): Promise<{ data: Test }> => {
  const response = await apiClient.get(`admin/tests/title/${title}`);
  return response.data;
};

export const createTest = async (testData: Test): Promise<Test> => {
  const response = await apiClient.post("/tests", testData);
  return response.data;
};

export const updateTest = async (
  testId: number,
  testData: Test
): Promise<Test> => {
  const response = await apiClient.put(`/tests/${testId}`, testData);
  return response.data;
};

export const submitTest = async (
  user_id: number,
  test_id: number,
  test_title: string,
  total_points: number,
  answers: UserAnswer[]
): Promise<SubmitTestResponse> => {
  try {
    const response = await apiClient.post("/tests/submitTest", {
      user_id,
      test_id,
      test_title,
      total_points,
      answers,
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error;
  }
};
