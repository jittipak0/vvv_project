"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import NavBar from "@/components/NavBar";

const team = [
  { src: "/images/about/กัณฑิมา วัณมา.png", name: "นางสาวกัณฑิมา  วันมา" },
  {
    src: "/images/about/จิตรานันท์     เพิ่มขึ้น_.png",
    name: "นางสาวจิตรานันท์  เพิ่มขึ้น",
  },
  { src: "/images/about/ธนพร  ภูเลื่อน .jpg", name: "นางสาวธนพร  ภูเลื่อน" },
  {
    src: "/images/about/ธนัททิพย์     ศิริชัยวัฒนกุล_.png",
    name: "นางสาวธนัททิพย์  ศิริชัยวัฒนกุล",
  },
  {
    src: "/images/about/ธัญญ์รวี_  รัฐรวีศิรไกร _.jpg",
    name: "นางสาวธัญญ์รวี  รัฐรวีศิรไกร",
  },
  { src: "/images/about/ธันยพร วาสนาม_.jpg", name: "นางสาวธันยพร  วาสนาม" },
  {
    src: "/images/about/ประพิมพ์พลอย ทองภูธรณ์.jpg",
    name: "นางสาวประพิมพ์พลอย  ทองภูธรณ์",
  },
  {
    src: "/images/about/อรสิณี   เสนานิมิตร .jpg",
    name: "นางสาวอรสิณี  เสนานิมิต",
  },
];

const advisor = [
  { src: "/images/about/รศ.ดร.วิจิตรา เสนา.png", name: "รศ.ดร.วิจิตรา  เสนา" },
  { src: "/images/about/ผศ.ดร.นิศาชล บุบผา.png", name: "ผศ.ดร.นิศาชล  บุบผา" },
  {
    src: "/images/about/ผศ.ดร.กิตติภูมิ ภิญโย.png",
    name: "ผศ.ดร.กิตติภูมิ  ภิญโย",
  },
];

export default function AboutPage() {
  return (
    <Container
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          position: "fixed",
          left: "30px",
          // transform: "translateY(-50%)",
        }}
      >
        <NavBar />
      </Box>
      <Card
        sx={{
          maxWidth: 900,
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
          backgroundColor: "#fdfdfd",
        }}
      >
        <CardContent>
          {/* หัวข้อหลัก */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
          >
            About Us
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* ใช้ Stack จัด spacing ระหว่างบล็อกข้อความ */}
          <Stack spacing={2}>
            {/* ส่วน: เกี่ยวกับนวัตกรรม */}
            <Typography variant="h6" component="h2">
              เกี่ยวกับนวัตกรรม Vital Village Vitality
            </Typography>
            <Typography variant="body1" paragraph>
              Community health assessment learning system “Vital Village
              Vitality : Community health assessment learning system”
              นวัตกรรมจำลองสถานการณ์เสมือนจริงสำหรับนักศึกษาพยาบาล
              เพื่อเตรียมความพร้อมในการประเมินสุขภาพชุมชนก่อนปฏิบัติงานจริง
              เน้นการเรียนรู้แบบลงมือทำผ่านแผนที่หมู่บ้านจำลอง ศาลากลางบ้าน
              และจุดมาร์กการเรียนรู้ต่าง ๆ
              ช่วยให้นักศึกษาเข้าใจปัจจัยด้านสุขภาพชุมชนอย่างรอบด้าน
              วิเคราะห์ข้อมูล ระบุปัญหา
              และจัดลำดับความสำคัญได้อย่างมีประสิทธิภาพ
              มีแบบทดสอบวัดผลก่อนและหลังเรียนรู้ เพื่อประเมินความเข้าใจ
              และพัฒนาทักษะอย่างต่อเนื่อง
              นวัตกรรมนี้มีศักยภาพในการต่อยอดสู่การใช้งานจริงในภาคสนาม
              หน่วยงานสาธารณสุข และชุมชน
              เพื่อส่งเสริมสุขภาพและคุณภาพชีวิตของประชาชนอย่างยั่งยืน
            </Typography>
            <Divider />

            {/* ส่วน: อาจารย์ที่ปรึกษาโครงงาน */}
            <Typography variant="h6" component="h2">
              อาจารย์ที่ปรึกษาโครงงาน
            </Typography>
            <Typography variant="body1" paragraph>
              อาจารย์สาขาวิชาการพยาบาลครอบครัวและชุมชน คณะพยาบาลศาสตร์
              มหาวิทยาลัยขอนแก่น
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {advisor.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "fit-content",
                  }}
                >
                  <Box
                    component="img"
                    src={item.src}
                    alt={item.name}
                    sx={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      mb: 1,
                    }}
                  />
                  {item.name}
                </Box>
              ))}
            </Box>
            <Divider />

            {/* ส่วน: รายวิชา */}
            <Typography variant="h6" component="h2">
              รายวิชา
            </Typography>
            <Typography variant="body1" paragraph>
              นวัตกรรมนี้เป็นส่วนหนึ่งของรายวิชา NU113 310
              โครงงานนวัตกรรมทางการพยาบาล (Health Innovation Project) ปีการศึกษา
              2567 คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น
            </Typography>

            <Divider />

            {/* ส่วน: สมาชิก */}
            <Typography variant="h6" component="h2" textAlign={"center"}>
              สมาชิก
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {team.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "fit-content",
                  }}
                >
                  <Box
                    component="img"
                    src={item.src}
                    alt={item.name}
                    sx={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      mb: 1,
                    }}
                  />
                  {item.name}
                </Box>
              ))}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
