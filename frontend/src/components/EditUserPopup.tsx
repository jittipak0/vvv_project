"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { delUserByID, updateUser } from "@/services/endpoint/user";
import { User } from "@/types/api";

interface EditUserPopupProps {
  role: string;
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
  onDelete: () => void;
}

const EditUserPopup: React.FC<EditUserPopupProps> = ({
  role,
  user,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<User>(user);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "student_id") {
      newValue = newValue.replace(/[^0-9\-]/g, "");
      if (newValue.length > 9 && newValue.indexOf("-") === -1) {
        newValue = newValue.slice(0, 9) + "-" + newValue.slice(9);
      }
      if (newValue.length > 11) {
        newValue = newValue.slice(0, 11);
      }
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let updateData: Partial<User> = {};
      if (formData.fname !== user.fname) {
        updateData = { ...updateData, fname: formData.fname };
      }
      if (formData.lname !== user.lname) {
        updateData = { ...updateData, lname: formData.lname };
      }
      if (formData.email !== user.email) {
        updateData = { ...updateData, email: formData.email };
      }
      if (formData.student_id !== user.student_id) {
        updateData = { ...updateData, student_id: formData.student_id };
      }
      if (formData.section !== user.section) {
        updateData = { ...updateData, section: formData.section };
      }
      if (formData.adviser !== user.adviser) {
        updateData = { ...updateData, adviser: formData.adviser };
      }
      if (formData.remark !== user.remark) {
        updateData = { ...updateData, remark: formData.remark };
      }
      // ตรวจสอบว่า updateData มีคีย์หรือไม่
      if (Object.keys(updateData).length > 0) {
        const updated = await updateUser(formData.id, updateData);
        onSave(updated);
      }
    } catch {
      setError("Failed to update user.");
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const formatThaiDate = (dateInput: string | Date | null) => {
    if (!dateInput) return "-";
    const date = new Date(dateInput);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await delUserByID(formData.id);
      alert("User deleted successfully!");
      onClose();
      onDelete();
    } catch {
      setError("Failed to delete user.");
      alert("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  // const satisfactionLabels: { [key: string]: string } = {
  //   age: "อายุ",
  //   occupation: "อาชีพ",
  //   usage_count: "จำนวนครั้งที่เข้าใช้",
  //   usage_period: "หน่วย (วัน,สัปดาห์,เดือน,ปี)",
  //   ease_of_use: "ความง่ายในการใช้งาน",
  //   overall_satisfaction: "ความพึงพอใจโดยรวม",
  //   suggestions: "ข้อเสนอแนะ",
  //   date: "วันที่ทำแบบประเมิน",
  // };

  return (
    <Paper
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: 4,
        zIndex: 2000,
        maxWidth: 600,
        width: "90%",
        maxHeight: "60%",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          {role == "admin" ? "ดู / แก้ไข ข้อมูลผู้ใช้" : "ข้อมูลผู้ใช้"}
        </Typography>
        {role == "admin" && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteUser}
            disabled={loading}
          >
            Delete user
          </Button>
        )}
      </Box>

      {role == "admin" && (
        <Box>
          <TextField
            fullWidth
            label="ชื่อจริง"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="นามสกุล"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap: 2,
              justifyContent: "center",
            }}
          >
            <TextField
              fullWidth
              label="รหัสนักศึกษา"
              name="student_id"
              value={formData.student_id || ""}
              onChange={handleChange}
            />
            {"Sec."}
            <TextField
              placeholder="No."
              margin="normal"
              type="text"
              inputMode="numeric"
              value={formData.section || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  /^\d*$/.test(value) &&
                  (value === "" || parseInt(value, 10) <= 999)
                ) {
                  setFormData({ ...formData, section: value });
                }
              }}
              inputProps={{
                pattern: "[0-9]*",
              }}
              sx={{ width: "100px" }}
            />
          </Box>
          <TextField
            fullWidth
            label="อาจารย์ที่ปรึกษา"
            name="adviser"
            value={formData.adviser || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        </Box>
      )}
      {role !== "admin" && (
        <Box>
          {[
            { label: "ชื่อจริง", value: formData.fname },
            { label: "นามสกุล", value: formData.lname },
            { label: "Email", value: formData.email },
            { label: "รหัสนักศึกษา", value: formData.student_id },
            { label: "Sec.", value: formData.section },
            { label: "อาจารย์ที่ปรึกษา", value: formData.adviser },
          ].map((item, index) => (
            <Box key={index} mb={1}>
              <Typography variant="body1">
                {item.label} : {item.value ?? "-"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <TextField
        fullWidth
        label="หมายเหตุ"
        name="remark"
        multiline
        rows={4}
        margin="normal"
        value={formData.remark || ""}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Box>
        <Box fontWeight="bold" mb={1}>
          คะแนน
        </Box>
        {[
          {
            label: "Pre test",
            score: formData.pre_test_score,
            date: formData.pre_test_date,
          },
          {
            label: "Post test",
            score: formData.post_test_score,
            date: formData.post_test_date,
          },
          {
            label: "Post test สูงสุด",
            score: formData.highest_post_test_score,
            date: formData.highest_post_test_date,
          },
        ].map((item, index) => (
          <Box key={index} mb={1}>
            <Typography variant="body1">
              {item.label} : {item.score ?? "-"} คะแนน ทำเมื่อ{" "}
              {formatThaiDate(item.date || null)}
            </Typography>
          </Box>
        ))}

        {/* <Box fontWeight="bold" mb={1}>
          แบบประเมินความพึงพอใจ
        </Box>
        {formData.satisfaction_survey &&
          Object.entries(formData.satisfaction_survey).map(([key, value]) => (
            <Box key={key} sx={{ display: "flex", gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1">
                {satisfactionLabels[key] || key}:
              </Typography>
              <Typography variant="subtitle1">{value}</Typography>
            </Box>
          ))} */}
      </Box>

      {/* เพิ่ม field อื่น ๆ ตามที่ต้องการ */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default EditUserPopup;
