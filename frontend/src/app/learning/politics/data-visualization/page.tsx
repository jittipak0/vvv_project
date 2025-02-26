"use client";

import DataVisualizationComponent from "@/components/DataVisualization";
import { Box } from "@mui/material";
import React from "react";

export default function AssessmentTools() {
  return (
    <Box>
      <DataVisualizationComponent
        title="ด้านการเมืองการปกครอง"
        pageTitle="PDV"
        contents="politics-data-visualization"
        backgroundImage="/images/6.webp"
        nextPage="/learning/politics/quiz"
        backPage="/learning/politics/select-tool"
      />
    </Box>
  );
}
