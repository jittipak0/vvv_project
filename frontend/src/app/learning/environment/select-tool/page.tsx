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
        title="ด้านสิ่งแวดล้อม"
        pageTitle="EVST"
        progress={user?.total_progress ?? 0}
        titleAssessmentTools="เก็บข้อมูลศักยภาพด้านสิ่งแวดล้อม"
        toolPage="/learning/environment/tool"
        AssessmentToolsPage="/learning/environment/assessment-tool"
        backgroundImage="/images/4.webp"
        backPage="/learning/environment/forum"
        nextPage="/learning/environment/data-visualization"
      />
    </Box>
  );
}
