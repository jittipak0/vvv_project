"use client";
import { Box } from "@mui/material";
import React from "react";
import Quiz from "@/components/QuizTime";

export default function HealthQuiz() {
  return (
    <Box>
      <Quiz
        learningTitle="EV"
        pageTitle="EVQ"
        contents="environment-quiz"
        backgroundImage="/images/4.webp"
        nextPage="/review/community-potential"
        backPage="/learning/environment/data-visualization"
        title="ด้านสิ่งแวดล้อม"
      />
    </Box>
  );
}
