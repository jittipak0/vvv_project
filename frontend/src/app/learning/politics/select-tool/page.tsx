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
        title="ด้านการเมืองการปกครอง"
        pageTitle="PST"
        progress={user?.total_progress ?? 0}
        titleAssessmentTools="เก็บข้อมูลศักยภาพด้านการเมืองการปกครอง"
        toolPage="/learning/politics/tool"
        AssessmentToolsPage="/learning/politics/assessment-tool"
        backgroundImage="/images/6.webp"
        backPage="/learning/politics/forum"
        nextPage="/learning/politics/data-visualization"
      />
    </Box>
  );
}
