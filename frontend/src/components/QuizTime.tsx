"use client";

import { Box, Button, Checkbox } from "@mui/material";
import { FC, useEffect, useState } from "react";
import BackPage from "./BackPage";
import NextPage from "./NextPage";
import MiniMap from "./MiniMap";
import { usePageData } from "@/hooks/usePageData";
import { useLoading } from "@/hooks/useLoading";
import { useTutorialTracking } from "@/hooks/tutorialTracking";

interface QuizProps {
  contents: string;
  learningTitle: string;
  pageTitle: string;
  backgroundImage: string;
  nextPage?: string;
  backPage?: string;
  title: string;
}

const QuizComponent: FC<QuizProps> = ({
  contents,
  backgroundImage,
  learningTitle,
  pageTitle,
  nextPage,
  backPage,
  title,
}) => {
  const tracking = useTutorialTracking(pageTitle);
  const { pageData, loading, error } = usePageData(contents);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<{
    [key: number]: boolean;
  }>({});
  const isAnyChoiceSelected = Object.values(selectedChoices).some(
    (isSelected) => isSelected
  );
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

  const handleCheckboxChange = (id: number) => {
    if (!isSubmitted) {
      setSelectedChoices((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const handleSubmit = () => {
    if (isAnyChoiceSelected) {
      setIsSubmitted(true);
    } else {
      alert("กรุณาเลือกคำตอบก่อนกด Submit!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          top: "20px",
          left: "20px",
          position: "fixed",
        }}
      >
        <MiniMap title={title} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "fit-content",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="/images/t (2).png"
          alt="Quiz time"
          sx={{ width: "200px", height: "200px", mb: "25px" }}
        />

        <Box
          sx={{
            width: "fit-content",
            maxWidth: "80vw",
            bgcolor: "var(--color_bg_text_box)",
            p: 4,
            borderRadius: "20px",
            filter: "drop-shadow(-2px 4px 5px rgba(0, 0, 0, 0.5))",
          }}
        >
          <Box sx={{ fontSize: { sm: "15px", md: "2.5vmin" }, mb: "20px" }}>
            {pageData?.groups[0].contents[0].value}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {shuffledChoices.length > 0 ? (
              shuffledChoices.map((item) => (
                <Box
                  key={item.id}
                  onClick={() => {
                    if (!isSubmitted) {
                      setSelectedChoices((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }));
                    }
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: !isSubmitted ? "pointer" : "default",
                    width: "100%",
                  }}
                >
                  <Checkbox
                    checked={!!selectedChoices[item.id]}
                    onChange={() => handleCheckboxChange(item.id)}
                    disabled={!isSubmitted}
                    sx={{
                      "&.Mui-checked": {
                        color: "var(--color_primary)",
                      },
                    }}
                  />

                  <Box sx={{ fontSize: { sm: "15px", md: "2vmin" } }}>
                    {item.value}
                  </Box>

                  {isSubmitted && item.ref[0] === "true" && (
                    <Box
                      component="img"
                      src="/images/t.png"
                      alt="lable choice"
                      sx={{
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        ml: "10px",
                      }}
                    />
                  )}

                  {isSubmitted && item.ref[0] === "false" && (
                    <Box
                      component="img"
                      src="/images/t (1).png"
                      alt="lable choice"
                      sx={{
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        ml: "10px",
                      }}
                    />
                  )}
                </Box>
              ))
            ) : (
              <Box>No choice available</Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: "25px",
            }}
          >
            <Button
              onClick={handleSubmit}
              disabled={isSubmitted || Object.keys(selectedChoices).length < 1}
              sx={{
                borderRadius: "50px",
                pl: "15px",
                pr: "15px",
                bgcolor:
                  isSubmitted || Object.keys(selectedChoices).length < 1
                    ? "gray"
                    : "#0075ff",
                color: "#fff",
                fontSize: "20px",
                boxShadow:
                  isSubmitted || Object.keys(selectedChoices).length < 1
                    ? "0px 4px 1px rgb(100, 100, 100)"
                    : "0px 4px 1px rgb(15, 97, 165)",
                filter: "drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.8))",
              }}
            >
              SUBMIT
            </Button>
          </Box>
        </Box>

        {backPage && <BackPage url={backPage} />}
        {nextPage && (isSubmitted || !tracking) && (
          <NextPage
            url={nextPage}
            setProgress={pageTitle}
            setLearningTitle={learningTitle}
          />
        )}
      </Box>
    </Box>
  );
};

export default QuizComponent;
