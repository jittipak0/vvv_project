"use client";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { Box } from "@mui/material";
import { FC } from "react";

interface BackPageProps {
  url: string;
  setProgress?: string;
}

const BackPage: FC<BackPageProps> = ({ url, setProgress }) => {
  const trackProgress = useProgressTracking();
  const handleBackPage = () => {
    if (setProgress) {
      trackProgress(setProgress);
    }
    window.location.href = url;
  };

  return (
    <Box
      component="img"
      src="/images/arrow_L.png"
      alt="Back Icon"
      sx={{
        display: "flex",
        position: "fixed",
        left: "3%",
        bottom: "5%",
        ml: "25px",
        width: "8vmax",
        height: "8vmax",
        maxWidth: "5.5rem",
        maxHeight: "5.5rem",
        cursor: "pointer",
        filter: "drop-shadow(-2px -4px 5px rgba(0, 0, 0, 0.5))",
        zIndex: 3,
      }}
      onClick={handleBackPage}
    />
  );
};
export default BackPage;
