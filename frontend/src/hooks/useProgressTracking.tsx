import { useCallback } from "react";
import { updateUser } from "@/services/endpoint/user";
import { useAuth } from "./useAuth";
// import { saveUserToStorage } from "@/utils/localStorage";

export function useProgressTracking() {
  // ดึงข้อมูลผู้ใช้
  const { user, updateUserState } = useAuth();

  return useCallback(
    (pageTitle: string) => {
      if (!user || !pageTitle || pageTitle === "") {
        return;
      }

      // ตรวจสอบว่ามีหน้านี้อยู่ใน visited_page หรือไม่
      if (user.visited_page?.includes(pageTitle)) {
        return;
      }

      // เพิ่มหน้าใหม่เข้าไป
      const updatedVisitedPages = [...(user.visited_page || []), pageTitle];

      // หน้าที่ไม่ต้องรวมในการคำนวณ progress
      const excludedPages = new Set([
        "tt1",
        "tt2.2",
        "tt3",
        "tt4",
        "tt6",
        "tt7",
        "tt8",
        "tt9",
        "tt9.2",
        "tt10",
      ]);
      const VisitedPagesTracking = updatedVisitedPages.filter(
        (p) => !excludedPages.has(p)
      );

      // คำนวณ Progress
      const progress = Math.round(VisitedPagesTracking.length / 0.40);

      // สร้าง Object ผู้ใช้ใหม่ที่อัปเดตแล้ว
      const updatedUser = {
        ...user,
        visited_page: updatedVisitedPages,
        total_progress: progress,
      };

      // อัปเดตใน
      updateUserState(updatedUser);

      // อัปเดตข้อมูลไปที่เซิร์ฟเวอร์
      updateUser(user.id, {
        visited_page: updatedVisitedPages,
        total_progress: progress,
      });
    },
    [user, updateUserState]
  );
}
