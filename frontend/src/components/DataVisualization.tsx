"use client";
import { Box, Button } from "@mui/material";
import { FC, useEffect, useState } from "react";
import MiniMap from "./MiniMap";
import NextPage from "./NextPage";
import BackPage from "./BackPage";
import ContentRenderer from "./ContentRenderer";
import { usePageData } from "@/hooks/usePageData";
import { useLoading } from "@/hooks/useLoading";
import { useTutorialTracking } from "@/hooks/tutorialTracking";

interface DataVisualizationProps {
  title: string;
  pageTitle: string;
  contents: string;
  backgroundImage: string;
  nextPage: string;
  backPage: string;
}

const DataVisualizationComponent: FC<DataVisualizationProps> = ({
  title,
  pageTitle,
  contents,
  backgroundImage,
  nextPage,
  backPage,
}) => {
  const tracking = useTutorialTracking(pageTitle);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { pageData, loading, error } = usePageData(contents);
  const [shuffledChoices, setShuffledChoices] = useState(
    pageData?.groups?.[1]?.contents || []
  );

  useEffect(() => {
    if (Array.isArray(pageData?.groups?.[1]?.contents)) {
      setShuffledChoices(
        [...pageData.groups[1].contents].sort(() => Math.random() - 0.5)
      );
    }
  }, [pageData]);

  const loadingComponent = useLoading(loading, error);
  if (loadingComponent) return loadingComponent;

  const handleSelectChoice = (id: number) => {
    if (!isSubmitted) {
      setSelectedChoice(id);
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleSubmit = () => {
    if (selectedChoice !== null) {
      setIsSubmitted(true);
    }
  };

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
          mt: { xs: "150px", md: "18vmin" },
          width: "80%",
          display: "flex",
          flexDirection: "column",
          mb: "25px",
          ml: "auto",
          mr: "auto",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Box
            sx={{
              bgcolor: "#cdb4fe",
              color: "#000",
              fontSize: "1.7rem",
              p: "5px",
              pl: "20px",
              pr: "20px",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              width: "fit-content",
              textAlign: "center",
              filter: "drop-shadow(-2px 4px 5px rgba(0, 0, 0, 0.5))",
              mb: { md: "80px", xs: "40px" },
            }}
          >
            การวิเคราะห์เเละการนำเสนอข้อมูล
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: { md: "80px", xs: "15px" },
            bgcolor: "#fff",
            flexDirection: "column",
            zIndex: 999,
            gap: 2,
            p: 2,
          }}
        >
          {pageData?.groups[0].contents.map((content) => (
            <Box key={content.id} sx={{ maxWidth: "90%", maxHeight: "90%" }}>
              <ContentRenderer content={content} bgcolor="#fff" />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: { md: "flex", xs: "grid" },
            gridTemplateColumns: { xs: "1fr 1fr" },
            justifyContent: "center",
            gap: { md: "20px" },
          }}
        >
          {shuffledChoices.length > 0 ? (
            shuffledChoices.map((item) => (
              <Box
                key={item.id}
                onClick={() => handleSelectChoice(item.id)}
                sx={{
                  width: `calc(100% - 26px)`,
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  border:
                    selectedChoice === item.id && !isSubmitted
                      ? "3px solid #0075ff"
                      : "3px solid transparent",
                  borderRadius: "10px",
                  padding: "10px",
                  transition: "border 0.3s ease",
                }}
              >
                <ContentRenderer content={item} notActive={true} />
                {isSubmitted && item.ref[0] === "true" && (
                  <Box
                    component="img"
                    src="/images/t.png"
                    alt="lable choice"
                    sx={{
                      width: "40px",
                      height: "40px",
                      m: "25px",
                      display: "flex",
                      position: "absolute",
                    }}
                  />
                )}

                {isSubmitted && item.ref[0] === "false" && (
                  <Box
                    component="img"
                    src="/images/t (1).png"
                    alt="lable choice"
                    sx={{
                      width: "40px",
                      height: "40px",
                      m: "25px",
                      display: "flex",
                      position: "absolute",
                    }}
                  />
                )}
              </Box>
            ))
          ) : (
            <Box>No choice available</Box>
          )}
        </Box>

        {selectedChoice !== null && !isSubmitted && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: "25px",
              mb: "25px",
            }}
          >
            <Button
              onClick={handleSubmit}
              disabled={isSubmitted}
              sx={{
                borderRadius: "50px",
                pl: "15px",
                pr: "15px",
                bgcolor: isSubmitted ? "gray" : "#0075ff",
                color: "#fff",
                fontSize: "20px",
                boxShadow: isSubmitted
                  ? "0px 4px 1px rgb(100, 100, 100)"
                  : "0px 4px 1px rgb(15, 97, 165)",
                filter: "drop-shadow(0px 4px 5px rgba(0, 0, 0, 0.8))",
              }}
            >
              SUBMIT
            </Button>
          </Box>
        )}
      </Box>

      <BackPage url={backPage} />
      {nextPage && (isSubmitted || !tracking) && (
        <NextPage url={nextPage} setProgress={pageTitle} />
      )}
    </Box>
  );
};
export default DataVisualizationComponent;
