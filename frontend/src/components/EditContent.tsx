"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  Checkbox,
} from "@mui/material";
import { Upload, Delete, Description, Add } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import {
  createOrUpdatePage,
  getPageByTitle,
  uploadImage,
} from "@/services/endpoint/content";
import { Page } from "@/types/api";
import NavBar from "./NavBar";
import VdoBox from "./VdoBox";
import FullscreenImage from "./FullscreenImage";
import { useLoading } from "@/hooks/useLoading";

// Helper function สำหรับ update content ใน nested state
const updateContent = (
  groupIndex: number,
  contentIndex: number,
  updater: (content: Page["groups"][number]["contents"][number]) => void,
  setPageData: React.Dispatch<React.SetStateAction<Page | null>>
) => {
  setPageData((prev) => {
    if (!prev) return null;
    // ทำ deep clone เพื่อไม่แก้ไข state เดิม
    const newData = structuredClone(prev);
    const content = newData.groups[groupIndex].contents[contentIndex];
    updater(content);
    return newData;
  });
};

const EditContent = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const label = searchParams.get("label");
  const labelpage = searchParams.get("labelpage");
  const [pageData, setPageData] = useState<Page | null>(null);
  const [tempPageData, setTempPageData] = useState<Page | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingUploads, setPendingUploads] = useState<{ [key: string]: File }>(
    {}
  );

  // เมื่อ component mount ให้ดึงข้อมูล page โดย deep clone เพื่อให้ tempPageData คงค่าเดิม
  useEffect(() => {
    if (!labelpage) return;
    const fetchPageData = async () => {
      try {
        const response = await getPageByTitle(labelpage);
        setPageData(response);
        setTempPageData(structuredClone(response));
      } catch {
        setError("Failed to load page data");
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [labelpage]);

  // Update video URL หลังแปลงเป็น embed URL
  const handleVdoChange = (
    groupIndex: number,
    contentIndex: number,
    newValue: string
  ) => {
    updateContent(
      groupIndex,
      contentIndex,
      (content) => {
        content.value = validateAndConvertYouTubeURL(newValue);
      },
      setPageData
    );
  };

  // Update flag ใน content.ref[0]
  const handleUpdateContent = (
    groupIndex: number,
    contentIndex: number,
    newValue: boolean
  ) => {
    updateContent(
      groupIndex,
      contentIndex,
      (content) => {
        // ตรวจสอบว่า ref มีค่าอยู่แล้วหรือไม่ ถ้าไม่มีให้ initialize เป็น array
        if (!content.ref) content.ref = [];
        content.ref[0] = newValue ? "true" : "false";
      },
      setPageData
    );
  };

  // เพิ่มเอกสาร (เพิ่มค่าใน ref array)
  const handleAddRef = (groupIndex: number, contentIndex: number) => {
    updateContent(
      groupIndex,
      contentIndex,
      (content) => {
        if (Array.isArray(content.ref)) {
          content.ref.push("");
        } else {
          content.ref = [""];
        }
      },
      setPageData
    );
  };

  // เมื่อเลือกไฟล์ใหม่ ให้ update preview ใน content.value และบันทึกไว้ใน pendingUploads
  const handleImageSelection = (
    groupIndex: number,
    contentIndex: number,
    file: File
  ) => {
    // Update preview URL ใน pageData
    updateContent(
      groupIndex,
      contentIndex,
      (content) => {
        content.value = URL.createObjectURL(file);
      },
      setPageData
    );
    // เก็บไฟล์ไว้ใน pendingUploads สำหรับการอัปโหลดจริงใน handleSave
    setPendingUploads((prev) => ({
      ...prev,
      [`${groupIndex}-${contentIndex}`]: file,
    }));
  };

  // Update เอกสาร (ref array) เมื่อมีการเปลี่ยนแปลง
  const handleRefChange = (
    groupIndex: number,
    contentIndex: number,
    docIndex: number,
    newValue: string
  ) => {
    updateContent(
      groupIndex,
      contentIndex,
      (content) => {
        if (!content.ref) {
          content.ref = [];
        }
        content.ref[docIndex] = newValue;
      },
      setPageData
    );
  };

  // Update title ของเอกสาร (title_ref array)
  const handleTitleRefChange = (
    groupIndex: number,
    contentIndex: number,
    docIndex: number,
    newValue: string
  ) => {
    updateContent(
      groupIndex,
      contentIndex,
      (content) => {
        if (!content.title_ref) {
          content.title_ref = [];
        }
        content.title_ref[docIndex] = newValue;
      },
      setPageData
    );
  };

  // ลบเอกสารใน ref array โดยใช้ filter
  const handleDeleteRef = (
    groupIndex: number,
    contentIndex: number,
    docIndex: number
  ) => {
    updateContent(
      groupIndex,
      contentIndex,
      (content) => {
        if (Array.isArray(content.ref)) {
          content.ref = content.ref.filter((_, idx) => idx !== docIndex);
        }
      },
      setPageData
    );
  };

  const handleSave = async () => {
    if (!pageData) return;
    setLoading(true);
    try {
      const updatedPageData = structuredClone(pageData);

      updatedPageData.groups.forEach((group) => {
        group.contents.forEach((content) => {
          if (Array.isArray(content.ref)) {
            // กรองค่า "" ออกจาก ref และลบ title_ref ที่สอดคล้องกัน
            const filteredRefs = content.ref
              .map((ref, index) => ({
                ref,
                title: content.title_ref?.[index] || "",
              }))
              .filter(({ ref }) => ref.trim() !== "");

            content.ref = filteredRefs.map(({ ref }) => ref);
            content.title_ref = filteredRefs.map(({ title }) => title);
          }
        });
      });

      for (const key in pendingUploads) {
        const [groupIndex, contentIndex] = key.split("-").map(Number);
        const file = pendingUploads[key];
        const oldFileURL =
          tempPageData?.groups[groupIndex]?.contents[contentIndex]?.value || "";
        const imageUrl = await uploadImage(oldFileURL, file);
        updatedPageData.groups[groupIndex].contents[contentIndex].value =
          imageUrl;
      }

      await createOrUpdatePage(updatedPageData);
      setLoading(false);
      alert("Page updated successfully!");
      setPendingUploads({});
    } catch {
      setLoading(false);
      alert("Failed to save.");
    }
  };

  // แปลง URL YouTube เป็นรูปแบบ embed
  const validateAndConvertYouTubeURL = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  const loadingComponent = useLoading(loading, error);
  if (loadingComponent) return loadingComponent;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <NavBar />
        <Typography sx={{ fontSize: { xs: "1.4rem", sm: "2rem" } }}>
          {title}-{label}
        </Typography>
      </Box>

      {pageData?.groups.map((group, groupIndex) => (
        <Box
          key={group.id}
          sx={{
            mt: 4,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography sx={{ fontSize: { xs: "1.4rem", sm: "2rem" } }}>
            {group.name || ""}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "space-around",
            }}
          >
            {group.contents.map((content, contentIndex) => (
              <Box
                key={content.id}
                sx={{
                  mt: 2,
                  p: 2,
                  border: "1px solid #ddd",
                  display: "flex",
                  flexDirection: "column",
                  width: "fit-content",
                  maxWidth: "100%",
                  height: "fit-content",
                }}
              >
                {/* สำหรับรูปภาพ */}
                {content.type === "img" && (
                  <Box
                    sx={{
                      maxWidth:
                        content.ref_type === "label" ? "300px" : "500px",
                    }}
                  >
                    <Box sx={{ border: "1px solid #ddd", mb: 2 }}>
                      <FullscreenImage
                        contents={content}
                        notActive={true}
                        pendingUploads={pendingUploads}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<Upload />}
                        sx={{ fontSize: { xs: "0.5rem", sm: "0.75rem" } }}
                      >
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            e.target.files &&
                            handleImageSelection(
                              groupIndex,
                              contentIndex,
                              e.target.files[0]
                            )
                          }
                        />
                      </Button>
                      {content.ref_type === "label" && (
                        <Box>
                          <Checkbox
                            checked={content.ref[0] === "true"}
                            onChange={(e) =>
                              handleUpdateContent(
                                groupIndex,
                                contentIndex,
                                e.target.checked
                              )
                            }
                            sx={{ fontSize: { xs: "0.5rem", sm: "0.75rem" } }}
                          />
                          Correct
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* สำหรับข้อความ */}
                {content.type === "text" && (
                  <Box
                    sx={{
                      width: content.ref_type === "label" ? "auto" : "80vw",
                      maxWidth: content.ref_type === "label" ? "300px" : "100%",
                    }}
                  >
                    <TextField
                      fullWidth
                      value={content.value}
                      onChange={(e) => {
                        updateContent(
                          groupIndex,
                          contentIndex,
                          (content) => {
                            content.value = e.target.value;
                          },
                          setPageData
                        );
                      }}
                      sx={{ mt: "10px" }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {content.ref_type === "label" && (
                        <Box>
                          <Checkbox
                            checked={content.ref[0] === "true"}
                            onChange={(e) =>
                              handleUpdateContent(
                                groupIndex,
                                contentIndex,
                                e.target.checked
                              )
                            }
                          />
                          Correct
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* สำหรับวิดีโอ */}
                {content.type === "vdo" && (
                  <Box sx={{ maxWidth: "500px" }}>
                    <VdoBox contents={content} notActive />
                    <TextField
                      fullWidth
                      label="YouTube URL"
                      value={content.value}
                      onChange={(e) =>
                        handleVdoChange(
                          groupIndex,
                          contentIndex,
                          e.target.value
                        )
                      }
                      sx={{ mt: "10px" }}
                    />
                    {/* แสดงเอกสารที่แนบ */}
                    {content.ref && (
                      <List>
                        {content.ref.map((_, index) => (
                          <Box key={index}>
                            <ListItem
                              sx={{
                                display: "flex",
                                gap: 2,
                                flexDirection: { xs: "column", sm: "row" },
                                alignContent: "start",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "center",
                                }}
                              >
                                <Description />
                                <TextField
                                  fullWidth
                                  label={`Title ${index + 1}`}
                                  value={content.title_ref?.[index] || ""}
                                  placeholder={content.ref?.[index]}
                                  onChange={(e) =>
                                    handleTitleRefChange(
                                      groupIndex,
                                      contentIndex,
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </Box>
                              <TextField
                                fullWidth
                                label={`Ref ${index + 1}`}
                                value={content.ref?.[index]}
                                onChange={(e) =>
                                  handleRefChange(
                                    groupIndex,
                                    contentIndex,
                                    index,
                                    e.target.value
                                  )
                                }
                              />
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleDeleteRef(
                                    groupIndex,
                                    contentIndex,
                                    index
                                  )
                                }
                              >
                                <Delete />
                              </IconButton>
                            </ListItem>
                            <hr />
                          </Box>
                        ))}
                      </List>
                    )}
                    <Button
                      startIcon={<Add />}
                      onClick={() => handleAddRef(groupIndex, contentIndex)}
                    >
                      Add document
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 3, width: "100%" }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default EditContent;
