import { Contents, Page } from "@/types/api";
import apiClient from "../axiosConfig";

export const getPageByTitle = async (title: string): Promise<Page> => {
  const response = await apiClient.get(`/pages/title/${title}`);
  return response.data.data;
};

export const createOrUpdatePage = async (data: Page): Promise<Page> => {
  const response = await apiClient.post("/pages", data);
  return response.data;
};

export const updateContentFields = async (
  contentId: number,
  updates: Partial<Contents>
): Promise<Contents> => {
  const response = await apiClient.put(`/pages/content/${contentId}`, updates);
  return response.data.data;
};

export const uploadImage = async (
  oldFileURL: string,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("oldFileURL", oldFileURL);

  try {
    const response = await apiClient.post<{ url: string }>(
      "/upload/image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Failed to upload image.");
  }
};
