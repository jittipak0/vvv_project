"use client";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { Box } from "@mui/material";
import { FC } from "react";

interface NextPageProps {
  url: string;
  setProgress?: string;
  setLearningTitle?: string;
}

const NextPage: FC<NextPageProps> = ({
  url,
  setProgress,
  setLearningTitle,
}) => {
  const trackProgress = useProgressTracking();
  const handleNextPage = () => {
    if (setProgress) {
      trackProgress(setProgress);
    }
    if (setLearningTitle) {
      trackProgress(setLearningTitle);
    }
    window.location.href = url;
  };

  return (
    <Box
      component="img"
      src="/images/arrow_R.png"
      alt="Next Icon"
      sx={{
        display: "flex",
        position: "fixed",
        right: "3%",
        bottom: "5%",
        mr: "25px",
        width: "8vmax",
        height: "8vmax",
        maxWidth: "5.5rem",
        maxHeight: "5.5rem",
        cursor: "pointer",
        filter: "drop-shadow(-2px 4px 5px rgba(0, 0, 0, 0.5))",
        zIndex: 3,
      }}
      onClick={handleNextPage}
    />
  );
};

export default NextPage;
