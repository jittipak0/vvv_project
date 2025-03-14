"use client";

import { Box, Typography } from "@mui/material";
import { FC, useState } from "react";
import MiniMap from "./MiniMap";
import BackPage from "./BackPage";
import NextPage from "./NextPage";
import { useTutorialTracking } from "@/hooks/tutorialTracking";
import Tutorial from "./Tutorial";
import { useAuth } from "@/hooks/useAuth";

interface SelectToolProps {
  title: string;
  learningTitle: string;
  pageTitle: string;
  progress: number;
  toolPage: string;
  titleAssessmentTools: string;
  AssessmentToolsPage: string;
  backgroundImage: string;
  nextPage?: string;
  backPage?: string;
}

const SelectToolComponent: FC<SelectToolProps> = ({
  title,
  learningTitle,
  pageTitle,
  toolPage,
  titleAssessmentTools,
  AssessmentToolsPage,
  backgroundImage,
  nextPage,
  backPage,
}) => {
  const handleToolPage = () => {
    window.location.href = toolPage;
  };

  const handleAssessmentToolsPage = () => {
    window.location.href = AssessmentToolsPage;
  };

  const tutorialState = "tt6";
  const tutorial = useTutorialTracking(tutorialState);
  const [tutorialClose, setTutorialClose] = useState(false);

  const { user } = useAuth();
  const hasCompletedRequiredPages =
    user?.visited_page?.includes(`${learningTitle}T`) &&
    user?.visited_page?.includes(`${learningTitle}AT`);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
      }}
    >
      {tutorial && !tutorialClose && (
        <Box>
          <Box sx={{ zIndex: 2 }}>
            <Tutorial
              text={[
                "ขั้นตอนแรกเป็นการเลือกเครื่องมือที่เหมาะสมต่อข้อมูลที่ต้องการเก็บรวบรวม จากนั้นพี่พยาบาลจะแนะนำการเก็บข้อมูลที่เกี่ยวข้องเป็นลำดับต่อไป",
              ]}
              tutorialState={tutorialState}
              onClose={() => setTutorialClose(true)}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ mt: "20px", ml: "20px", height: "fit-content" }}>
        <MiniMap title={title} />
      </Box>

      <Box
        sx={{
          top: "50%",
          width: "100%",
          height: "50%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          alignItems: "center",
          position: "absolute",
          transform: "translateY(-50%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            maxWidth: "90vw",
          }}
          onClick={handleToolPage}
        >
          <Typography
            sx={{
              bgcolor: "#e26677",
              color: "#fff",
              fontSize: "1.5rem",
              p: "12px",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: "5px",
            }}
          >
            1
          </Typography>
          <Typography
            sx={{
              bgcolor: "#b9bec4",
              color: "#000",
              fontSize: "1.5rem",
              p: "5px",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              pl: "20px",
              pr: "20px",
            }}
          >
            เครื่องมือในการประเมินชุมชน
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            maxWidth: "90vw",
          }}
          onClick={handleAssessmentToolsPage}
        >
          <Typography
            sx={{
              bgcolor: "#e26677",
              color: "#fff",
              fontSize: "1.5rem",
              p: "12px",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: "5px",
            }}
          >
            2
          </Typography>
          <Typography
            sx={{
              bgcolor: "#b9bec4",
              color: "#000",
              fontSize: "1.5rem",
              p: "5px",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              pl: "20px",
              pr: "20px",
            }}
          >
            {titleAssessmentTools}
          </Typography>
        </Box>
      </Box>

      {backPage && <BackPage url={backPage} />}
      {hasCompletedRequiredPages && nextPage && (
        <NextPage url={nextPage} setProgress={pageTitle} />
      )}
    </Box>
  );
};
export default SelectToolComponent;
