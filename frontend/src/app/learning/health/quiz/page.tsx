"use client";
import { Box } from "@mui/material";
import React from "react";
import Quiz from "@/components/QuizTime";

export default function HealthQuiz() {
  return (
    <Box>
      <Quiz
        learningTitle="H"
        pageTitle="HQ"
        contents="health-quiz"
        backgroundImage="/images/5.webp"
        nextPage="/review/community-potential"
        backPage="/learning/health/data-visualization"
        title="ด้านสุขภาพ"
      />
    </Box>
  );
}
