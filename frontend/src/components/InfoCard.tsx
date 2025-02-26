"use client";

import { useAuth } from "@/hooks/useAuth";
import { Box } from "@mui/material";
import React from "react";

interface InfoCardProps {
  title: string;
  url: string;
  learningTitle: string;
  position: { left: number; bottom: number };
  width: number;
  size: number;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  url,
  learningTitle,
  position,
  width,
  size,
}) => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        position: "absolute",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        left: `${position.left}px`,
        bottom: `${position.bottom}px`,
      }}
    >
      <Box sx={{ width: `${width * size}px` }}>
        <Box
          component="img"
          src={
            user?.visited_page?.includes(learningTitle)
              ? "/images/p_g.png"
              : "/images/p_r.png"
          }
          sx={{ cursor: "pointer", width: "100%" }}
          onClick={() => {
            window.location.href = url;
          }}
        />
      </Box>
      <Box
        sx={{
          bgcolor: "var(--color_bg_text_box)",
          p: "5px",
          borderRadius: "5px",
          textAlign: "center",
          m: "5px",
          maxWidth: `${width * 0.12}px`,
          fontSize: `clamp(12px, ${width * 0.011}px, 24px)`,
        }}
        onClick={() => {
          window.location.href = url;
        }}
      >
        {title}
      </Box>
    </Box>
  );
};

export default InfoCard;
