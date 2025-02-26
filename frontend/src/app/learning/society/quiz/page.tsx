"use client";
import { Box } from "@mui/material";
import React from "react";
import Quiz from "@/components/QuizTime";

export default function HealthQuiz() {
  return (
    <Box>
      <Quiz
        learningTitle="SC"
        pageTitle="SCQ"
        contents="society-quiz"
        backgroundImage="/images/1.webp"
        nextPage="/review/community-potential"
        backPage="/learning/society/data-visualization"
        title="ด้านสังคมและวัฒนธรรม"
      />
    </Box>
  );
}
