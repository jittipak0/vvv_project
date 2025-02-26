"use client";

import DataVisualizationComponent from "@/components/DataVisualization";
import { Box } from "@mui/material";
import React from "react";

export default function AssessmentTools() {
  return (
    <Box>
      <DataVisualizationComponent
        title="ด้านสุขภาพ"
        pageTitle="HDV"
        contents="health-data-visualization"
        backgroundImage="/images/5.webp"
        nextPage="/learning/health/quiz"
        backPage="/learning/health/select-tool"
      />
    </Box>
  );
}
