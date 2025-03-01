"use client";
import { Box } from "@mui/material";
import React, { useState } from "react";
import BackPage from "@/components/BackPage";
import NextPage from "@/components/NextPage";
import Tutorial from "@/components/Tutorial";
import { useTutorialTracking } from "@/hooks/tutorialTracking";
import { useImageSize } from "@/hooks/useImageSize";
import Background from "@/components/background";
import InfoCard from "@/components/InfoCard";
import { usePageData } from "@/hooks/usePageData";
import { useLoading } from "@/hooks/useLoading";
import useScrollToMiddle from "@/hooks/useScrollToMiddle";
import PopUpContent from "@/components/PopUpContent";
import { useAuth } from "@/hooks/useAuth";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import MiniMap from "@/components/MiniMap";

const pageTitle = "community-potential";
const topics = [
  {
    id: 1,
    title: "ศักยภาพด้านสังคมและวัฒนธรรม",
    url: "/learning/society/forum",
    learningTitle: "SC",
    left: 0.25,
    bottom: 0.45,
    size: 0.05,
  },
  {
    id: 2,
    title: "ศักยภาพด้านการเมืองการปกครอง",
    url: "/learning/politics/forum",
    learningTitle: "P",
    left: 0.37,
    bottom: 0.53,
    size: 0.03,
  },
  {
    id: 3,
    title: "ศักยภาพด้านเศรษฐกิจ",
    url: "/learning/economy/forum",
    learningTitle: "EC",
    left: 0.57,
    bottom: 0.53,
    size: 0.03,
  },
  {
    id: 4,
    title: "ศักยภาพด้านสุขภาพ",
    url: "/learning/health/forum",
    learningTitle: "H",
    left: 0.72,
    bottom: 0.45,
    size: 0.05,
  },
  {
    id: 5,

    title: "ศักยภาพด้านสิ่งแวดล้อม",
    url: "/learning/environment/forum",
    learningTitle: "EV",
    left: 0.48,
    bottom: 0.2,
    size: 0.07,
  },
];

export default function CommunityPotential() {
  const src = "/images/8.webp";
  const { width, height } = useImageSize(src);
  const { pageData, loading, error } = usePageData(pageTitle);
  const loadingComponent = useLoading(loading, error);
  useScrollToMiddle(50, 50);
  const tutorialState = "tt4";
  const tutorial = useTutorialTracking(tutorialState);
  const [tutorialClose, setTutorialClose] = useState(false);
  const { user } = useAuth();
  const trackProgress = useProgressTracking();

  if (loadingComponent) return loadingComponent;

  const handleTCNAP = () => {
    trackProgress("TCNAP");
  };

  return (
    <Box
      sx={{
        overflow: "visible",
        position: "relative",
      }}
    >
      {tutorial && !tutorialClose && (
        <Box>
          <Box sx={{ zIndex: 2 }}>
            <Tutorial
              text={[
                <>
                  ต่อมาคือ{" "}
                  <strong style={{ color: "#00a79d" }}>
                    ศักยภาพชุมชน 5 ด้าน
                  </strong>{" "}
                  เป็นกลุ่มข้อมูลแสดงความสามารถในการตอบสนองความต้องการและการแก้ไขปัญหาในชุมชน
                  ซึ่งประกอบด้วย ศักยภาพชุมชนด้านสุขภาพ
                  ศักยภาพชุมชนด้านสังคมและวัฒนธรรม ศักยภาพชุมชนด้านสิ่งแวดล้อม
                  ศักยภาพชุมชนด้านเศรษฐกิจ และศักยภาพชุมชนด้านการเมืองการปกครอง
                </>,
                <>
                  นอกจากนี้น้องนักศึกษายังสามารถเรียนรู้เกี่ยวกับ{" "}
                  <strong style={{ color: "#00a79d" }}>TCNAP</strong>{" "}
                  เพื่อเป็นแนวทางในการศึกษาการเก็บรวบรวมข้อมูลศักยภาพชุมชน 5
                  ด้าน แค่ฟังก็น่าสนุกแล้วใช่ไหมล่ะคะ
                  งั้นตามพี่พยาบาลเข้าไปรู้จักศักยภาพแต่ละด้านกันเลยค่ะ
                </>,
              ]}
              tutorialState={tutorialState}
              onClose={() => setTutorialClose(true)}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", position: "absolute" }}>
        <MiniMap />
      </Box>

      <Box>
        {topics.map((item) => (
          <Box key={item.id} sx={{}}>
            <InfoCard
              title={item.title}
              url={item.url}
              learningTitle={item.learningTitle}
              position={{
                left: width * item.left,
                bottom: height * item.bottom,
              }}
              width={width}
              size={item.size}
            />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: `${height * 0.34}px`,
          left: `${width * 0.88}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: `${width * 0.05}px` }} onClick={handleTCNAP}>
          <PopUpContent
            contents={pageData?.groups[0].contents || []}
            img={user?.visited_page?.includes("TCNAP") ? "p_g.png" : "p_b.png"}
          />
        </Box>
        <Box
          sx={{
            bgcolor: "var(--color_bg_text_box)",
            p: "5px",
            borderRadius: "5px",
            textAlign: "center",
            width: "fit-content",
            fontSize: `clamp(12px, ${width * 0.011}px, 24px)`,
          }}
        >
          TCNAP
        </Box>
      </Box>

      <BackPage url="/review/social-capital" />
      <NextPage url="/review/learning-options" />
      <Background src={src} width={width} height={height} />
    </Box>
  );
}
