"use client";
import { Box } from "@mui/material";
import { FC } from "react";
import MiniMap from "./MiniMap";
import BackPage from "./BackPage";
import { Contents } from "@/types/api";
import ContentRenderer from "./ContentRenderer";

interface AssessmentToolsProps {
  title: string;
  pageTitle: string;
  text: string;
  tools: Contents[] | null;
  progress: number;
  backgroundImage: string;
  backPage: string;
}

const AssessmentToolsComponent: FC<AssessmentToolsProps> = ({
  title,
  pageTitle,
  text,
  tools,
  backgroundImage,
  backPage,
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        margin: "0px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
      }}
    >
      <Box
        sx={{
          mt: "20px",
          ml: "20px",
          position: "absolute",
        }}
      >
        <MiniMap title={title} />
      </Box>

      <Box
        sx={{
          mt: { md: "25px", xs: "250px" },
          width: "80%",
          display: "flex",
          mb: "25px",
          ml: "auto",
          mr: "auto",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: "center",
            width: "90vw",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                bgcolor: "#fff",
                color: "#000",
                fontSize: "1.5rem",
                p: "5px",
                pl: "20px",
                pr: "20px",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                width: "fit-content",
                textAlign: "center",
              }}
            >
              {text}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {Array.isArray(tools) && tools.length > 0 ? (
              tools.map((tool) => (
                <Box
                  key={tool.id}
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ContentRenderer content={tool} />
                </Box>
              ))
            ) : (
              <Box>No tools available</Box>
            )}
          </Box>
        </Box>
      </Box>

      {backPage && <BackPage url={backPage} setProgress={pageTitle} />}
    </Box>
  );
};
export default AssessmentToolsComponent;
