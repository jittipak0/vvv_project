import { Box, Typography } from "@mui/material";
import { FC } from "react";

interface DialogBoxProps {
  dialog: string;
}

const DialogBox: FC<DialogBoxProps> = ({ dialog }) => {
  return (
    <Box sx={{ width: "100vw", bgcolor: "red" }}>
      <Box
        component="img"
        src="/images/s.png"
        alt="character"
        sx={{
          height: "25vw",
          maxHeight: "500px",
          right: "0px",
          position: "absolute",
          transform: "translateY(-100%)",
          zIndex: 1,
        }}
      />
      <Typography className="text_box" sx={{ zIndex: 2 }}>
        {dialog}
      </Typography>
    </Box>
  );
};

export default DialogBox;
