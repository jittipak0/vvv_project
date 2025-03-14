"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, List, ListItem } from "@mui/material";
import { useRouter } from "next/navigation";

type ContentType = {
  title: string;
  label?: string;
  detail: string[];
  titleLeft: number;
  titleTop: number;
  elementBoxLeft: number;
  elementBoxTop: number;
  elementBoxWidth: number;
  elementBoxHeight: number;
};

interface MapItemProps {
  content: ContentType;
  showContent: string;
  clicked: boolean;
  isTouchDevice: boolean;
  cursorPosition: { x: number; y: number };
  calculatePosition: (
    top: number,
    left: number
  ) => { top: string; left: string };
  calculateSize: (w: number, h: number) => { width: string; height: string };
  imgSize: () => number;
  setShowContent: (val: string) => void;
  setClicked: (val: boolean) => void;
}

/**
 * MapItem: ใช้แสดง Title/Box/Popup สำหรับแต่ละ content
 */
const MapItem: React.FC<MapItemProps> = ({
  content,
  showContent,
  clicked,
  isTouchDevice,
  cursorPosition,
  calculatePosition,
  calculateSize,
  imgSize,
  setShowContent,
  setClicked,
}) => {
  const [popupSize, setPopupSize] = useState({ width: 0, height: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // เมื่อ showContent = content.title -> คำนวณขนาด popup
  useEffect(() => {
    if (showContent === content.title) {
      requestAnimationFrame(() => {
        if (popupRef.current) {
          const { offsetWidth, offsetHeight } = popupRef.current;
          setPopupSize({ width: offsetWidth, height: offsetHeight });
        }
      });
    }
  }, [showContent, content.title]);

  // คำนวณตำแหน่ง Title/Box จากฟังก์ชันใน Parent
  const titlePosition = calculatePosition(content.titleTop, content.titleLeft);
  const contentBoxPosition = calculatePosition(
    content.elementBoxTop,
    content.elementBoxLeft
  );
  const contentBoxSize = calculateSize(
    content.elementBoxWidth,
    content.elementBoxHeight
  );

  // คำนวณตำแหน่ง popup
  const getAdjustedPosition = () => {
    let adjustedLeft, adjustedTop;
    const gap = 2;
    const { width: popupW, height: popupH } = popupSize;

    if (typeof window === "undefined")
      return { adjustedLeft: 0, adjustedTop: 0 };

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    if (!isTouchDevice) {
      // คำนวณ popup ตามตำแหน่งเมาส์
      const { x, y } = cursorPosition;
      adjustedLeft = x;
      adjustedTop = y;

      if (y + popupH + gap < screenH) adjustedTop += gap;
      else adjustedTop -= popupH + gap;

      if (x + popupW + gap < screenW) adjustedLeft += gap;
      else adjustedLeft -= popupW + gap;
    } else {
      // สำหรับอุปกรณ์ touch
      adjustedLeft = parseFloat(titlePosition.left);
      adjustedTop = parseFloat(titlePosition.top);

      if (cursorPosition.y + popupH + gap < screenH) adjustedTop += gap;
      else adjustedTop -= popupH + gap;

      if (cursorPosition.x + popupW + gap < screenW) adjustedLeft += gap;
      else adjustedLeft -= popupW + gap;
    }

    return { adjustedLeft, adjustedTop };
  };

  const { adjustedLeft, adjustedTop } = getAdjustedPosition();

  const imgW = imgSize();

  // Handler สำหรับการคลิก Title/Box
  const handleClick = () => {
    if (content.title === "ศาลากลางบ้าน") {
      setShowContent("");
      setClicked(false);
      router.push("/review/community-hall");
    } else {
      setClicked(!clicked);
      if (!clicked) {
        setShowContent(content.title);
      }
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Title */}
      <Box
        sx={{
          bgcolor: "#fff",
          pl: 0.7,
          pr: 0.7,
          borderRadius: "7px",
          fontSize: `${imgW / 90}px`,
          position: "absolute",
          display: "flex",
          minWidth: "fit-content",
          ...titlePosition,
        }}
        onClick={handleClick}
        onMouseEnter={() => setShowContent(content.title)}
        onMouseLeave={() => setShowContent("")}
      >
        {content.label || content.title}
      </Box>

      {/* กล่อง Hover */}
      <Box
        sx={{
          position: "absolute",
          ...contentBoxPosition,
          ...contentBoxSize,
        }}
        onClick={handleClick}
        onMouseEnter={() => setShowContent(content.title)}
        onMouseLeave={() => setShowContent("")}
      />

      {/* Popup แสดง detail */}
      {showContent === content.title && (
        <Box
          ref={popupRef}
          sx={{
            position: "absolute",
            top: `${adjustedTop}px`,
            left: `${adjustedLeft}px`,
            bgcolor: "white",
            p: 3,
            borderRadius: "15px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 9,
            minWidth: "200px",
          }}
        >
          <Box
            sx={{
              fontSize: `${imgW / 90}px`,
              border: "4px solid #f57b1f",
              width: "fit-content",
              pl: 0.7,
              pr: 0.7,
              borderRadius: "15px",
            }}
          >
            {content.title}
          </Box>
          <List>
            {content.detail.map((item, i) => (
              <ListItem key={i} sx={{ fontSize: `${imgW / 95}px` }}>
                • {item}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default MapItem;
