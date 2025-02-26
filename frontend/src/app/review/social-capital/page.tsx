"use client";
import { Box } from "@mui/material";
import React, { useState } from "react";
import PopUpContent from "@/components/PopUpContent";
import BackPage from "@/components/BackPage";
import NextPage from "@/components/NextPage";
import { usePageData } from "@/hooks/usePageData";
import { useLoading } from "@/hooks/useLoading";
import Background from "@/components/background";
import { useImageSize } from "@/hooks/useImageSize";
import useScrollToMiddle from "@/hooks/useScrollToMiddle";
import { useTutorialTracking } from "@/hooks/tutorialTracking";
import Tutorial from "@/components/Tutorial";
import MiniMap from "@/components/MiniMap";

export default function SocialCapital() {
  const src = "/images/2.webp";
  const { width, height } = useImageSize(src);
  const { pageData, loading, error } = usePageData("social-capital");
  const loadingComponent = useLoading(loading, error);

  useScrollToMiddle(50, 50);

  const tutorialState = "tt3";
  const tutorial = useTutorialTracking(tutorialState);
  const [tutorialClose, setTutorialClose] = useState(false);

  if (loadingComponent) return loadingComponent;

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
                  ในการศึกษาชุมชนนั้นเราจะต้องรู้จักกับ{" "}
                  <strong style={{ color: "#00a79d" }}>
                    ทุนทางสังคม 6 ระดับ
                  </strong>{" "}
                  ที่จะช่วยให้นักศึกษาเข้าใจถึงทรัพยากรและศักยภาพของชุมชนมากขึ้น
                  และมี <strong style={{ color: "#00a79d" }}>RECAP</strong>{" "}
                  เป็นแนวทางในการศึกษาและเก็บรวบรวมข้อมูลที่สำคัญเพื่อใช้ในการประเมินสุขภาพชุมชนค่ะ
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
        <Box
          sx={{
            position: "absolute",
            bottom: `${height * 0.44}px`,
            left: `${width * 0.24}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: `${width / 17}px` }}>
            <PopUpContent
              contents={pageData?.groups[0]?.contents}
              learningTitle="lo_t_6_L"
            />
          </Box>
          <Box
            sx={{
              bgcolor: "var(--color_bg_text_box)",
              p: "5px",
              borderRadius: "5px",
              textAlign: "center",
              fontSize: `${width * 0.015}px`,
              width: "fit-content",
            }}
          >
            ทุนทางสังคม 6 ระดับ
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: `${height * 0.44}px`,
            left: `${width * 0.72}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: `${width / 17}px` }}>
            <PopUpContent
              contents={pageData?.groups[1]?.contents}
              img="p_b.png"
              learningTitle="lo_t_RC"
            />
          </Box>
          <Box
            sx={{
              bgcolor: "var(--color_bg_text_box)",
              p: "5px",
              borderRadius: "5px",
              textAlign: "center",
              fontSize: `${width * 0.015}px`,
              width: "fit-content",
            }}
          >
            RECAP
          </Box>
        </Box>
      </Box>

      <BackPage url="/review/community-hall" />
      <NextPage url="/review/community-potential" />
      <Background src={src} width={width} height={height} />
    </Box>
  );
}
