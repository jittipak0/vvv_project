import React, { FC } from "react";
import { Box } from "@mui/material";
import FullscreenImage from "@/components/FullscreenImage";
import VdoBox from "@/components/VdoBox";
import { Contents } from "@/types/api";

interface ContentRendererProps {
  content: Contents;
  bgcolor?: string;
  notActive?: boolean;
  color?: string;
  fontSize?: string;
  padding?: string;
}

const ContentRenderer: FC<ContentRendererProps> = ({
  content,
  bgcolor,
  notActive = false,
  color,
  fontSize,
  padding,
}) => {
  if (content.type === "img") {
    return <FullscreenImage contents={content} notActive={notActive} />;
  }

  if (content.type === "vdo") {
    return <VdoBox contents={content} />;
  }

  if (content.type === "text") {
    return (
      <Box
        sx={{
          bgcolor: bgcolor || "var(--color_bg_text_box)",
          color: color || "#000",
          fontSize: fontSize || "1.5rem",
          p: padding || "5px 20px 5px 20px",
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          width: "fit-content",
          textAlign: "center",
        }}
      >
        {content.value}
      </Box>
    );
  }

  return null; // ถ้า type ไม่ตรงกับที่กำหนดไว้ จะไม่แสดงอะไรเลย
};

export default ContentRenderer;
