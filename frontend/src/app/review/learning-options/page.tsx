"use client";
import { Box } from "@mui/material";
import React, { useState } from "react";
import BackPage from "@/components/BackPage";
import PopUpContent from "@/components/PopUpContent";
import Background from "@/components/background";
import { usePageData } from "@/hooks/usePageData";
import { useImageSize } from "@/hooks/useImageSize";
import { useLoading } from "@/hooks/useLoading";
import useScrollToMiddle from "@/hooks/useScrollToMiddle";
import { useTutorialTracking } from "@/hooks/tutorialTracking";
import Tutorial from "@/components/Tutorial";
import { useAuth } from "@/hooks/useAuth";
import MiniMap from "@/components/MiniMap";

export default function LearningOptions() {
  const src = "/images/3.webp";
  const pageTitle = "learning-options";
  const { width, height } = useImageSize(src);
  const { pageData, loading, error } = usePageData(pageTitle);
  const topics = [
    {
      id: 1,
      topic: pageData?.groups[0].name,
      left: 0.3,
      bottom: 0.44,
      size: 0.05,
    },
    {
      id: 2,
      topic: pageData?.groups[1].name,
      left: 0.78,
      bottom: 0.44,
      size: 0.05,
    },
    {
      id: 3,
      topic: pageData?.groups[2].name,
      left: 0.61,
      bottom: 0.54,
      size: 0.03,
    },
  ];
  const tutorialState = "tt9";
  const tutorial2State = "tt9.2";
  const tutorial = useTutorialTracking(tutorialState);
  const tutorial2 = useTutorialTracking(tutorial2State);
  const [tutorialClose, setTutorialClose] = useState(false);
  const [tutorial2Close, setTutorial2Close] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const { user } = useAuth();
  const loadingComponent = useLoading(loading, error);
  useScrollToMiddle(50, 50);
  if (loadingComponent) return loadingComponent;

  const handleNextPage = () => {
    if (!tutorial2) {
      window.location.href = "/review/post-test";
    }
    setNextPage(true);
  };

  return (
    <Box
      sx={{
        overflow: "visible",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", position: "absolute" }}>
        <MiniMap />
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {topics.map((topic, index) => (
          <Box key={topic.id}>
            <PopUpContent
              contents={pageData?.groups[index].contents || []}
              learningTitle={`lo_t${index}`}
              positionBox={{
                left: width * topic.left,
                bottom: height * topic.bottom,
              }}
              widthBox={width}
              sizeBox={topic.size}
              title={topic.topic}
            />
          </Box>
        ))}
      </Box>

      {tutorial && !tutorialClose && (
        <Box>
          <Box sx={{ zIndex: 2 }}>
            <Tutorial
              text={[
                <>
                  เข้าสู่ช่วงท้ายของการประเมินสุขภาพชุมชนค่ะ
                  เมื่อนักศึกษาได้เรียนรู้และเก็บรวบรวมข้อมูลของชุมชนได้แล้ว
                  จากนั้นจะเป็นการนำข้อมูลมาวิเคราะห์
                  เพื่อค้นหาปัญหาหรือความต้องการของชุมชน
                </>,
                <>
                  โดยจะเริ่มจาก{" "}
                  <strong style={{ color: "#00a79d" }}>
                    การวิเคราะห์และนำเสนอข้อมูล
                  </strong>{" "}
                  เพื่อ{" "}
                  <strong style={{ color: "#00a79d" }}>
                    ระบุปัญหาและความต้องการ
                  </strong>
                  ของชุมชน สุดท้ายคือ
                  <strong style={{ color: "#00a79d" }}>
                    การจัดลำดับปัญหาและความต้องการ
                  </strong>
                  ร่วมกับคนในชุมชนเพื่อพัฒนาแผนโครงการต่อไปค่ะ
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
                เมื่อเรียนรู้เสร็จแล้ว
                นักศึกษาสามารถทำแบบทดสอบหลังการเรียนรู้ได้ในหน้าถัดไปเพื่อรับเกียรติบัตรสวยๆ
                หวังว่าน้องๆ นักศึกษาจะได้คะแนน{" "}
                <strong style={{ color: "#00a79d" }}>80% ขึ้นไป</strong>{" "}
                ทุกคนนะคะ
                สุดท้ายนี้ก็ขอให้นักศึกษาโชคดีในการฝึกปฏิบัติการประเมินสุขภาพชุมชนค่ะ
                ^^
              </>,
            ]}
            tutorialState={tutorial2State}
            onClose={() => {
              setTutorial2Close(true);
              window.location.href = "/review/post-test";
            }}
          />
        </Box>
      )}

      <BackPage url="/review/community-potential" />
      {(user?.total_progress ?? 0) > 99 && (
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
      )}
      <Background src={src} width={width} height={height} />
    </Box>
  );
}
