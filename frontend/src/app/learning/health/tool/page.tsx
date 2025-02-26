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
        title="ด้านสุขภาพ"
        pageTitle="HT"
        contents="health-tool"
        progress={user?.total_progress ?? 0}
        backgroundImage="/images/5.webp"
        backPage="/learning/health/select-tool"
      />
    </Box>
  );
}
