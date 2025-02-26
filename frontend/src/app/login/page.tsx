"use client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Grid2,
} from "@mui/material";
import React, { useState } from "react";
import "@/styles/globals.css";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useLoading } from "@/hooks/useLoading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("กรุณากรอกอีเมล");
      return;
    }
    if (!password.trim()) {
      alert("กรุณากรอกรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);
      await login(email, password, rememberMe);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLoading(false);
        alert(error.message);
      } else {
        setLoading(false);
        alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }
    }
  };

  const loadingComponent = useLoading(loading, null);
  if (loadingComponent) return loadingComponent;

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
          LOG IN
        </Typography>

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          onChange={(e) => setEmail(e.target.value.trim())}
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          sx={{
            marginTop: "24px",
            padding: "8px",
            minWidth: "100px",
            backgroundColor: "var(--color_primary)",
            "&:hover": { backgroundColor: "var(--color_primary_hover)" },
            borderRadius: "25px",
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Grid2
          container
          display="flex"
          alignItems={"center"}
          justifyContent={"space-around"}
          sx={{ marginTop: "16px" }}
        >
          <Grid2 display="flex">
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    "&.Mui-checked": {
                      color: "var(--color_primary)",
                    },
                  }}
                />
              }
              label="Remember me"
              labelPlacement="end"
            />
          </Grid2>

          <Typography variant="body2" sx={{ color: "var(--color_text_light)" }}>
            <Link href="/sign-up">Sign up</Link>
            {/* <Link href="/forget-password"> Forget your password ?</Link> */}
          </Typography>
        </Grid2>
      </Paper>
    </Box>
  );
}
