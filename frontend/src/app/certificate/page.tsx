"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

interface CertificateData {
  name: string;
  day: string;
  month: string;
  year: string;
}

export default function CertificatePage() {
  const [certificateData, setCertificateData] =
    useState<CertificateData | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user?.role != "admin") {
      if (user && user.post_test_pass === false) {
        router.push("/review/post-test");
      }
      // if (user?.satisfaction_survey === null) {
      //   router.push("/review/satisfaction-survey");
      // }
    }
  }, [user, router]);

  //! useEffect(() => {
  //!   setTimeout(() => {
  //!     if (user?.highest_post_test_date) {
  //!       const [date, month, year] = user.highest_post_test_date;

  //!       setCertificateData({
  //!         name: `${user?.fname}  ${user?.lname}`,
  //!         day: date || "ไม่ระบุ",
  //!         month: month || "ไม่ระบุ",
  //!         year: year || "ไม่ระบุ",
  //!       });
  //!     }
  //!     setLoading(false);
  //!   }, 1000);
  //! }, [user]);

  useEffect(() => {
    setTimeout(() => {
      if (user?.highest_post_test_date) {
        // แปลงรูปแบบ '2025-02-25 08:46:22.344633+00' ให้เป็น ISO ที่ Date.parse() เข้าใจ
        // เช่น แทรกตัว 'T' แทน space (บางเบราว์เซอร์อาจ parse ได้เลย แต่เพื่อความชัวร์)
        const dateString = user.highest_post_test_date.replace(" ", "T");

        // สร้าง Date object
        const dt = new Date(dateString);

        // ดึงค่า day, monthIndex, year ออกมา
        const day = dt.getDate(); // 1-31
        const monthIndex = dt.getMonth(); // 0-11
        const year = dt.getFullYear() + 543; // +543 สำหรับ พ.ศ.

        // ชื่อเดือนแบบไทย
        const monthsThai = [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ];

        setCertificateData({
          name: `${user?.fname}  ${user?.lname}`,
          day: day.toString(),
          month: monthsThai[monthIndex],
          year: year.toString(),
        });
      }
      setLoading(false);
    }, 1000);
  }, [user]);

  const downloadPDF = async () => {
    setIsDownloading(true); // แสดง Loader ระหว่างดาวน์โหลด
    const certificateElement = document.getElementById("certificate-high-res");
    if (!certificateElement) return;

    // เรนเดอร์ด้วยคุณภาพสูง
    const canvas = await html2canvas(certificateElement, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    // กำหนดขนาด PDF เป็น A4 แนวนอน (297 x 210 mm)
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    pdf.save(`certificate_${certificateData?.name}.pdf`);

    setIsDownloading(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box sx={{ position: "absolute", left: "25px", top: "25px" }}>
        <NavBar />
      </Box>
      {/*  ตัวอย่าง Preview (ขนาดเล็กลง) */}
      <Box
        id="certificate-preview"
        sx={{ maxWidth: "90vmin", maxHeight: "auto", position: "relative" }}
      >
        <Box
          component="img"
          src="/images/certificate.webp"
          alt="Certificate Preview"
          style={{ width: "100%", height: "100%" }}
        />

        <Typography
          sx={{
            position: "absolute",
            top: "42%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "2.8vmin",
            color: "#333",
            textAlign: "center",
            width: "80%",
          }}
        >
          {certificateData?.name}
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: "28.5%",
            left: "40%",
            transform: "translateY( -50%)",
            fontSize: "1.4vmin",
            color: "#333",
            textAlign: "center",
            width: "5%",
          }}
        >
          {certificateData?.day}
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: "29%",
            left: "49.4%",
            transform: "translateY( -50%)",
            fontSize: "1.25vmin",
            color: "#333",
            textAlign: "center",
            width: "6.5%",
          }}
        >
          {certificateData?.month}
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: "28.5%",
            left: "59.8%",
            transform: "translateY( -50%)",
            fontSize: "1.4vmin",
            color: "#333",
            textAlign: "center",
            width: "7.7%",
          }}
        >
          {certificateData?.year}
        </Typography>
      </Box>

      {/*  ส่วนที่ใช้ Render PDF (ซ่อนจากตา) */}
      <Box
        id="certificate-high-res"
        sx={{
          width: "1200px",
          height: "675px",
          position: "absolute",
          left: "-9999px",
        }}
      >
        <Box
          component="img"
          src="/images/certificate.webp"
          alt="Certificate High-Res"
          style={{ width: "100%", height: "100%" }}
        />
        <Typography
          sx={{
            position: "absolute",
            top: "43.2%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "30px",
            color: "#333",
            textAlign: "center",
            width: "80%",
          }}
        >
          {certificateData?.name}
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: "27.2%",
            left: "39.8%",
            transform: "translateY( -50%)",
            fontSize: "24px",
            color: "#333",
            textAlign: "center",
            width: "5%",
          }}
        >
          {certificateData?.day}
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: "28.7%",
            left: "49.4%",
            transform: "translateY( -50%)",
            fontSize: "15.5px",
            color: "#333",
            textAlign: "center",
            width: "6.5%",
          }}
        >
          {certificateData?.month}
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: "27.3%",
            left: "59.8%",
            transform: "translateY( -50%)",
            fontSize: "24px",
            color: "#333",
            textAlign: "center",
            width: "7.7%",
          }}
        >
          {certificateData?.year}
        </Typography>
      </Box>

      {/*  ปุ่มดาวน์โหลด PDF */}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "20px", fontSize: "1.2rem", padding: "10px 20px" }}
        onClick={downloadPDF}
        disabled={isDownloading}
      >
        {isDownloading ? "กำลังสร้าง PDF..." : "ดาวน์โหลดเกียรติบัตร"}
      </Button>
    </Box>
  );
}
