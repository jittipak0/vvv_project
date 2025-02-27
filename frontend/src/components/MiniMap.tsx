"use client";
import { Box, CircularProgress } from "@mui/material";
import React, { FC } from "react";
import "@/styles/globals.css";
import NavigationIcon from "@mui/icons-material/Navigation";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";

interface MinimapProps {
  title?: string;
  img?: string;
  hideNevIcon?: boolean;
}

const handleNavigation = () => {
  window.location.href = "/";
};
const MiniMap: FC<MinimapProps> = ({
  title,
  img = "/images/map.webp",
  hideNevIcon,
}) => {
  const { user } = useAuth();
  return (
    <Box sx={{ display: "flex" }}>
      <Box>
        <NavBar />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          filter: "drop-shadow(-2px 4px 5px rgba(0, 0, 0, 0.5))",
          width: "18vmin",
          minHeight: "100px",
          minWidth: "100px",
          mt: "20px",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            bgcolor: "#fff",
            borderRadius: "50%",
            position: "absolute",
            display: "flex",
          }}
        />
        <CircularProgress
          variant="determinate"
          value={user?.total_progress || 0}
          size="100%"
          sx={{
            color: "var(--color_primary)",
          }}
        />

        <Box
          sx={{
            height: "90%",
            width: "90%",
            minHeight: "94px",
            minWidth: "94px",
            backgroundImage: `url(${img})`,
            backgroundSize: img === "/images/map.webp" ? "355%" : "100%",
            backgroundPosition:
              img === "/images/map.webp" ? "53% 64%" : "50% 50%",
            borderRadius: "50%",
            display: "flex",
            position: "absolute",
            cursor: "pointer",
            bgcolor: "#fff",
          }}
          onClick={handleNavigation}
        />
        {!hideNevIcon && (
          <NavigationIcon
            sx={{
              display: "flex",
              position: "absolute",
              transform: "translate(0%,9.5%)",
              fontSize: "35px",
              color: "#fff",
              filter: "drop-shadow(-2px 4px 5px rgba(0, 0, 0, 0.5))",
            }}
          />
        )}

        {title && (
          <Box
            sx={{
              bgcolor: "var(--color_bg_text_box)",
              p: "8px 15px 8px 15px",
              transform: "translate(0%,70%)",
              display: "flex",
              position: "absolute",
              bottom: "0px",
              fontSize: "2vmin",
            }}
          >
            {title}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MiniMap;
