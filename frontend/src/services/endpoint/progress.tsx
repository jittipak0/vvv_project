// import apiClient from "../axiosConfig";
// import { ProgressResponse } from "../../types/api";

// export const getProgress = async (
//   userId: number,
//   pageTitle: string
// ): Promise<ProgressResponse> => {
//   const response = await apiClient.get(`/progress/${userId}/${pageTitle}`);
//   return response.data;
// };

// export const saveProgress = async (
//   userId?: number,
//   pageTitle?: string
//   //   completed?: boolean,
//   //   isCountedInProgress?: boolean
// ): Promise<ProgressResponse> => {
//   const response = await apiClient.post("/progress", {
//     user_id: userId,
//     page_title: pageTitle,
//     // completed: completed,
//     // is_counted_in_progress: isCountedInProgress,
//   });
//   return response.data;
// };
