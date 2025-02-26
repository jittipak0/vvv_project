"use client";

import React, { useState } from "react";
import {
  Typography,
  Box,
  FormControlLabel,
  Radio,
  Checkbox,
  RadioGroup,
} from "@mui/material";

type Option = {
  id: number;
  text: string;
};

type QuestionProps = {
  questionId: number;
  text: string;
  is_multi_correct: boolean;
  options: Option[];
  selectedOptions: number[];
  onChange: (questionId: number, optionIds: number[]) => void;
  isSubmitting: boolean;
};

const QuestionComponent: React.FC<QuestionProps> = ({
  questionId,
  text,
  is_multi_correct,
  options,
  selectedOptions,
  onChange,
  isSubmitting,
}) => {
  const [localSelected, setLocalSelected] = useState<number[]>(selectedOptions);

  const handleOptionChange = (optionId: number, isChecked: boolean) => {
    let updatedSelection: number[];

    if (is_multi_correct) {
      updatedSelection = isChecked
        ? [...localSelected, optionId]
        : localSelected.filter((id) => id !== optionId); 
    } else {
      updatedSelection = [optionId]; 
    }

    setLocalSelected(updatedSelection);
    onChange(questionId, updatedSelection); 
  };

  return (
    <Box sx={{ width: "90%", mt: "30px" }}>
      <Typography variant="h5">{text}</Typography>

      {is_multi_correct ? (
        options.map((option) => (
          <Box key={option.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localSelected.includes(option.id)}
                  onChange={(e) =>
                    handleOptionChange(option.id, e.target.checked)
                  }
                  disabled={isSubmitting}
                />
              }
              label={option.text}
            />
          </Box>
        ))
      ) : (
        <RadioGroup
          value={localSelected[0] || ""}
          onChange={(e) => handleOptionChange(parseInt(e.target.value), true)}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio />}
              label={option.text}
              disabled={isSubmitting}
            />
          ))}
        </RadioGroup>
      )}

      <hr />
    </Box>
  );
};

export default QuestionComponent;
