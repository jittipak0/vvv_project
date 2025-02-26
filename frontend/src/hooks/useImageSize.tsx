"use client";
import { useState, useEffect } from "react";

export const useImageSize = (src: string | null) => {
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  // โหลดขนาดของรูปภาพ
  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setOriginalSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
  }, [src]);

  // ดึงขนาดหน้าจอและอัปเดตเมื่อเปลี่ยนขนาด
  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // คำนวณขนาดภาพตามอัตราส่วน
  const getImageSize = () => {
    const { width: originalWidth, height: originalHeight } = originalSize;

    if (originalWidth === 0 || originalHeight === 0) {
      return { width: screenSize.width, height: screenSize.height }; // ใช้ค่าเริ่มต้นหากยังโหลดภาพไม่เสร็จ
    }

    let imgWidth, imgHeight, aspectRatio;

    if (originalWidth > originalHeight) {
      aspectRatio = originalWidth / originalHeight;
    } else {
      aspectRatio = originalHeight / originalWidth;
    }

    if (screenSize.height * aspectRatio < screenSize.width) {
      imgWidth = screenSize.width;
      imgHeight = screenSize.width / aspectRatio;
    } else {
      imgWidth = screenSize.height * aspectRatio;
      imgHeight = screenSize.height;
    }

    return { width: imgWidth, height: imgHeight, ratio: aspectRatio };
  };

  return {
    width: getImageSize().width,
    height: getImageSize().height,
    ratio: getImageSize().ratio,
  };
};
