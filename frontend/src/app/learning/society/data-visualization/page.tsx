"use client";

import DataVisualizationComponent from "@/components/DataVisualization";
import { Box } from "@mui/material";
import React from "react";

export default function AssessmentTools() {
  return (
    <Box>
      <DataVisualizationComponent
        title="ด้านสังคมและวัฒนธรรม"
        pageTitle="SCDV"
        contents="society-data-visualization"
        backgroundImage="/images/1.webp"
        nextPage="/learning/society/quiz"
        backPage="/learning/society/select-tool"
      />
    </Box>
  );
}
