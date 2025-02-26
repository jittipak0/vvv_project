"use client";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import "@/styles/globals.css";
import { Contents } from "@/types/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@/hooks/useAuth";
import { updateContentFields } from "@/services/endpoint/content";

interface VdoBoxProps {
  contents: Contents;
  hideEdit?: boolean;
  notActive?: boolean;
}

const VdoBox: FC<VdoBoxProps> = ({ contents, hideEdit, notActive }) => {
  const [vdoUrl, setVdoUrl] = useState<string>(contents.value);
  const [ref, setRef] = useState<string[]>(
    Array.isArray(contents.ref) ? contents.ref : []
  );
  const [titleRef, setTitleRef] = useState<string[]>(
    Array.isArray(contents.title_ref) ? contents.title_ref : []
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // const [tempContent, setTempContent] = useState<Contents>(contents);
  const { role } = useAuth();
  useEffect(() => {
    setVdoUrl(contents.value);
    setRef(contents.ref);
    setTitleRef(contents.title_ref);
    setNewTitleRef("");
    setNewRef("");
    // setTempContent(contents);
  }, [contents, isEditing]);

  // const [tempUrl, setTempUrl] = useState<string>(vdoUrl);
  // const [isEditingRef, setIsEditingRef] = useState<boolean>(false);
  // const [tempRef, setTempRef] = useState<string[]>(contents);
  const [newRef, setNewRef] = useState<string>("");
  const [newTitleRef, setNewTitleRef] = useState<string>("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = async () => {
    const data: Partial<Contents> = {}; // ใช้ `Partial<Content>` เพื่อรองรับเฉพาะฟิลด์ที่ต้องการอัปเดต

    if (ref !== contents.ref && ref !== undefined) {
      data.ref = ref.map((item) => String(item));
      contents.ref = ref.map((item) => String(item));
    }
    if (titleRef !== contents.title_ref && titleRef !== undefined) {
      data.title_ref = titleRef.map((item) => String(item));
      contents.title_ref = titleRef.map((item) => String(item));
    }
    if (vdoUrl !== contents.value && vdoUrl !== undefined) {
      data.value = vdoUrl;
      contents.value = vdoUrl;
    }

    if (Object.keys(data).length > 0) {
      await updateContentFields(contents.id, data);
    }
    setIsEditing(false);
  };

  const handleAddRef = () => {
    if (newRef.trim()) {
      if (titleRef !== null) {
        setTitleRef([
          ...titleRef,
          newTitleRef ? newTitleRef.trim() : newRef.trim(),
        ]);
        setRef([...ref, newRef.trim()]);
      } else {
        setTitleRef([newTitleRef ? newTitleRef.trim() : newRef.trim()]);
        setRef([newRef.trim()]);
      }

      setNewTitleRef("");
      setNewRef("");
    }
  };

  const handleRemoveRef = (index: number) => {
    if (Array.isArray(ref) && Array.isArray(titleRef)) {
      setRef(ref.filter((_, i: number) => i !== index));
      setTitleRef(titleRef.filter((_, i: number) => i !== index));
    }
  };

  // แปลง URL YouTube เป็นรูปแบบ embed
  const validateAndConvertYouTubeURL = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        width: "100%",
      }}
    >
      {/* VDO Player */}
      <Box sx={{ width: `calc(100% - 20px)`, p: "10px", bgcolor: "#fff" }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            paddingBottom: "56.25%",
            backgroundColor: "#000",
            overflow: "hidden",
          }}
        >
          {vdoUrl ? (
            <iframe
              src={vdoUrl}
              title="Video Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            ></iframe>
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                backgroundColor: "#444",
              }}
            >
              <Typography variant="h6">ไม่มีวิดีโอ</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Refuments Menu */}
      {ref?.length > 0 && !notActive && (
        <Box>
          <Typography
            sx={{
              color: "#000",
              bgcolor: "#fff",
              p: "5px",
              cursor: "pointer",
              borderRadius: "4px",
              "&:hover": {
                bgcolor: "#f0f0f0",
              },
            }}
            onClick={handleClick}
          >
            เอกสารเรียนรู้เพิ่มเติม
          </Typography>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{
              "& .MuiPaper-root": {
                maxHeight: 48 * 4.5,
              },
              width: "100%",
              maxWidth: "300px",
            }}
          >
            {titleRef.map((title_ref, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  window.open(ref[index], "_blank");
                  handleClose();
                }}
                sx={{
                  whiteSpace: "normal",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "300px",
                  minWidth: "150px",
                }}
              >
                {title_ref}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}

      {isEditing && (
        <Box
          sx={{
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            overflow: "hidden",
            cursor: "grab",
          }}
        >
          <Box
            sx={{
              maxHeight: "90vh",
              bgcolor: "#fff",
              p: 5,
              borderRadius: "20px",
              overflow: "auto",
            }}
          >
            Edit Video URL
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <TextField
                size="small"
                value={vdoUrl}
                fullWidth
                onChange={(e) =>
                  setVdoUrl(validateAndConvertYouTubeURL(e.target.value))
                }
                // sx={{ width: "300px" }}
              />
            </Box>
            Documant
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {ref?.length > 0 && !notActive && (
                <Box>
                  {ref.map((doc, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        value={titleRef[index]}
                        onChange={(e) => {
                          const newTitleRef = [...titleRef];
                          newTitleRef[index] = e.target.value.trim();
                          setTitleRef(newTitleRef);
                        }}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        value={doc}
                        onChange={(e) => {
                          const newRef = [...ref];
                          newRef[index] = e.target.value.trim();
                          setRef(newRef);
                        }}
                      />
                      <IconButton onClick={() => handleRemoveRef(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Title"
                  value={newTitleRef}
                  onChange={(e) => setNewTitleRef(e.target.value)}
                />
                <TextField
                  size="small"
                  fullWidth
                  placeholder="URL"
                  value={newRef}
                  onChange={(e) => setNewRef(e.target.value)}
                />
                <Button
                  variant="contained"
                  disabled={newRef === "" ? true : false}
                  onClick={handleAddRef}
                >
                  Add
                </Button>
              </Box>

              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Admin Edit Panel */}
      {role === "admin" && !hideEdit && !notActive && (
        <Box
          sx={{
            mt: 2,
            mr: 2,
            bgcolor: "#fff",
            display: "flex",
            flexDirection: "column",
            p: "5px",
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            position: "absolute",
          }}
        >
          <Button
            sx={{
              bgcolor: "var(--color_primary)",
              color: "#fff",
            }}
            variant="outlined"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VdoBox;
