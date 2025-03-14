"use client";
import { Box } from "@mui/material";
import React, { useState } from "react";
import Board from "@/components/Board";
import PopUpContent from "@/components/PopUpContent";
import BackPage from "@/components/BackPage";
import { useImageSize } from "@/hooks/useImageSize";
import { usePageData } from "@/hooks/usePageData";
import { useLoading } from "@/hooks/useLoading";
import Background from "@/components/background";
import { useTutorialTracking } from "@/hooks/tutorialTracking";
import Tutorial from "@/components/Tutorial";
import MiniMap from "@/components/MiniMap";
import useScrollToMiddle from "@/hooks/useScrollToMiddle";

export default function CommunityHall() {
  const src = "/images/b1.webp";
  const { width, height } = useImageSize(src);
  const { pageData, loading, error } = usePageData("community-hall");
  const loadingComponent = useLoading(loading, error);
  const boardGroup = pageData?.groups.find((group) => group.name === "Board");
  const boardImages = boardGroup?.contents || [];
  const popupGroup = pageData?.groups.find((group) => group.name === "Popup");
  const popupContents = popupGroup?.contents || [];
  const tutorialState = "tt2";
  const tutorial2State = "tt2.2";
  const tutorial = useTutorialTracking(tutorialState);
  const tutorial2 = useTutorialTracking(tutorial2State);
  const [tutorialClose, setTutorialClose] = useState(false);
  const [tutorial2Close, setTutorial2Close] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  useScrollToMiddle(0, 60);
  if (loadingComponent) return loadingComponent;

  const handleNextPage = () => {
    if (!tutorial2) {
      window.location.href = "/review/social-capital";
    }
    setNextPage(true);
  };

  return (
    <Box sx={{ overflow: "auto", position: "relative" }}>
      <Box sx={{ display: "flex", position: "absolute" }}>
        <MiniMap />
      </Box>

      <Box>
        <Box
          sx={{
            position: "absolute",
            width: `${width / 3}px`,
            bottom: "25px",
            left: "25px",
          }}
        >
          <Board contents={boardImages} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            width: `${width / 9.5}px`,
            bottom: "25px",
            left: `${width / 3 + 40}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PopUpContent contents={popupContents} learningTitle="CA" />
          <Box
            sx={{
              bgcolor: "var(--color_bg_text_box)",
              p: "5px",
              borderRadius: "5px",
              textAlign: "center",
              width: "fit-content",
              fontSize: `clamp(12px, ${width * 0.015}px, 24px)`,
            }}
          >
            การประเมินชุมชน
          </Box>
        </Box>
      </Box>

      {tutorial && !tutorialClose && (
        <Box>
          <Box sx={{ zIndex: 2 }}>
            <Tutorial
              text={[
                <>
                  ตอนนี้นักศึกษาก็มาถึง
                  <strong style={{ color: "#00a79d" }}>ศาลากลางบ้าน</strong>
                  ของหมู่บ้านแสนสุขแล้วนะคะ ก่อนที่จะเข้าไปหาทุกคนด้านใน
                  พี่อยากให้นักศึกษาสังเกตสิ่งแวดล้อมที่นักศึกษาจะสามารถพบเจอได้เมื่อมาที่แห่งนี้
                  อันได้แก่ ป้ายแสดงแผนผังหมู่บ้าน เส้นทางการพัฒนาหมู่บ้าน
                  ประวัติความเป็นมาหมู่บ้าน สมาชิกแกนนำชุมชน กิจกรรมชุมชน
                  หอกระจายข่าวเป็นต้น
                </>,
                <>
                  โดยพี่จะขอเน้นเรื่องของ{" "}
                  <strong style={{ color: "#00a79d" }}>
                    ความหมายของการประเมินสุขภาพชุมชน
                  </strong>{" "}
                  การระบุสถานะสุขภาพที่เป็นปัญหาและความต้องการด้านสุขภาพของประชาชนในชุมชน
                  เรียนรู้เรียบร้อยแล้วตามพี่เข้าไปในด้านในศาลากลางบ้านนะคะ
                </>,
              ]}
              tutorialState={tutorialState}
              onClose={() => setTutorialClose(true)}
            />
          </Box>
        </Box>
      )}

      {tutorial2 && !tutorial2Close && nextPage && (
        <Box sx={{ zIndex: 2 }}>
          <Tutorial
            text={[
              <>
                หลังจากเรียนรู้ความหมาย แผนที่หมู่บ้านและเส้นทางพัฒนาชุมชน
                ต่อไปจะเป็นการเรียนรู้เรื่องการประเมินสุขภาพชุมชนกันค่ะ
                หากนักศึกษาพร้อมกันแล้ว
                ตามพี่พยาบาลเข้ามาในศาลากลางบ้านกันได้เลยนะคะ
              </>,
            ]}
            tutorialState={tutorial2State}
            onClose={() => {
              setTutorial2Close(true);
              window.location.href = "/review/social-capital";
            }}
          />
        </Box>
      )}

      <BackPage url="/" />

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

      <Background src={src} width={width} height={height} />
    </Box>
  );
}
