"use client";

import React from "react";
import SelectToolComponent from "@/components/SelectTool";
import { useAuth } from "@/hooks/useAuth";
import { Box } from "@mui/material";

export default function SelectTool() {
  const { user } = useAuth();
  return (
    <Box>
      <SelectToolComponent
        title="ด้านสุขภาพ"
        pageTitle="HST"
        progress={user?.total_progress ?? 0}
        titleAssessmentTools="เก็บข้อมูลศักยภาพด้านสุขภาพ"
        toolPage="/learning/health/tool"
        AssessmentToolsPage="/learning/health/assessment-tool"
        backgroundImage="/images/5.webp"
        backPage="/learning/health/forum"
        nextPage="/learning/health/data-visualization"
      />
    </Box>
  );
}
