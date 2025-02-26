"use client";
import AssessmentToolsComponent from "@/components/Assessment";
import { useLoading } from "@/hooks/useLoading";
import { usePageData } from "@/hooks/usePageData";
import { useAuth } from "@/hooks/useAuth";
import { Box } from "@mui/material";
import React from "react";

export default function AssessmentTools() {
  const { user } = useAuth();
  const { pageData, loading, error } = usePageData("economy-assessment-tool");
  const loadingComponent = useLoading(loading, error);
  if (loadingComponent) return loadingComponent;

  return (
    <Box>
      <AssessmentToolsComponent
        title="ด้านเศรษฐกิจ"
        pageTitle="ECAT"
        progress={user?.total_progress ?? 0}
        backgroundImage="/images/7.webp"
        text="ข้อมูลศักยภาพด้านเศรษฐกิจ"
        tools={pageData?.groups?.[0]?.contents || null}
        backPage="/learning/economy/select-tool"
      />
    </Box>
  );
}
