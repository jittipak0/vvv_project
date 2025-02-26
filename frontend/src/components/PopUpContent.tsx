"use client";
import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { Contents } from "@/types/api";
import ContentRenderer from "./ContentRenderer";
import { useAuth } from "@/hooks/useAuth";
import { useProgressTracking } from "@/hooks/useProgressTracking";

interface PopUpContentProps {
  contents: Contents[] | undefined;
  img?: string;
  learningTitle?: string;
  sizeBox?: number;
  positionBox?: { left: number; bottom: number };
  widthBox?: number;
  title?: string;
}

const PopUpContent: React.FC<PopUpContentProps> = ({
  contents,
  img,
  learningTitle = "",
  positionBox,
  widthBox,
  sizeBox,
  title,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [opened, setOpened] = useState(false);
  const trackProgress = useProgressTracking();
  const { user } = useAuth();

  const handleOpenContent = () => {
    setIsFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseContent = () => {
    setIsFullscreen(false);
    if (learningTitle !== "") {
      if (!user?.visited_page?.includes(learningTitle)) {
        setOpened(true);
        trackProgress(learningTitle);
      }
    }
    document.body.style.overflow = "auto";
  };

  return (
    <Box>
      {/* ปุ่มเปิด Popup */}
      {positionBox && widthBox && sizeBox && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            left: `${positionBox.left}px`,
            bottom: `${positionBox.bottom}px`,
            transform: "translateX( -50%)",
          }}
        >
          <Box sx={{ width: `${widthBox * sizeBox}px` }}>
            <Box
              component="img"
              src={
                user?.visited_page?.includes(learningTitle) || opened
                  ? "/images/p_g.png"
                  : img
                  ? `/images/${img}`
                  : "/images/p_r.png"
              }
              sx={{
                // height: "18vmax",
                width: "100%",
                cursor: "pointer",
                left: "50%",
                transform: "translateX( -50%)",
                position: "relative",
              }}
              onClick={handleOpenContent}
            />
          </Box>
          {title && (
            <Box
              sx={{
                bgcolor: "var(--color_bg_text_box)",
                p: "5px",
                borderRadius: "5px",
                textAlign: "center",
                m: "5px",
                maxWidth: `${widthBox * 0.12}px`,
                minWidth: "10vmax",
                fontSize: `clamp(12px, ${widthBox * 0.011}px, 24px)`,
              }}
              onClick={handleOpenContent}
            >
              {title}
            </Box>
          )}
        </Box>
      )}

      {!positionBox && (
        <Box
          component="img"
          src={
            user?.visited_page?.includes(learningTitle)
              ? "/images/p_g.png"
              : img
              ? `/images/${img}`
              : "/images/p_r.png"
          }
          sx={{
            // height: "18vmax",
            width: "100%",
            cursor: "pointer",
            left: "50%",
            transform: "translateX( -50%)",
            position: "relative",
          }}
          onClick={handleOpenContent}
        />
      )}

      {isFullscreen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            overflow: "hidden",
            flexWrap: "wrap",
            // padding: 2,
          }}
        >
          {/* ถ้าไม่มีข้อมูลให้แสดงข้อความ */}
          {contents === null || contents === undefined ? (
            <Box sx={{ color: "#fff", fontSize: "2rem" }}>ไม่มีข้อมูล</Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: { lg: "row", xs: "column" },
                // flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                width: contents?.length > 1 ? "90vw" : "90%",
                height: contents?.length > 1 ? "90vh" : "auto",
                maxWidth: "90vw",
                maxHeight: "90vh",
                overflow: "auto",
              }}
            >
              {contents?.map((content) => (
                <Box
                  key={content.id}
                  sx={{
                    width: contents.length > 1 ? "50%" : "90vmin",
                    maxWidth: contents.length > 1 ? "50%" : "90vw",
                    maxHeight: "90vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ContentRenderer content={content} />
                </Box>
              ))}
            </Box>
          )}

          {/* ปุ่มปิด Popup */}
          <Button
            onClick={handleCloseContent}
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "#ffffff50",
              color: "#000",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#ddd",
              },
            }}
          >
            ✕
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PopUpContent;
