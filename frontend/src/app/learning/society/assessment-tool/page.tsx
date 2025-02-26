"use client";
import AssessmentToolsComponent from "@/components/Assessment";
import { useLoading } from "@/hooks/useLoading";
import { usePageData } from "@/hooks/usePageData";
import { useAuth } from "@/hooks/useAuth";
import { Box } from "@mui/material";
import React from "react";

export default function AssessmentTools() {
  const { user } = useAuth();
  const { pageData, loading, error } = usePageData("society-assessment-tool");
  const loadingComponent = useLoading(loading, error);
  if (loadingComponent) return loadingComponent;

  return (
    <Box>
      <AssessmentToolsComponent
        title="ด้านสังคมและวัฒนธรรม"
        pageTitle="SCAT"
        progress={user?.total_progress ?? 0}
        backgroundImage="/images/1.webp"
        text="ข้อมูลศักยภาพด้านสังคมและวัฒนธรรม"
        tools={pageData?.groups?.[0]?.contents || null}
        backPage="/learning/society/select-tool"
      />
    </Box>
  );
}
