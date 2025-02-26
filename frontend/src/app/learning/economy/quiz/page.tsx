"use client";
import { Box } from "@mui/material";
import React from "react";
import Quiz from "@/components/QuizTime";

export default function HealthQuiz() {
  return (
    <Box>
      <Quiz
        learningTitle="EC"
        pageTitle="ECQ"
        contents="economy-quiz"
        backgroundImage="/images/7.webp"
        nextPage="/review/community-potential"
        backPage="/learning/economy/data-visualization"
        title="ด้านเศรษฐกิจ"
      />
    </Box>
  );
}
