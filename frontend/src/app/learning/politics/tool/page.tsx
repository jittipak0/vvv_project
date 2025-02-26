"use client";

import { Box } from "@mui/material";
import React from "react";
import Tools from "@/components/Tools";
import { useAuth } from "@/hooks/useAuth";

export default function HealthTools() {
  const { user } = useAuth();

  return (
    <Box>
      <Tools
        title="ด้านการเมืองการปกครอง"
        pageTitle="PT"
        contents="politics-tool"
        progress={user?.total_progress ?? 0}
        backgroundImage="/images/6.webp"
        backPage="/learning/politics/select-tool"
      />
    </Box>
  );
}
