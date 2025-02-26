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
        title="ด้านสิ่งแวดล้อม"
        pageTitle="EVT"
        contents="environment-tool"
        progress={user?.total_progress ?? 0}
        backgroundImage="/images/4.webp"
        backPage="/learning/environment/select-tool"
      />
    </Box>
  );
}
