import React, { useState, useEffect } from "react";
import axios from "axios";

type Question = {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  points: number;
};

type Test = {
  id: string;
  title: string;
  questions: Question[];
};

export const AdminTestComponent: React.FC = () => {
  const [test, setTest] = useState<Test>({
    id: "",
    title: "",
    questions: [],
  });

  // ดึงแบบทดสอบจาก API
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/test`
        );
        setTest(response.data);
      } catch (err) {
        console.error("Failed to fetch test:", err);
      }
    };
    fetchTest();
  }, []);

  const addQuestion = () => {
    setTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `${prev.questions.length + 1}`,
          text: "",
          options: [],
          points: 0,
        },
      ],
    }));
  };

  const updateQuestion = (
    index: number,
    updatedQuestion: Partial<Question>
  ) => {
    const updatedQuestions = [...test.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      ...updatedQuestion,
    };
    setTest({ ...test, questions: updatedQuestions });
  };

  const saveTest = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/test`, test);
      alert("Test saved successfully!");
    } catch (err) {
      console.error("Failed to save test:", err);
    }
  };

  return (
    <div>
      <h1>Manage Test</h1>
      <input
        type="text"
        placeholder="Test Title"
        value={test.title}
        onChange={(e) => setTest({ ...test, title: e.target.value })}
      />
      {test.questions.map((question, index) => (
        <div key={question.id}>
          <input
            type="text"
            placeholder="Question Text"
            value={question.text}
            onChange={(e) => updateQuestion(index, { text: e.target.value })}
          />
          <button
            onClick={() =>
              updateQuestion(index, {
                options: [
                  ...test.questions[index].options,
                  {
                    id: `${test.questions[index].options.length + 1}`,
                    text: "",
                    isCorrect: false,
                  },
                ],
              })
            }
          >
            Add Option
          </button>
          {question.options.map((option, optIndex) => (
            <div key={option.id}>
              <input
                type="text"
                placeholder="Option Text"
                value={option.text}
                onChange={(e) => {
                  const updatedOptions = [...question.options];
                  updatedOptions[optIndex].text = e.target.value;
                  updateQuestion(index, { options: updatedOptions });
                }}
              />
              <label>
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) => {
                    const updatedOptions = [...question.options];
                    updatedOptions[optIndex].isCorrect = e.target.checked;
                    updateQuestion(index, { options: updatedOptions });
                  }}
                />
                Correct Answer
              </label>
            </div>
          ))}
          <input
            type="number"
            placeholder="Points"
            value={question.points}
            onChange={(e) =>
              updateQuestion(index, { points: Number(e.target.value) })
            }
          />
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={saveTest}>Save Test</button>
    </div>
  );
};
