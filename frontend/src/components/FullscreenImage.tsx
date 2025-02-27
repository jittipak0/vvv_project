"use client";
import React, { useState } from "react";
import { Box, Button, Input, Typography } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { updateContentFields, uploadImage } from "@/services/endpoint/content";
import { Contents } from "@/types/api";
import { useLoading } from "@/hooks/useLoading";

interface FullscreenImageProps {
  alt?: string;
  contents: Contents;
  hideEdit?: boolean;
  notActive?: boolean;
  pendingUploads?: { [key: string]: File };
}

const FullscreenImage: React.FC<FullscreenImageProps> = ({
  alt,
  contents,
  hideEdit,
  notActive,
}) => {
  const [src, setSrc] = useState<string>(contents.value);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1); // ระดับการซูมเริ่มต้นที่ 1
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [position, setPosition] = useState({ x: 0, y: 0 }); // ตำแหน่งภาพเริ่มต้น
  const [isEditing, setIsEditing] = useState(false); // สถานะการแก้ไข
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // ไฟล์ที่เลือก
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleOpenFullscreen = () => {
    setIsFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = "auto";
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    setScale((prevScale) =>
      Math.min(5, Math.max(0.5, prevScale + event.deltaY * -0.001))
    ); // จำกัดการซูมระหว่าง 0.5 ถึง 5
  };

  const handleDrag = (event: React.MouseEvent) => {
    if (event.buttons !== 1) return; // ตรวจสอบว่าใช้เมาส์ซ้ายสำหรับลาก
    setPosition((prevPosition) => ({
      x: prevPosition.x + event.movementX,
      y: prevPosition.y + event.movementY,
    }));
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    setPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
    // อัปเดต touchStart ใหม่สำหรับการเคลื่อนไหวต่อเนื่อง
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches.item(0);
    const touch2 = touches.item(1);
    if (!touch1 || !touch2) return 0;

    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  const handleTouchPinchStart = (event: React.TouchEvent) => {
    if (event.touches.length >= 2) {
      const distance = getDistance(event.touches);
      setInitialDistance(distance);
    }
  };

  const handleTouchPinchMove = (event: React.TouchEvent) => {
    if (event.touches.length >= 2 && initialDistance) {
      const distance = getDistance(event.touches);
      // คำนวณอัตราส่วนการขยาย
      const newScale = scale * (distance / initialDistance);
      setScale(Math.min(5, Math.max(0.5, newScale)));
      // ปรับ initialDistance ให้เป็นค่าใหม่สำหรับการคำนวณต่อเนื่อง
      setInitialDistance(distance);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSrc(URL.createObjectURL(file)); // แสดงภาพตัวอย่างทันที
    }
  };

  const handleSaveImage = async () => {
    const data: Partial<Contents> = {};
    if (!selectedFile) return;
    setLoading(true);
    try {
      const newImageUrl = await uploadImage(contents.value, selectedFile);
      if (newImageUrl !== contents.value && newImageUrl !== undefined) {
        data.value = newImageUrl;
        setSrc(newImageUrl);
      }
      await updateContentFields(contents.id, data);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
      setIsEditing(false);
      setSelectedFile(null);
    }
  };

  const loadingComponent = useLoading(loading, null);
  if (loadingComponent) return loadingComponent;

  return (
    <>
      {/* รูปภาพเริ่มต้น */}
      {!isFullscreen && (
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Box
            component="img"
            src={src || "/images/default-image.jpg"}
            alt={alt || "image"}
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              cursor: "pointer",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={!notActive ? handleOpenFullscreen : undefined}
          />
          {role === "admin" && !hideEdit && !notActive && (
            <Box
              sx={{
                mt: 2,
                mr: 2,
                textAlign: "center",
                position: "absolute",
                bgcolor: "#fff",
                p: "5px",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {!isEditing ? (
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    bgcolor: "var(--color_primary)",
                    color: "#fff",
                  }}
                >
                  Edit Image
                </Button>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    bgcolor: "#fff",
                    p: "10px",
                  }}
                >
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    sx={{ mt: 2 }}
                  />
                  {selectedFile && (
                    <Typography>Selected file: {selectedFile.name}</Typography>
                  )}
                  <Button variant="contained" onClick={handleSaveImage}>
                    Save Image
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* รูปภาพแบบเต็มจอ */}
      {isFullscreen && (
        <Box
          sx={{
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            overflow: "hidden",
            cursor: "grab",
            touchAction: "none",
          }}
          onWheel={handleWheel}
          onMouseMove={handleDrag}
          onTouchStart={(e) => {
            handleTouchStart(e);
            handleTouchPinchStart(e);
          }}
          onTouchMove={(e) => {
            // ถ้ามีมากกว่า 1 touch ให้รองรับ pinch-to-zoom
            if (e.touches.length >= 2) {
              handleTouchPinchMove(e);
            } else {
              handleTouchMove(e);
            }
          }}
        >
          {/* รูปภาพแบบเต็มจอ */}
          <Box
            component="img"
            src={src || "/images/default-image.jpg"}
            alt={alt || "image"}
            sx={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transition: "transform 0.1s ease-out",
              maxWidth: "none",
              maxHeight: "none",
              cursor: "grab",
            }}
            draggable={false} // ป้องกันการลากรูปแบบปกติของเบราว์เซอร์
          />
          {/* ปุ่มปิด */}
          <Button
            onClick={handleCloseFullscreen}
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
    </>
  );
};

export default FullscreenImage;
