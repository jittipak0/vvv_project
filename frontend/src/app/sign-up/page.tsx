"use client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "@/styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signUp } from "@/services/endpoint/user";

export default function SignUp() {
  const router = useRouter();
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [stdid, setStdId] = useState("");
  const [sec, setSec] = useState("");
  const [adviser, setAdviser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedPDPA, setAcceptedPDPA] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }

    // ตรวจสอบการยอมรับ PDPA จาก localStorage
    const pdpaAccepted = localStorage.getItem("pdpaAccepted");
    if (pdpaAccepted === "true") {
      setAcceptedPDPA(true);
    }
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedPDPA) {
      alert("กรุณาอ่านข้อตกลง PDPA ก่อนสมัครสมาชิก");
      return;
    }

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
    if (!stdid.trim()) {
      alert("กรุณากรอกรหัสนักศึกษา");
      return;
    }
    if (!sec.trim()) {
      alert("กรุณาระบุ section");
      return;
    }
    if (!adviser.trim()) {
      alert("กรุณากรอกชื่ออาจารย์ที่ปรึกษา");
      return;
    }
    if (stdid.length < 11) {
      alert("รหัสนักศึกษาไม่ครบ");
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
        "student",
        stdid,
        sec.trim(),
        adviser.trim()
      );

      alert("สมัครสมาชิกสำเร็จ");
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "สมัครสมาชิกไม่สำเร็จ");
      } else {
        alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    }
  };

  const handleStudentIDChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { value } = e.target;
    value = value.replace(/[^0-9\-]/g, "");
    if (value.length > 9 && value.indexOf("-") === -1) {
      value = value.slice(0, 9) + "-" + value.slice(9);
    }
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    setStdId(value);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundImage: `url('/images/IMG_1453.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
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
          SIGN UP
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            label="รหัสนักศึกษา"
            variant="outlined"
            margin="normal"
            type="text"
            value={stdid}
            onChange={handleStudentIDChange}
            inputProps={{ maxLength: 11 }}
            sx={{ mr: 2 }}
          />
          {"Sec."}
          <TextField
            placeholder="No."
            margin="normal"
            type="text"
            inputMode="numeric"
            value={sec}
            onChange={(e) => {
              const value = e.target.value;
              if (
                /^\d*$/.test(value) &&
                (value === "" || parseInt(value, 10) <= 999)
              ) {
                setSec(value === "" ? "" : value);
              }
            }}
            inputProps={{ pattern: "[0-9]*" }}
            sx={{ ml: 2, width: "100px" }}
          />
        </Box>
        <TextField
          fullWidth
          label="อาจารย์ที่ปรึกษา"
          variant="outlined"
          margin="normal"
          type="text"
          value={adviser}
          onChange={(e) => setAdviser(e.target.value)}
        />
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

        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedPDPA}
              onChange={(e) => setAcceptedPDPA(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2">
              ฉันยอมรับข้อตกลง PDPA (<Link href="/pdpa">อ่านรายละเอียด</Link>)
            </Typography>
          }
          sx={{ marginTop: "16px" }}
        />

        <Button
          variant="contained"
          onClick={handleSignUp}
          disabled={!acceptedPDPA}
          sx={{
            marginTop: "24px",
            padding: "8px",
            minWidth: "140px",
            backgroundColor: "var(--color_primary)",
            "&:hover": { backgroundColor: "var(--color_primary_hover)" },
            borderRadius: "25px",
          }}
        >
          สมัครเข้าใช้งาน
        </Button>
        <Typography
          variant="body2"
          sx={{ marginTop: "16px", color: "var(--color_text_light)" }}
        >
          มีบัญชีอยู่แล้ว? <Link href="/login">Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
