"use client";
import AssessmentToolsComponent from "@/components/Assessment";
import { useLoading } from "@/hooks/useLoading";
import { usePageData } from "@/hooks/usePageData";
import { useAuth } from "@/hooks/useAuth";
import { Box } from "@mui/material";
import React from "react";

export default function AssessmentTools() {
  const { user } = useAuth();
  const { pageData, loading, error } = usePageData("politics-assessment-tool");
  const loadingComponent = useLoading(loading, error);
  if (loadingComponent) return loadingComponent;

  return (
    <Box>
      <AssessmentToolsComponent
        title="ด้านการเมืองการปกครอง"
        pageTitle="PAT"
        progress={user?.total_progress ?? 0}
        backgroundImage="/images/6.webp"
        text="ข้อมูลศักยภาพด้านการเมืองการปกครอง"
        tools={pageData?.groups?.[0]?.contents || null}
        backPage="/learning/politics/select-tool"
      />
    </Box>
  );
}
