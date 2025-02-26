"use client";

import DataVisualizationComponent from "@/components/DataVisualization";
import { Box } from "@mui/material";
import React from "react";

export default function AssessmentTools() {
  return (
    <Box>
      <DataVisualizationComponent
        title="ด้านสิ่งแวดล้อม"
        pageTitle="EVDV"
        contents="environment-data-visualization"
        backgroundImage="/images/4.webp"
        nextPage="/learning/environment/quiz"
        backPage="/learning/environment/select-tool"
      />
    </Box>
  );
}
