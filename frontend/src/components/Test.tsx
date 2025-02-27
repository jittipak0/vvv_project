"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import QuestionComponent from "./Question";
import { getTestByTitle, submitTest } from "@/services/endpoint/tests";
import { useRouter } from "next/navigation";
import { Test } from "@/types/api";
import NavBar from "@/components/NavBar";
import {
  getAnswersFromStorage,
  removeAnswersFromStorage,
  saveAnswersToStorage,
} from "@/utils/localStorage";
import { useAuth } from "@/hooks/useAuth";
import { usePageData } from "@/hooks/usePageData";

interface Option {
  id: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  text: string;
  points: number;
  is_multi_correct: boolean;
  options: Option[];
}

interface TestProps {
  title: string;
  backPage?: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const TestComponent: React.FC<TestProps> = ({ title, backPage }) => {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [allAnswered, setAllAnswered] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateUserState } = useAuth();
  const [testData, setTestData] = useState<Test | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (title == "Pre-test") {
      if (user?.pre_test_date) {
        router.push(backPage || "/");
        return;
      }
    }
    const fetchTest = async () => {
      try {
        const response = await getTestByTitle(title);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (testData && testData.questions) {
      const shuffled = testData.questions.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
      setShuffledQuestions(shuffleArray(shuffled));
    }
  }, [testData]);

  useEffect(() => {
    const savedAnswers = getAnswersFromStorage();
    if (savedAnswers) {
      setAnswers(savedAnswers);
    }
  }, []);

  useEffect(() => {
    if (testData?.questions) {
      const allAnswered = testData.questions.every(
        (question) => answers[question.id] && answers[question.id].length > 0
      );
      setAllAnswered(allAnswered);
    }
  }, [answers, testData]);

  const handleAnswerChange = (questionId: number, optionIds: number[]) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: optionIds };
      saveAnswersToStorage(newAnswers); // บันทึกคำตอบชั่วคราวลง LocalStorage
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (!user || !testData) return;
    if (!allAnswered) {
      alert("ยังตอบไม่ครบ!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        question_id: parseInt(questionId),
        selected_options: answers[parseInt(questionId)],
      }));

      const response = await submitTest(
        user.id,
        testData.id,
        title,
        testData.total_points,
        formattedAnswers
      );
      setScore(response.score);
      updateUserState(response.userData);
      removeAnswersFromStorage();
    } catch (error) {
      console.error("Error submitting test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { pageData } = usePageData("satisfaction-survey");
  const handleNextPage = () => {
    window.location.href = `${pageData?.groups[0].contents[0].value}`;
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button sx={{ bgcolor: "ButtonFace" }} href={backPage}>
          ข้าม ไปยังหน้าหลัก
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "100%",
        height: "100vh",
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        minWidth="100vw"
        sx={{
          backgroundImage: `url('/images/IMG_1453.png')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          position: "fixed",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          bgcolor: "#e5f4ff",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          filter: "drop-shadow(-2px -4px 5px rgba(0, 0, 0, 0.5))",
          minHeight: "75px",
        }}
      >
        {title !== "Pre-test" && (
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <NavBar />
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4">{title}</Typography>
        </Box>
      </Box>
      {testData ? (
        <Box
          sx={{
            width: "90vw",
            bgcolor: "#ededed",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "0px 0px 50px 50px",
            pt: 4,
            mb: 6,
          }}
        >
          {shuffledQuestions.map((question) => (
            <QuestionComponent
              key={question.id}
              questionId={question.id}
              text={question.text}
              is_multi_correct={question.is_multi_correct}
              options={question.options}
              selectedOptions={answers[question.id] || []}
              onChange={handleAnswerChange}
              isSubmitting={isSubmitting}
            />
          ))}

          {score !== null && (
            <Box
              sx={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                sx={{ mb: 2, mt: 2, textAlign: "center" }}
              >
                คะแนนของคุณ: {score}/
                {testData.questions.reduce((acc, q) => acc + q.points, 0)}
              </Typography>

              {title == "Pre-test" ? (
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#1976d2",
                    borderRadius: "50px",
                    display: "flex",
                    alignItems: "center",
                    mb: 4,
                  }}
                  href="/"
                >
                  <Box sx={{ fontSize: "1.2rem" }}>ไปหน้าถัดไป</Box>
                </Button>
              ) : (
                <Box>
                  {score <
                  testData.questions.reduce((acc, q) => acc + q.points, 0) *
                    0.8 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "2rem",
                          color: (theme) => theme.palette.error.main,
                        }}
                      >
                        {`" ไม่ผ่าน "`}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          mb: 4,
                        }}
                      >
                        <Box>
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: "#fb3800",
                              borderRadius: "50px",
                              display: "flex",
                              alignItems: "center",
                              fontSize: "1rem",
                            }}
                            href="/"
                          >
                            กลับไปทบทวน
                          </Button>
                        </Box>

                        <Box fontSize={"2rem"}>|</Box>
                        <Box>
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: "#1976d2",
                              borderRadius: "50px",
                              display: "flex",
                              alignItems: "center",
                              fontSize: "1rem",
                            }}
                            href="/review/post-test"
                          >
                            ทำใหม่อีกครั้ง
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Box
                        sx={{
                          fontSize: "2rem",
                          color: "#377c42",
                          mb: 2,
                          textAlign: "center",
                        }}
                      >
                        {`" ผ่าน "`}
                      </Box>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#1976d2",
                          borderRadius: "50px",
                          display: "flex",
                          alignItems: "center",
                          mb: 4,
                          fontSize: "1.2rem",
                          ml: "auto",
                          mr: "auto",
                        }}
                        onClick={handleNextPage}
                      >
                        ไปหน้าถัดไป
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

          {score == null && (
            <Button
              variant="contained"
              sx={{
                mt: 2,
                mb: 4,
                bgcolor: "#fb3800",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleSubmit}
              disabled={isSubmitting || score !== null}
            >
              <Typography sx={{ fontSize: "20px", m: 1 }}>ส่ง</Typography>
            </Button>
          )}
        </Box>
      ) : (
        <Typography variant="h6">No test data available</Typography>
      )}
    </Box>
  );
};

export default TestComponent;
