"use client";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export default function PDPA() {
  const router = useRouter();

  const handleAccept = () => {
    // บันทึกการยอมรับ PDPA ใน localStorage
    localStorage.setItem("pdpaAccepted", "true");
    router.push("/sign-up"); // เปลี่ยนเส้นทางกลับไปที่หน้า SignUp
  };

  const handleDecline = () => {
    alert("คุณจำเป็นต้องยอมรับ PDPA เพื่อสมัครสมาชิก");
    router.push("/sign-up");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper
        elevation={3}
        sx={{
          padding: "32px",
          width: "600px",
          textAlign: "center",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "16px" }}>
          นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "left",
            marginBottom: "24px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="body1"
            sx={{ textAlign: "left", marginBottom: "16px" }}
          >
            <strong>1. คำนิยาม</strong>
            <br />- <strong>ข้อมูลส่วนบุคคล:</strong> หมายถึงข้อมูลใด ๆ
            ที่สามารถระบุหรือเชื่อมโยงไปยังบุคคลที่เป็นเจ้าของข้อมูล เช่น ชื่อ
            ที่อยู่ อีเมล เบอร์โทรศัพท์ รหัสนักศึกษา และข้อมูลอื่น ๆ
            ที่เกี่ยวข้อง
            <br />- <strong>เจ้าของข้อมูล:</strong>{" "}
            บุคคลที่เกี่ยวข้องกับข้อมูลส่วนบุคคลที่เราเก็บรวบรวม
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "left", marginBottom: "16px" }}
          >
            <strong>2. วัตถุประสงค์ในการเก็บรวบรวมข้อมูล</strong>
            <br />
            เราเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลของคุณเพื่อวัตถุประสงค์ต่อไปนี้:
            <br />- เพื่อให้บริการและสนับสนุนการใช้งานระบบของเรา
            <br />-
            เพื่อยืนยันตัวตนและประเมินความถูกต้องของข้อมูลที่ใช้ในการสมัครสมาชิก
            <br />-
            เพื่อปรับปรุงและพัฒนาบริการให้เหมาะสมกับความต้องการของผู้ใช้งาน
            <br />- เพื่อการติดต่อสื่อสาร
            แจ้งข่าวสารหรือข้อมูลสำคัญที่เกี่ยวข้องกับบริการ
            <br />- เพื่อปฏิบัติตามข้อกำหนดทางกฎหมายและระเบียบที่เกี่ยวข้อง
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "left", marginBottom: "16px" }}
          >
            <strong>3. ข้อมูลที่เก็บรวบรวม</strong>
            <br />
            ข้อมูลส่วนบุคคลที่เราอาจเก็บรวบรวมประกอบด้วย:
            <br />- ชื่อและนามสกุล
            <br />- ที่อยู่อีเมล (โดยเฉพาะอีเมลของสถาบัน)
            <br />- รหัสนักศึกษา (และข้อมูลเกี่ยวกับ section)
            <br />- ชื่ออาจารย์ที่ปรึกษา
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "left", marginBottom: "16px" }}
          >
            <strong>4. การให้ความยินยอมและสิทธิของเจ้าของข้อมูล</strong>
            <br />- เมื่อคุณคลิก &quot;ยอมรับ&quot; ข้อตกลง PDPA นี้
            หมายความว่าคุณได้อ่านและยินยอมให้เราเก็บรวบรวม ใช้
            และจัดเก็บข้อมูลส่วนบุคคลของคุณตามที่ระบุไว้ในนโยบายนี้
            <br />- <strong>สิทธิของเจ้าของข้อมูล:</strong>{" "}
            คุณมีสิทธิ์ในการเข้าถึง แก้ไข
            หรือขอให้ลบข้อมูลส่วนบุคคลของคุณตลอดเวลา
            รวมถึงมีสิทธิ์ในการถอนความยินยอมในการใช้ข้อมูลของคุณ
          </Typography>
          
          <Typography
            variant="body1"
            sx={{ textAlign: "left", marginBottom: "16px" }}
          >
            <strong>5. การเก็บรักษาและความปลอดภัยของข้อมูล</strong>
            <br />-
            เราจะดำเนินมาตรการที่เหมาะสมในการรักษาความปลอดภัยของข้อมูลส่วนบุคคล
            เพื่อป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต การสูญหาย
            หรือการเปลี่ยนแปลงข้อมูล
            <br />-
            ข้อมูลส่วนบุคคลจะถูกเก็บรักษาตามระยะเวลาที่จำเป็นเพื่อวัตถุประสงค์ที่เก็บรวบรวม
            และปฏิบัติตามข้อกำหนดทางกฎหมาย
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "left", marginBottom: "16px" }}
          >
            <strong>6. การเปิดเผยข้อมูลต่อบุคคลที่สาม</strong>
            <br />-
            เราจะไม่เปิดเผยหรือขายข้อมูลส่วนบุคคลของคุณให้แก่บุคคลที่สามโดยไม่ได้รับความยินยอมจากคุณ
            เว้นแต่จะเป็นไปตามที่กฎหมายกำหนด
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "left", marginBottom: "16px" }}
          >
            <strong>7. การเปลี่ยนแปลงนโยบาย</strong>
            <br />-
            นโยบายคุ้มครองข้อมูลส่วนบุคคลฉบับนี้อาจมีการปรับปรุงเปลี่ยนแปลงเป็นครั้งคราว
            เราจะแจ้งให้ทราบในเว็บไซต์หรือแอปพลิเคชันของเราเมื่อมีการเปลี่ยนแปลงนโยบาย
          </Typography>
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={handleDecline} color="error">
            ไม่ยอมรับ
          </Button>
          <Button variant="contained" onClick={handleAccept} color="primary">
            ยอมรับ
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
