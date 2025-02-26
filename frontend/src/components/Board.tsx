"use client";
import { Box } from "@mui/material";
import FullscreenImage from "./FullscreenImage";
import { Contents } from "@/types/api";

interface BoardProps {
  contents: Contents[];
}

const Board: React.FC<BoardProps> = ({ contents }) => {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        maxHeight: "100%",
        display: "flex",
        position: "relative",
        justifyContent: "center",
      }}
    >
      <Box component="img" src="/images/t (17).png" sx={{ width: "100%" }} />
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          width: "90%",
          height: "29.2%",
          top: "5.3%",
          justifyContent: "center",
        }}
      >
        <FullscreenImage contents={contents[0]} />
      </Box>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          width: "90%",
          height: "29.2%",
          top: "41.9%",
          justifyContent: "center",
        }}
      >
        <FullscreenImage contents={contents[1]} />
      </Box>
    </Box>
  );
};
export default Board;
