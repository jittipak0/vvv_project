"use client";

import { Box } from "@mui/material";
import React, { FC } from "react";
import MiniMap from "@/components/MiniMap";
import BackPage from "./BackPage";
import NextPage from "./NextPage";
import { Page } from "@/types/api";
import ContentRenderer from "./ContentRenderer";
import useScrollToMiddle from "@/hooks/useScrollToMiddle";

interface ForumProps {
  title: string;
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
  pageTitle,
  contents,
  dialog,
  characters,
  backgroundImage,
  nextPage,
  backPage,
}) => {
  // const tutorialState = "tt5";
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
          width: { xs: "100vw", sm: "65%" },
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
          mt: { xs: "70px", sm: "0px", lg: "-12%" },
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
              justifyContent: { xs: "center", sm: "end" },
              zIndex: 1,
              right: 0,
              position: "relative",
              width: "90%",
            }}
          >
            <Box
              sx={{
                position: "relative",
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
                  width: "20vmin",
                  objectFit: "contain",
                }}
              />

              <Box
                component="img"
                src={characters[1]}
                alt="character"
                sx={{
                  zIndex: 2,
                  width: "20vmin",
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
                    width: "20vmin",
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
                  fontSize: { sm: "15px", md: "2.5vmin" },
                }}
              >
                {dialog}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {backPage && <BackPage url={backPage} />}
      {nextPage && <NextPage url={nextPage} setProgress={pageTitle} />}
    </Box>
  );
};

export default ForumComponent;
