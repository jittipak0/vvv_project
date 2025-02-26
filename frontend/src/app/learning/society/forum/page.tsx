"use client";

import { Box } from "@mui/material";
import React from "react";
import Forum from "@/components/Forum";
import { useAuth } from "@/hooks/useAuth";
import { usePageData } from "@/hooks/usePageData";
import { useLoading } from "@/hooks/useLoading";

export default function HealthForum() {
  const { user } = useAuth();
  const { pageData, loading, error } = usePageData("society-forum");
  const loadingComponent = useLoading(loading, error);
  if (loadingComponent) return loadingComponent;

  return (
    <Box>
      <Forum
        title="ด้านสังคมและวัฒนธรรม"
        pageTitle="SCF"
        progress={user?.total_progress ?? 0}
        contents={pageData}
        characters={["/images/อสม.png", "/images/พนักงานรพ.สต.png"]}
        dialog="ยินดีต้อนรับนักศึกษาพยาบาลศาตร์เข้าสู่การเรียนรู้ศักยภาพด้านสังคมและวัฒนธรรม ขอให้น้องนักศึกษาเรียนรู้ผ่าน Video เพื่อทำความรู้จักกับศักยภาพด้านสังคมและวัฒนธรรมก่อนนะคะ"
        backgroundImage="/images/1.webp"
        backPage="/review/community-potential"
        nextPage="/learning/society/select-tool"
      />
    </Box>
  );
}
