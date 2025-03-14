"use client";

import { Box } from "@mui/material";
import React from "react";
import Forum from "@/components/Forum";
import { useAuth } from "@/hooks/useAuth";
import { usePageData } from "@/hooks/usePageData";
import { useLoading } from "@/hooks/useLoading";

export default function HealthForum() {
  const { user } = useAuth();
  const { pageData, loading, error } = usePageData("politics-forum");
  const loadingComponent = useLoading(loading, error);
  if (loadingComponent) return loadingComponent;

  return (
    <Box>
      <Forum
        title="ด้านการเมืองการปกครอง"
        learningTitle="P"
        pageTitle="PF"
        progress={user?.total_progress ?? 0}
        contents={pageData}
        characters={[
          "/images/นายกเทศบาล.png",
          "/images/ผู้ใหญ่บ้าน.png",
          "/images/อสม.png",
        ]}
        dialog="ยินดีต้อนรับนักศึกษาพยาบาลศาสตร์เข้าสู่การเรียนรู้ศักยภาพด้านการเมืองการปกครอง  ขอให้น้องนักศึกษาเรียนรู้ผ่าน Video เพื่อทำความรู้จักกับศักยภาพด้านการเมืองการปกครองก่อนนนะคะ"
        backgroundImage="/images/6.webp"
        backPage="/review/community-potential"
        nextPage="/learning/politics/select-tool"
      />
    </Box>
  );
}
