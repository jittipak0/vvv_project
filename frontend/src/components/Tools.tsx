"use client";
import { Box } from "@mui/material";
import { FC, useState } from "react";
import MiniMap from "./MiniMap";
import BackPage from "./BackPage";
import Tutorial from "./Tutorial";
import { useTutorialTracking } from "@/hooks/tutorialTracking";
import { usePageData } from "@/hooks/usePageData";
import { useLoading } from "@/hooks/useLoading";

interface ToolsProps {
  title: string;
  contents: string;
  pageTitle: string;
  progress: number;
  backgroundImage: string;
  backPage: string;
}

const ToolsComponent: FC<ToolsProps> = ({
  title,
  contents,
  pageTitle,
  backgroundImage,
  backPage,
}) => {
  const tutorialState = "tt10";
  const tutorial = useTutorialTracking(tutorialState);
  const [tutorialClose, setTutorialClose] = useState(false);
  const { pageData, loading, error } = usePageData(contents);
  const loadingComponent = useLoading(loading, error);
  if (loadingComponent) return loadingComponent;

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
        overflow: "auto",
      }}
    >
      <Box sx={{ mt: "20px", ml: "20px", height: "fit-content" }}>
        <MiniMap title={title} />
      </Box>

      {tutorial && !tutorialClose && (
        <Box>
          <Box sx={{ zIndex: 2 }}>
            <Tutorial
              text={[
                "น้องนักศึกษาทราบไหมคะว่า การเลือกเครื่องมือเก็บข้อมูลมีที่เหมาะสม จะทำให้เราได้ข้อมูลที่มีคุณภาพ มีความแม่นยำ ซึ่งจะนำไปสู่การวิเคราะห์ข้อมูลเพื่อนำไปพัฒนาชุมชนได้อย่างเหมาะสมนั่นเองค่ะ",
              ]}
              tutorialState={tutorialState}
              onClose={() => setTutorialClose(true)}
            />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          overflowY: "auto",
          mt: 4,
          alignContent: "center",
        }}
      >
        <Box
          sx={{
            width: "90%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              color: "#000",
              fontSize: { sm: "18px", md: "2.5vmin" },
              p: "5px 20px 5px 20px",
              borderRadius: "15px",
              alignItems: "center",
            }}
          >
            เครื่องมือในการประเมินชุมชน
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <Box
                  sx={{
                    bgcolor: "#5064aa",
                    color: "#fff",
                    fontSize: { sm: "15px", md: "2vmin" },
                    p: "5px 20px 5px 20px",
                    borderRadius: "15px",
                    alignItems: "center",
                    height: "fit-content",
                    width: "fit-content",
                  }}
                >
                  Primary Data (เก็บเอง)
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "50%",
                }}
              >
                {pageData?.groups[0].contents.map((content, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: "#c8d0d8",
                      color: "#000",
                      fontSize: { sm: "15px", md: "2vmin" },
                      p: "5px 20px 5px 20px",
                      borderRadius: "15px",
                      alignItems: "center",
                      width: "fit-content",
                      maxWidth: "90%",
                    }}
                  >
                    {content.value}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "100%",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <Box
                  sx={{
                    bgcolor: "#5064aa",
                    color: "#fff",
                    fontSize: { sm: "15px", md: "2vmin" },
                    p: "5px 20px 5px 20px",
                    borderRadius: "15px",
                    alignItems: "center",
                    height: "fit-content",
                    width: "fit-content",
                  }}
                >
                  เครื่องมือในการประเมินชุมชน
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "50%",
                }}
              >
                {pageData?.groups[1].contents.map((content, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: "#c8d0d8",
                      color: "#000",
                      fontSize: { sm: "15px", md: "2vmin" },
                      p: "5px 20px 5px 20px",
                      borderRadius: "15px",
                      alignItems: "center",
                      width: "fit-content",
                      maxWidth: "90%",
                    }}
                  >
                    {content.value}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {backPage && <BackPage url={backPage} setProgress={pageTitle} />}
    </Box>
  );
};
export default ToolsComponent;
