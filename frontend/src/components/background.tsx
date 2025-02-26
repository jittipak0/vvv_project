import { Box } from "@mui/material";
import { FC } from "react";

interface Props {
  src: string;
  width: number;
  height: number;
}

const Background: FC<Props> = ({ src, width, height }) => {
  return (
    <Box
      sx={{
        height: "100%",
        zIndex: -9999,
        top: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          width: width,
          height: height,
        }}
      />
    </Box>
  );
};

export default Background;
