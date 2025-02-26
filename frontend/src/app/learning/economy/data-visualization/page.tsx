"use client";

import DataVisualizationComponent from "@/components/DataVisualization";
import { Box } from "@mui/material";
import React from "react";

export default function AssessmentTools() {
  return (
    <Box>
      <DataVisualizationComponent
        title="ด้านเศรษฐกิจ"
        pageTitle="ECDV"
        contents="economy-data-visualization"
        backgroundImage="/images/7.webp"
        nextPage="/learning/economy/quiz"
        backPage="/learning/economy/select-tool"
      />
    </Box>
  );
}
