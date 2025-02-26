"use client";

import { Box } from "@mui/material";
import React from "react";
import Forum from "@/components/Forum";
import { useAuth } from "@/hooks/useAuth";
import { usePageData } from "@/hooks/usePageData";
import { useLoading } from "@/hooks/useLoading";

export default function HealthForum() {
  const { user } = useAuth();
  const { pageData, loading, error } = usePageData("environment-forum");
  const loadingComponent = useLoading(loading, error);
  if (loadingComponent) return loadingComponent;

  return (
    <Box>
      <Forum
        title="ด้านสิ่งแวดล้อม"
        pageTitle="EVF"
        progress={user?.total_progress ?? 0}
        contents={pageData}
        characters={["/images/อสม2.png", "/images/ผู้ใหญ่บ้าน.png"]}
        dialog="ยินดีต้อนรับนักศึกษาพยาบาลศาตร์เข้าสู่การเรียนรู้ศักยภาพด้านสิ่งแวดล้อม ขอให้น้องนักศึกษาเรียนรู้ผ่าน Video เพื่อทำความรู้จักกับศักยภาพด้านสิ่งแวดล้อมก่อนนะคะ"
        backgroundImage="/images/4.webp"
        backPage="/review/community-potential"
        nextPage="/learning/environment/select-tool"
      />
    </Box>
  );
}
