"use client";

import { Box } from "@mui/material";
import React, { FC } from "react";
import MiniMap from "@/components/MiniMap";
import BackPage from "./BackPage";
import NextPage from "./NextPage";
import { Page } from "@/types/api";
import ContentRenderer from "./ContentRenderer";
import useScrollToMiddle from "@/hooks/useScrollToMiddle";
import { useAuth } from "@/hooks/useAuth";

interface ForumProps {
  title: string;
  learningTitle: string;
  pageTitle: string;
  progress: number;
  contents: Page | null;
  dialog: string;
  characters: string[];
  backgroundImage: string;
  nextPage: string;
  backPage: string;
}

const ForumComponent: FC<ForumProps> = ({
  title,
  learningTitle,
  pageTitle,
  contents,
  dialog,
  characters,
  backgroundImage,
  nextPage,
  backPage,
}) => {
  // const tutorialState = "tt5";
  const { user } = useAuth();
  useScrollToMiddle(50, 100);
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
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          mt: "20px",
          ml: "20px",
          height: "fit-content",
          width: "fit-content",
        }}
      >
        <MiniMap title={title} />
      </Box>

      {/* Video Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: { xs: "100vw", md: `calc(100% - 38vmin)` },
          mt: "30px",
          zIndex: 2,
        }}
      >
        <Box sx={{ width: "90%" }}>
          {contents?.groups?.[0]?.contents?.length ? (
            <ContentRenderer content={contents.groups[0].contents[0]} />
          ) : (
            <Box>No video available</Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: "50px",
          mt: characters.length > 2 ? { xs: "80px", md: "25px" } : "25px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: { xs: "center", md: "end" },
              zIndex: 1,
              right: { xs: 0, md: "5%" },
              position: { xs: "relative", md: "absolute" },
              width: "90%",
            }}
          >
            <Box
              sx={{
                position: { xs: "relative", md: "absolute" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={characters[0]}
                alt="character"
                sx={{
                  zIndex: 2,
                  width: { xs: "20vmin", sm: "15vmin" },
                  minWidth: "10vw",
                  objectFit: "contain",
                }}
              />

              <Box
                component="img"
                src={characters[1]}
                alt="character"
                sx={{
                  zIndex: 2,
                  width: { xs: "20vmin", sm: "15vmin" },
                  minWidth: "10vw",
                  objectFit: "contain",
                }}
              />
              {characters.length > 2 && (
                <Box
                  component="img"
                  src={characters[2]}
                  alt="character"
                  sx={{
                    zIndex: -1,
                    width: { xs: "20vmin", sm: "15vmin" },
                    minWidth: "10vw",
                    objectFit: "contain",
                    position: "absolute",
                    transform: "translate(-50%, -40%)",
                    left: "50%",
                  }}
                />
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              position: "relative",
              alignItems: "end",
              width: "90%",
              justifyContent: "space-between",
            }}
          >
            <Box
              component="img"
              src="/images/พี่พยาบาล.png"
              alt="character"
              sx={{
                zIndex: 3,
                width: "20vmin",
                objectFit: "contain",
                position: "absolute",
              }}
            />

            <Box
              sx={{
                ml: "10vmin",
                zIndex: 2,
                position: "relative",
                bgcolor: "var(--color_bg_text_box)",
              }}
            >
              <Box
                sx={{
                  ml: "8vmin",
                  p: { xs: "10px", md: "20px" },
                  bgcolor: "var(--color_bg_text_box)",
                  borderRadius: "5px",
                  textAlign: "center",
                  // fontSize: { sm: "15px", md: "2.5vmin" },
                  fontSize: `clamp(12px, 2.5vmin, 24px)`,
                }}
              >
                {dialog}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {user?.visited_page?.includes(learningTitle) && backPage && (
        <BackPage url={backPage} />
      )}
      {nextPage && <NextPage url={nextPage} setProgress={pageTitle} />}
    </Box>
  );
};

export default ForumComponent;
