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
        title="ด้านสังคมและวัฒนธรรม"
        pageTitle="SCST"
        progress={user?.total_progress ?? 0}
        titleAssessmentTools="เก็บข้อมูลศักยภาพด้านสังคมและวัฒนธรรม"
        toolPage="/learning/society/tool"
        AssessmentToolsPage="/learning/society/assessment-tool"
        backgroundImage="/images/1.webp"
        backPage="/learning/society/forum"
        nextPage="/learning/society/data-visualization"
      />
    </Box>
  );
}
