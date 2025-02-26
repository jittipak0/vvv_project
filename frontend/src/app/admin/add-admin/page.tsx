"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signUp } from "@/services/endpoint/user";
import NavBar from "@/components/NavBar";

export default function SignUp() {
  const router = useRouter();
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("teacher");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fname.trim()) {
      alert("กรุณากรอกชื่อจริง");
      return;
    }
    if (!lname.trim()) {
      alert("กรุณากรอกนามสกุล");
      return;
    }
    if (!email.trim()) {
      alert("กรุณากรอกอีเมล");
      return;
    }
    if (!password.trim()) {
      alert("กรุณากรอกรหัสผ่าน");
      return;
    }
    if (password.length < 6) {
      alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (!confirmPassword.trim()) {
      alert("กรุณากรอกยืนยันรหัสผ่าน");
      return;
    }
    if (password !== confirmPassword) {
      alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      await signUp(
        fname,
        lname,
        email,
        password,
        role,
      );

      alert("สมัครสมาชิกสำเร็จ");
      router.push("/admin");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "สมัครสมาชิกไม่สำเร็จ");
      } else {
        alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f5f5f5", m: "20px" }}
    >
      <Box sx={{ position: "fixed", top: "20px", left: "20px" }}>
        <NavBar />
      </Box>
      <Paper
        elevation={3}
        sx={{
          padding: "32px",
          width: "400px",
          textAlign: "center",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "16px" }}>
          สร้าง admin / teacher
        </Typography>
        <TextField
          fullWidth
          label="ชื่อจริง"
          variant="outlined"
          margin="normal"
          type="text"
          value={fname}
          onChange={(e) => setFName(e.target.value)}
        />
        <TextField
          fullWidth
          label="นามสกุล"
          variant="outlined"
          margin="normal"
          type="text"
          value={lname}
          onChange={(e) => setLName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email (kku-mail)"
          variant="outlined"
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* เพิ่ม Select สำหรับเลือก role */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <Box sx={{ minWidth: "50px" }}>Role</Box>
          <Select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ width: "50%" }}
          >
            <MenuItem value="admin">admin</MenuItem>
            <MenuItem value="teacher">teacher</MenuItem>
          </Select>
        </Box>
        <TextField
          fullWidth
          label="รหัสผ่าน"
          variant="outlined"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          label="ยืนยันรหัสผ่าน"
          variant="outlined"
          type="password"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSignUp}
          sx={{
            marginTop: "24px",
            padding: "8px",
            minWidth: "140px",
            backgroundColor: "var(--color_primary)",
            "&:hover": { backgroundColor: "var(--color_primary_hover)" },
            borderRadius: "25px",
          }}
        >
          สร้าง
        </Button>
      </Paper>
    </Box>
  );
}
