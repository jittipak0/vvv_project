"use client";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { updateSatisfactionSurvey } from "@/services/endpoint/user";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";

const SatisfactionSurvey = () => {
  const router = useRouter();
  const { user, updateUserState } = useAuth();

  useEffect(() => {
    if (user && user.post_test_pass === false) {
      router.push("/review/post-test");
    }
  }, [user, router]);

  // สถานะของแบบสอบถาม
  const [userData, setUserData] = useState({
    age: "",
    occupation: "",
    usageCount: "",
    usagePeriod: "วัน", // ค่าเริ่มต้นเป็น "วัน"
    easeOfUse: "",
    overallSatisfaction: "",
    suggestions: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // สำหรับ TextField และ Radio
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  // สำหรับ Select
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setUserData({
      ...userData,
      [event.target.name as string]: event.target.value,
    });
  };

  // เช็คว่าผู้ใช้ตอบทุกข้อหรือยัง (ยกเว้นข้อเสนอแนะ)
  const isFormComplete = () => {
    const requiredFields = [
      "age",
      "occupation",
      "usageCount",
      "easeOfUse",
      "overallSatisfaction",
    ];
    return requiredFields.every(
      (field) => userData[field as keyof typeof userData] !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      setErrorMessage("กรุณาตอบทุกคำถามก่อนส่งแบบสอบถาม");
      return;
    }

    if (!user) {
      return;
    }

    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);

    try {
      const response = await updateSatisfactionSurvey(user?.id, {
        age: userData.age,
        occupation: userData.occupation,
        usage_count: userData.usageCount,
        usage_period: userData.usagePeriod,
        ease_of_use: userData.easeOfUse,
        overall_satisfaction: userData.overallSatisfaction,
        suggestions: userData.suggestions,
        date: formattedDate,
      });

      alert("ส่งแบบสอบถามเรียบร้อย!");
      updateUserState(response.user);
      setErrorMessage(null);
      setUserData({
        age: "",
        occupation: "",
        usageCount: "",
        usagePeriod: "วัน",
        easeOfUse: "",
        overallSatisfaction: "",
        suggestions: "",
      });
      router.push("/certificate");
    } catch (error) {
      console.error(" ส่งแบบสอบถามไม่สำเร็จ:", error);
      setErrorMessage("เกิดข้อผิดพลาดในการส่งแบบสอบถาม กรุณาลองอีกครั้ง");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "100%",
          height: "100vh",
        }}
      >
        {/* Header */}
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
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY( -50%)",
            }}
          >
            <NavBar />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h4">แบบประเมินความพึงพอใจ</Typography>
          </Box>
        </Box>

        {/* ส่วนของแบบสอบถาม */}
        <Box
          sx={{
            minWidth: "50%",
            bgcolor: "#ededed",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "0px 0px 50px 50px",
            pt: 4,
            mb: 6,
            p: 3,
          }}
        >
          {/* 1. ข้อมูลทั่วไปของผู้ใช้ */}
          <Box sx={{ width: "100%", maxWidth: "90%", mb: 3 }}>
            <Typography variant="h6">1. ข้อมูลทั่วไปของผู้ใช้</Typography>
            <TextField
              label="อายุ"
              name="age"
              fullWidth
              margin="normal"
              value={userData.age}
              onChange={(e) => {
                const value = e.target.value;

                if (
                  /^\d*$/.test(value) &&
                  (value === "" || parseInt(value, 10) <= 150)
                ) {
                  setUserData((prev) => ({
                    ...prev,
                    age: value,
                  }));
                }
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 3,
              }}
            />

            <TextField
              label="อาชีพ"
              name="occupation"
              fullWidth
              margin="normal"
              value={userData.occupation}
              onChange={handleInputChange}
            />

            {/* ความถี่ในการใช้งาน */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <TextField
                label="จำนวนครั้ง"
                name="usageCount"
                value={userData.usageCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setUserData((prev) => ({
                      ...prev,
                      usageCount: value,
                    }));
                  }
                }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                sx={{ width: "50%" }}
              />
              <Box sx={{ minWidth: "50px" }}>
                <Typography>ครั้งต่อ</Typography>
              </Box>
              <Select
                name="usagePeriod"
                value={userData.usagePeriod}
                onChange={handleSelectChange}
                sx={{ width: "50%" }}
              >
                <MenuItem value="วัน">วัน</MenuItem>
                <MenuItem value="สัปดาห์">สัปดาห์</MenuItem>
                <MenuItem value="เดือน">เดือน</MenuItem>
                <MenuItem value="ปี">ปี</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* 2. การใช้งานเว็บไซต์และความง่ายในการใช้งาน */}
          <Box sx={{ width: "100%", maxWidth: "90%", mb: 3 }}>
            <Typography variant="h6">
              2. การใช้งานเว็บไซต์และความง่ายในการใช้งาน
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">ความง่ายในการใช้งาน</FormLabel>
              <RadioGroup
                name="easeOfUse"
                value={userData.easeOfUse}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="ง่ายมาก"
                  control={<Radio />}
                  label="ง่ายมาก"
                />
                <FormControlLabel
                  value="ค่อนข้างง่าย"
                  control={<Radio />}
                  label="ค่อนข้างง่าย"
                />
                <FormControlLabel
                  value="ปานกลาง"
                  control={<Radio />}
                  label="ปานกลาง"
                />
                <FormControlLabel
                  value="ค่อนข้างยาก"
                  control={<Radio />}
                  label="ค่อนข้างยาก"
                />
                <FormControlLabel
                  value="ยากมาก"
                  control={<Radio />}
                  label="ยากมาก"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* 3. ความพึงพอใจโดยรวม */}
          <Box sx={{ width: "100%", maxWidth: "90%", mb: 3 }}>
            <Typography variant="h6">3. ความพึงพอใจโดยรวม</Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">ให้คะแนนความพึงพอใจ</FormLabel>
              <RadioGroup
                name="overallSatisfaction"
                value={userData.overallSatisfaction}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="5"
                  control={<Radio />}
                  label="5 - ดีมาก"
                />
                <FormControlLabel
                  value="4"
                  control={<Radio />}
                  label="4 - ดี"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="3 - ปานกลาง"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="2 - พอใช้"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="1 - ควรปรับปรุง"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* 4. ข้อเสนอแนะ */}
          <Box sx={{ width: "100%", maxWidth: "90%", mb: 3 }}>
            <Typography variant="h6">4. ข้อเสนอแนะ</Typography>
            <TextField
              label="ข้อเสนอแนะเพิ่มเติม"
              name="suggestions"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={userData.suggestions}
              onChange={handleInputChange}
            />
          </Box>

          {/* แจ้งเตือนถ้าข้อมูลไม่ครบ */}
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}

          {/* ปุ่มส่งแบบสอบถาม */}
          <Button
            variant="contained"
            sx={{ mt: 2, mb: 4, bgcolor: "#fb3800", borderRadius: "15px" }}
            onClick={handleSubmit}
          >
            <Typography sx={{ fontSize: "20px", m: 1 }}>ส่ง</Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SatisfactionSurvey;
