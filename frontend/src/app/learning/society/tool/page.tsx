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
        title="ด้านสังคมและวัฒนธรรม"
        pageTitle="SCT"
        contents="society-tool"
        progress={user?.total_progress ?? 0}
        backgroundImage="/images/1.webp"
        backPage="/learning/society/select-tool"
      />
    </Box>
  );
}
