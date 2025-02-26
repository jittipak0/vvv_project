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
        title="ด้านเศรษฐกิจ"
        pageTitle="ECST"
        progress={user?.total_progress ?? 0}
        titleAssessmentTools="เก็บข้อมูลศักยภาพด้านเศรษฐกิจ"
        toolPage="/learning/economy/tool"
        AssessmentToolsPage="/learning/economy/assessment-tool"
        backgroundImage="/images/7.webp"
        backPage="/learning/economy/forum"
        nextPage="/learning/economy/data-visualization"
      />
    </Box>
  );
}
