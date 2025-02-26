"use client";
import { Box } from "@mui/material";
import React from "react";
import Quiz from "@/components/QuizTime";

export default function HealthQuiz() {
  return (
    <Box>
      <Quiz
        learningTitle="P"
        pageTitle="PQ"
        contents="politics-quiz"
        backgroundImage="/images/6.webp"
        nextPage="/review/community-potential"
        backPage="/learning/politics/data-visualization"
        title="ด้านการเมืองการปกครอง"
      />
    </Box>
  );
}
