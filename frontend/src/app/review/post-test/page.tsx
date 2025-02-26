"use client";

import { Box } from "@mui/material";
import TestComponent from "@/components/Test";

const TestPage = () => {
  return (
    <Box>
      <TestComponent title="Post-test" backPage="/review/learning-options" />
    </Box>
  );
};

export default TestPage;
