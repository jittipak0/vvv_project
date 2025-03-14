"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";

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
  const visitedPages = user?.visited_page ?? [];
  const matchedPages = visitedPages.filter((page) =>
    page.startsWith(learningTitle)
  );
  const progress =
    matchedPages.length > 0
      ? Math.min((matchedPages.length / 6) * 100, 100)
      : 0;
  const trackProgress = useProgressTracking();
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (progress >= 100 && !hasTracked) {
      trackProgress(learningTitle);
      setHasTracked(true);
    }
  }, [progress, trackProgress, learningTitle, hasTracked]);

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
      <Box
        sx={{
          width: `${width * size}px`,
          position: "relative",
        }}
      >
        {progress !== 100 && (
          <Box
            sx={{
              position: "absolute",
              width: `${width * size}px`,
              pointerEvents: "none",
              textAlign: "center",
            }}
          >
            <CircularProgress
              variant="determinate"
              value={progress}
              size="96%"
              sx={{
                color: "var(--color_primary)",
              }}
            />
          </Box>
        )}

        <Box
          component="img"
          src={progress >= 100 ? "/images/p_g.png" : "/images/p_r.png"}
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
