import { useProgressTracking } from "@/hooks/useProgressTracking";
import { Box } from "@mui/material";
import { FC, ReactNode, useState } from "react";

interface TutorialProps {
  text: ReactNode[];
  tutorialState: string;
  onClose?: () => void;
}

const Tutorial: FC<TutorialProps> = ({ text, tutorialState, onClose }) => {
  const [isTutorial, setIsTutorial] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const progressTracking = useProgressTracking();

  const handleNextText = () => {
    if (currentTextIndex < text.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      handleCloseTutorial();
    }
  };

  const handleCloseTutorial = async () => {
    setIsTutorial(false);
    if (onClose) onClose();
    progressTracking(tutorialState);
  };

  return (
    <Box>
      {isTutorial && (
        <Box
          onClick={handleNextText}
          sx={{
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
            overflow: "hidden",
            cursor: "grab",
            zIndex: 9997,
          }}
        >
          <Box
            sx={{
              display: "flex",
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              mb: "50px",
            }}
          >
            <Box
              component="img"
              src="/images/พี่พยาบาล.png"
              sx={{
                width: "22vmin",
                transform: "translateX(25px)",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
              {/* ปุ่มปิด */}
              <Box
                onClick={handleCloseTutorial}
                sx={{
                  backgroundColor: "#ffffff80",
                  color: "#000",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#ddd",
                  },
                  mb: "10px",
                }}
              >
                ✕
              </Box>
              <Box
                sx={{
                  borderRadius: "5px",
                  bgcolor: "var(--color_bg_text_box)",
                  p: 4,
                  fontSize: { sm: "15px", md: "2.5vmin" },
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
              >
                {text[currentTextIndex]}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default Tutorial;
