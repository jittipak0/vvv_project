"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import { adminGetTestByTitle, updateTest } from "@/services/endpoint/tests";
import { Test } from "@/types/api";
import NavBar from "@/components/NavBar";

interface Option {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  test_id: number;
  text: string;
  points: number;
  is_multi_correct: boolean;
  options: Option[];
}

const AdminTestEditor = ({ title }: { title: string }) => {
  const [testData, setTestData] = useState<Test | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await adminGetTestByTitle(title);
        setTestData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [title]);

  const calculateTotalPoints = (questions: Question[]) => {
    return questions.reduce((acc, question) => acc + question.points, 0);
  };

  const handleQuestionChange = useCallback(
    (
      questionId: number,
      field: keyof Question,
      value: string | number | boolean
    ) => {
      setTestData((prev) => {
        if (!prev) return null;

        const updatedQuestions = prev.questions.map((q) =>
          q.id === questionId ? { ...q, [field]: value } : q
        );

        return { ...prev, questions: updatedQuestions };
      });
    },
    []
  );

  const handleOptionChange = (
    questionId: number,
    optionId: number,
    field: keyof Option,
    value: string | boolean
  ) => {
    setTestData((prev) => {
      if (!prev) return null;

      const updatedQuestions = prev.questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = q.options.map((o) =>
            o.id === optionId ? { ...o, [field]: value } : o
          );

          // ตรวจสอบว่ามีคำตอบที่ถูกต้องกี่ข้อ
          const correctOptionsCount = updatedOptions.filter(
            (o) => o.is_correct
          ).length;

          return {
            ...q,
            options: updatedOptions,
            is_multi_correct: correctOptionsCount > 1,
          };
        }
        return q;
      });

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleAddQuestion = () => {
    setTestData((prev) =>
      prev
        ? {
            ...prev,
            questions: [
              ...prev.questions,
              {
                id: null as unknown as number,
                test_id: prev.id,
                text: "",
                points: 0,
                is_multi_correct: false,
                options: [],
              },
            ],
          }
        : null
    );
  };

  const handleDeleteQuestion = (questionId: number) => {
    setTestData((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.filter((q) => q.id !== questionId),
          }
        : null
    );
  };

  const handleAddOption = (questionId: number) => {
    setTestData((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q) =>
              q.id === questionId
                ? {
                    ...q,
                    options: [
                      ...q.options,
                      {
                        id: null as unknown as number,
                        question_id: questionId,
                        text: "",
                        is_correct: false,
                      },
                    ],
                  }
                : q
            ),
          }
        : null
    );
  };

  // ลบตัวเลือก
  const handleDeleteOption = (questionId: number, optionId: number) => {
    setTestData((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q) =>
              q.id === questionId
                ? { ...q, options: q.options.filter((o) => o.id !== optionId) }
                : q
            ),
          }
        : null
    );
  };

  const pointsRef = useRef<{ [key: number]: number }>({});

  const handlePointsChange = useCallback(
    (questionId: number, value: string) => {
      let newValue = parseInt(value, 10);
      if (Number.isNaN(newValue)) newValue = 0;

      // ป้องกันการเรียก setState ซ้ำโดยเช็คค่าก่อนหน้า
      if (pointsRef.current[questionId] !== newValue) {
        pointsRef.current[questionId] = newValue;
        setTestData((prev) =>
          prev
            ? {
                ...prev,
                questions: prev.questions.map((q) =>
                  q.id === questionId
                    ? { ...q, points: Math.max(0, newValue) }
                    : q
                ),
              }
            : null
        );
      }
    },
    []
  );

  // ส่งข้อมูลไปยัง backend
  const handleSubmit = async () => {
    if (!testData) return;
    try {
      testData.total_points = calculateTotalPoints(testData?.questions || []);
      await updateTest(testData.id, testData);
      alert("Test updated successfully!");
    } catch (error) {
      console.error("Failed to update test:", error);
      alert("Failed to update test.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignContent: "center" }}>
          <NavBar />
          <Typography sx={{ fontSize: { xs: "1.4rem", sm: "2rem" } }}>
            Edit Test: {testData?.title}
          </Typography>
        </Box>

        <Button
          color="primary"
          onClick={handleSubmit}
          sx={{
            border: "1px solid #1976d2",
            pl: "15px",
            pr: "15px",
            ":hover": { bgcolor: "#1976d2", color: "#fff" },
          }}
        >
          Save Test
        </Button>
      </Box>
      {testData?.questions.map((question) => (
        <Box
          key={question.id}
          sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: "15px" }}
        >
          <Box sx={{ display: "flex" }}>
            <TextField
              label="Question Text"
              fullWidth
              margin="normal"
              value={question.text}
              onChange={(e) =>
                handleQuestionChange(question.id, "text", e.target.value)
              }
            />
            <TextField
              label="Points"
              margin="normal"
              value={question.points || 0}
              onChange={(e) => (question.id, e.target.value)}
              onBlur={(e) => handlePointsChange(question.id, e.target.value)}
              sx={{ width: "70px", ml: "10px" }}
            />
          </Box>

          <Typography variant="h6">Options</Typography>
          {question.options.map((option) => (
            <Box key={option.id} sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                value={option.text}
                size="small"
                onChange={(e) =>
                  handleOptionChange(
                    question.id,
                    option.id,
                    "text",
                    e.target.value
                  )
                }
                sx={{ flex: 1, mr: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={option.is_correct}
                    onChange={(e) =>
                      handleOptionChange(
                        question.id,
                        option.id,
                        "is_correct",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Correct"
              />
              <IconButton
                onClick={() => handleDeleteOption(question.id, option.id)}
                sx={{ color: "#d37878", ":hover": { color: "#d32f2f" } }}
              >
                <Close />
              </IconButton>
            </Box>
          ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "15px",
            }}
          >
            <Button onClick={() => handleAddOption(question.id)}>
              Add Option
            </Button>
            <Button
              color="error"
              onClick={() => handleDeleteQuestion(question.id)}
            >
              <Delete /> Delete question
            </Button>
          </Box>
        </Box>
      ))}

      <Button onClick={handleAddQuestion} sx={{ mt: "15px" }}>
        Add Question
      </Button>

      <Button
        color="primary"
        onClick={handleSubmit}
        sx={{
          border: "1px solid #1976d2",
          pl: "15px",
          pr: "15px",
          ":hover": { bgcolor: "#1976d2", color: "#fff" },
          mt: "15px",
          ml: "5px",
        }}
      >
        Save Test
      </Button>
    </Box>
  );
};

export default AdminTestEditor;
