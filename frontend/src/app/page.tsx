"use client";
import { Box, List, ListItem } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Tutorial from "@/components/Tutorial";
import MiniMap from "@/components/MiniMap";
import { useTutorialTracking } from "@/hooks/tutorialTracking";
import { useRouter } from "next/navigation";

const listContent = [
  {
    title: "ศาลากลางบ้าน",
    titleLeft: 766,
    titleTop: 570,
    elementBoxLeft: 760,
    elementBoxTop: 425,
    elementBoxWidth: 150,
    elementBoxHeight: 150,
    detail: ["จุดเรียนรู้"],
  },
  {
    title: "ร้านค้า",
    titleLeft: 1050,
    titleTop: 503,
    elementBoxLeft: 990,
    elementBoxTop: 490,
    elementBoxWidth: 130,
    elementBoxHeight: 57,
    detail: [
      "สินค้าเกี่ยวกับสุขภาพ เช่น สุรา บุหรี่ ยาชุด",
      "คุณภาพของอาหาร",
      "สินค้าเพื่อสุขภาพ",
      "ความสะอาด",
      "สินค้าหมดอายุ",
    ],
  },
  {
    title: "โรงเรียน",
    titleLeft: 1050,
    titleTop: 593,
    elementBoxLeft: 985,
    elementBoxTop: 562,
    elementBoxWidth: 213,
    elementBoxHeight: 120,
    detail: [
      "ข้อมูลสุขภาพเด็ก",
      "จำนวนเด็กนักเรียน",
      "ห้องน้ำ ห้องพยาบาล",
      "โรงอาหาร",
      "สนามเด็กเล่น และคุณภาพของเครื่องเล่น",
      "สิ่งแวดล้อม (ขยะ น้ำเสีย จุดเสี่ยง)",
      "ข้อมูลการควบคุมโรคในโรงเรียน",
    ],
  },
  {
    title: "กลุ่มเกษตรอินทรีย์",
    titleLeft: 1210,
    titleTop: 553,
    elementBoxLeft: 1235,
    elementBoxTop: 569,
    elementBoxWidth: 100,
    elementBoxHeight: 95,
    detail: [
      "กระบวนการผลิต วัตถุดิบอินทรีย์ที่ใช้",
      "โรคจากการเกษตร เช่น โรคฉี่หนู",
      "การใช้สารเคมีทดเเทน",
      "แหล่งจำหน่าย",
    ],
  },
  {
    title: "วัด",
    titleLeft: 1200,
    titleTop: 300,
    elementBoxLeft: 1080,
    elementBoxTop: 295,
    elementBoxWidth: 255,
    elementBoxHeight: 120,
    detail: [
      "ศูนย์กลางของกิจกรรมทางศาสนา ประเพณี วัฒนธรรมของชุมชน",
      "ความเชื่อ",
      "ทุนทางสังคม เช่น ผู้นำทางศาสนา เจ้าอาวาส/พระครู ปราชญ์ชาวบ้าน กลุ่มสตรี",
    ],
  },
  {
    title: "บ้านผู้ใหญ่บ้าน",
    titleLeft: 875,
    titleTop: 284,
    elementBoxLeft: 880,
    elementBoxTop: 315,
    elementBoxWidth: 109,
    elementBoxHeight: 100,
    detail: [
      "กฎกติกาหมู่บ้าน/ชุมชน",
      "หอกระจายข่าว",
      "ข้อมูลการเกิด-ตาย",
      "ข้อมูลการทะเลาะวิวาท",
      "ข้อมูลผู้ใช้สิทธิเลือกตั้ง",
      "ทุนทางสังคม เช่น ผู้นำชุมชน คณะกรรมการหมู่บ้าน",
    ],
  },
  {
    title: "ศูนย์พัฒนาเด็กเล็ก",
    label: "ศพด.",
    titleLeft: 824,
    titleTop: 225,
    elementBoxLeft: 810,
    elementBoxTop: 120,
    elementBoxWidth: 78,
    elementBoxHeight: 110,
    detail: [
      "จำนวนเด็ก (กลุ่มปกติ เสี่ยง ป่วย)",
      "ข้อมูลสุขภาพ",
      "ข้อมูลพัฒนาการและการเจริญเติบโต",
      "มาตรการป้องกันโรค",
      "โภชนาการ",
      "ตรวจสุขภาพประจำปี",
    ],
  },
  {
    title: "โรงเรียนผู้สูงอายุ",
    titleLeft: 460,
    titleTop: 150,
    elementBoxLeft: 500,
    elementBoxTop: 171,
    elementBoxWidth: 134,
    elementBoxHeight: 106,
    detail: [
      "ส่งเสริมการเรียนรู้และพัฒนาคุณภาพชีวิต เช่น กิจกรรมกลุ่ม",
      "จำนวนผู้เข้าร่วมกิจกรรม",
    ],
  },
  {
    title: "โรงพยาบาลส่งเสริมสุขภาพตำบล",
    label: "รพ.สต.",
    titleLeft: 682,
    titleTop: 165,
    elementBoxLeft: 605,
    elementBoxTop: 82,
    elementBoxWidth: 137,
    elementBoxHeight: 78,
    detail: [
      "ข้อมูลสุขภาพในแต่ละกลุ่มวัย",
      "ข้อมูล 10 อันดับโรคแรก",
      "ข้อมูลโรค NCDs",
      "ข้อมูลส่งเสริมสุขภาพแต่ละกลุ่มวัย",
      "ข้อมูลการป้องกันโรค",
      "ข้อมูลบุคลากรและบริการ",
    ],
  },
  {
    title: "ตลาด",
    titleLeft: 850,
    titleTop: 780,
    elementBoxLeft: 750,
    elementBoxTop: 740,
    elementBoxWidth: 94,
    elementBoxHeight: 102,
    detail: [
      "ความสะอาดของตลาด ร้านค้า และผู้ประกอบการ",
      "การจัดการขยะ",
      "ระบบระบายน้ำ",
      "การปนเปื้อนของอาหาร",
      "อาหารชุมชน อาหารพื้นบ้าน",
    ],
  },
  {
    title: "บ้าน อสม.",
    titleLeft: 557,
    titleTop: 450,
    elementBoxLeft: 535,
    elementBoxTop: 484,
    elementBoxWidth: 140,
    elementBoxHeight: 80,
    detail: [
      "ทุนทางสังคม เช่น อสม. CG",
      "ข้อมูลสุขภาพคนในชุมชน",
      "ข้อมูลโครงการ กิจกรรมด้านสุขภาพ",
      "บทบาทหน้าที่ ศักยภาพของ อสม. CG",
    ],
  },
  {
    title: "กลุ่มอาชีพ",
    titleLeft: 905,
    titleTop: 100,
    elementBoxLeft: 905,
    elementBoxTop: 100,
    elementBoxWidth: 140,
    elementBoxHeight: 140,
    detail: [
      "ทุนทางสังคม เช่น ปราชญ์ชาวบ้าน, กลุ่มจักสาน, กลุ่มทอผ้า, กลุ่ม OTOP",
      "สุขภาพของสมาชิก เช่น โรคทางเดินหายใจ ปวดกล้ามเนื้อ กระดูก",
      "สภาพแวดล้อมการทำงาน เช่น แสง การระบายอากาศ ท่าทาง",
    ],
  },
  {
    title: "กลุ่มออมทรัพย์ชุมชน",
    titleLeft: 328,
    titleTop: 685,
    elementBoxLeft: 378,
    elementBoxTop: 610,
    elementBoxWidth: 72,
    elementBoxHeight: 72,
    detail: ["เงินทุนหมุนเวียน", "เงินออม หนี้สิน", "กองทุนเงินล้าน"],
  },
  {
    title: "ธนาคารขยะ",
    titleLeft: 328,
    titleTop: 315,
    elementBoxLeft: 318,
    elementBoxTop: 345,
    elementBoxWidth: 116,
    elementBoxHeight: 57,
    detail: [
      "วิธีการจัดการขยะ การคัดแยก การจำหน่าย",
      "พื้นที่จัดเก็บ",
      "สมาชิกกลุ่มธนาคารขยะ",
    ],
  },
  {
    title: "ลานออกกำลังกาย",
    titleLeft: 516,
    titleTop: 660,
    elementBoxLeft: 530,
    elementBoxTop: 578,
    elementBoxWidth: 123,
    elementBoxHeight: 120,
    detail: ["อุปกรณ์", "กลุ่มกิจกรรมออกกำลังกาย", "ความปลอดภัย"],
  },
  {
    title: "ป่าชุมชน",
    titleLeft: 1320,
    titleTop: 160,
    elementBoxLeft: 1220,
    elementBoxTop: 40,
    elementBoxWidth: 350,
    elementBoxHeight: 240,
    detail: [
      "แหล่งชุกชุมของพาหะนำโรค/สัตว์มีพิษ",
      "แหล่งอาหาร",
      "สมุนไพรท้องถิ่น",
      "แหล่งมั่วสุม",
      "กลุ่มอนุรักษ์ป่าชุมชน",
      "กฎ กติกาชุมชน",
    ],
  },
  {
    title: "จุดเสี่ยง",
    titleLeft: 1100,
    titleTop: 125,
    elementBoxLeft: 1055,
    elementBoxTop: 125,
    elementBoxWidth: 130,
    elementBoxHeight: 135,
    detail: [
      "แหล่งมั่วสุม",
      "ความสว่าง",
      "ความปลอดภัย",
      "เสียงอันตราย - โรคกรรม",
    ],
  },
  {
    title: "หนองน้ำ",
    titleLeft: 400,
    titleTop: 550,
    elementBoxLeft: 370,
    elementBoxTop: 460,
    elementBoxWidth: 160,
    elementBoxHeight: 120,
    detail: [
      "คุณภาพน้ำ/ มลพิษทางน้ำ",
      "การใช้น้ำ",
      "แหล่งอาหาร",
      "กฎกติกาชุมชนเกี่ยวกับการใช้น้ำ",
    ],
  },
  {
    title: "องค์กรปกครองส่วนท้องถิ่น",
    label: "อปท.",
    titleLeft: 610,
    titleTop: 340,
    elementBoxLeft: 578,
    elementBoxTop: 300,
    elementBoxWidth: 130,
    elementBoxHeight: 110,
    detail: [
      "ข้อมูลกลุ่มเปราะบาง",
      "ข้อมูลประชากร",
      "คนไปใช้สิทธิ์",
      "ทะเบียนราษฎร์",
      "ทุนทางสังคม - กำนัน นายกเทศบาล อปท.",
    ],
  },
  {
    title: "ศาลปู่ตา",
    titleLeft: 736,
    titleTop: 610,
    elementBoxLeft: 736,
    elementBoxTop: 610,
    elementBoxWidth: 72,
    elementBoxHeight: 72,
    detail: ["ความเชื่อ", "ศูนย์รวมจิตใจ", "กิจกรรมประจำปี"],
  },
];

export default function HomePage() {
  const tutorialState = "tt1";
  const tutorial = useTutorialTracking(tutorialState);
  const [tutorialClose, setTutorialClose] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  const router = useRouter();

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isTouchDevice) {
        setCursorPosition({ x: event.clientX, y: event.clientY });
      }
    },
    [isTouchDevice]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice(!("onmousemove" in window));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // ขนาดภาพต้นฉบับ
  const originalWidth = 1600;
  const originalHeight = 900;

  const [showContent, setShowContent] = useState("");
  const [clicked, setClicked] = useState(false);

  const imgSize = () => {
    let imgWidth;
    if (originalWidth > originalHeight) {
      const originalRatio = originalWidth / originalHeight;

      if (screenSize.height * originalRatio < screenSize.width) {
        imgWidth = screenSize.width;
      } else {
        imgWidth = screenSize.height * originalRatio;
      }
    } else {
      const originalRatio = originalHeight / originalWidth;
      if (screenSize.width < screenSize.height) {
        imgWidth = screenSize.width;
      } else {
        imgWidth = screenSize.height * originalRatio;
      }
    }
    return imgWidth;
  };

  // ฟังก์ชัน calculatePosition
  const calculatePosition = (originalTop: number, originalLeft: number) => {
    const imgWidth = imgSize();
    if (!originalWidth || !imgWidth) return { top: "0px", left: "0px" };

    const ratio = imgWidth / originalWidth;
    const left = originalLeft * ratio - (imgWidth - screenSize.width) / 2 || 0;
    const top = originalTop * ratio || 0;

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  const calculateSize = (boxWidth: number, boxHeight: number) => {
    const imgWidth = imgSize();
    if (!originalWidth || !imgWidth) return { width: "0px", height: "0px" };

    const ratio = imgWidth / originalWidth;
    const width = boxWidth * ratio || 0;
    const height = boxHeight * ratio || 0;

    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", m: "25px", zIndex: 10 }}>
        <MiniMap hideNevIcon img="/images/logo.webp" />
      </Box>

      {listContent.map((content, index) => {
        const titlePosition = calculatePosition(
          content.titleTop,
          content.titleLeft
        );
        const contentBoxPosition = calculatePosition(
          content.elementBoxTop,
          content.elementBoxLeft
        );
        const contentBoxSize = calculateSize(
          content.elementBoxWidth,
          content.elementBoxHeight
        );

        const showContentWidth = 250;
        const showContentHeight = 250;

        let adjustedLeft, adjustedTop;

        if (!isTouchDevice) {
          // สำหรับอุปกรณ์ที่มี cursor
          const { x, y } = cursorPosition;
          adjustedLeft = x;
          adjustedTop = y;

          if (y + showContentHeight + 10 < window.innerHeight) {
            adjustedTop += 10; // แสดงด้านล่าง cursor
          } else if (y + showContentHeight * 2 + 10 > window.innerHeight) {
            adjustedTop -= showContentHeight + 10; // แสดงด้านบน cursor
          }
          if (x + showContentWidth + 10 < window.innerWidth) {
            adjustedLeft += 10; // แสดงด้านขวา cursor
          } else if (x - showContentWidth - 10 > 0) {
            adjustedLeft -= showContentWidth + 10; // แสดงด้านซ้าย cursor
          }
        } else {
          // สำหรับอุปกรณ์ที่ไม่มี cursor
          adjustedLeft = parseFloat(titlePosition.left);
          adjustedTop = parseFloat(titlePosition.top);

          if (cursorPosition.y + showContentHeight + 10 < screenSize.height) {
            adjustedTop += 10;
          } else if (
            cursorPosition.y + showContentHeight * 2 + 10 >
            screenSize.height
          ) {
            adjustedTop -= showContentHeight + 10;
          }

          if (cursorPosition.x + showContentWidth + 10 < screenSize.width) {
            adjustedLeft += 10;
          } else if (
            cursorPosition.x + showContentWidth * 2 + 10 >
            screenSize.width
          ) {
            adjustedLeft -= showContentWidth + 10;
          }
        }
        const imgWidth = imgSize();

        return (
          <Box key={index} sx={{ position: "relative" }}>
            {/* Title */}
            <Box
              sx={{
                bgcolor: "#fff",
                pl: 0.7,
                pr: 0.7,
                borderRadius: "7px",
                fontSize: `${imgWidth / 90}px`,
                position: "absolute",
                display: "flex",
                minWidth: "fit-content",
                ...titlePosition,
              }}
              onClick={() => {
                if (content.title === "ศาลากลางบ้าน") {
                  setShowContent("");
                  setClicked(false);
                  router.push("/review/community-hall");
                } else {
                  setClicked(!clicked);
                  if (!clicked) {
                    setShowContent(content.title);
                  }
                }
              }}
              onMouseEnter={() => setShowContent(content.title)}
              onMouseLeave={() => setShowContent("")}
            >
              {content.label || content.title}
            </Box>

            {/* กล่อง Hover */}
            <Box
              sx={{
                position: "absolute",
                ...contentBoxPosition,
                ...contentBoxSize,
              }}
              onClick={() => {
                if (content.title === "ศาลากลางบ้าน") {
                  setShowContent("");
                  setClicked(false);
                  router.push("/review/community-hall");
                } else {
                  setClicked(!clicked);
                  if (!clicked) {
                    setShowContent(content.title);
                  }
                }
              }}
              onMouseEnter={() => setShowContent(content.title)}
              onMouseLeave={() => setShowContent("")}
            />

            {/* Show Content */}
            {showContent === content.title && (
              <Box
                sx={{
                  position: "absolute",
                  top: `${adjustedTop}px`,
                  left: `${adjustedLeft}px`,
                  bgcolor: "white",
                  p: 3,
                  borderRadius: "15px",
                  boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 9,
                }}
              >
                <Box
                  sx={{
                    // fontSize: "1.5rem",
                    fontSize: `${imgWidth / 90}px`,
                    border: "4px solid #f57b1f",
                    width: "fit-content",
                    pl: 0.7,
                    pr: 0.7,
                    borderRadius: "15px",
                  }}
                >
                  {content.title}
                </Box>
                <List>
                  {content.detail.map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{ fontSize: `${imgWidth / 95}px` }}
                    >
                      • {item}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        );
      })}

      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundImage: `url('/images/map.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      />

      {tutorial && !tutorialClose && (
        <Box>
          <Box sx={{ zIndex: 2 }}>
            <Tutorial
              text={[
                <>
                  ยินดีต้อนรับเข้าสู่{" "}
                  <strong style={{ color: "#0075ff" }}>
                    Vital Village Vitality
                  </strong>{" "}
                  ชุมชนหมู่บ้านแสนสุขของเราค่ะ
                  เว็บไซต์นี้จะพานักศึกษาไปเรียนรู้เกี่ยวกับการ{" "}
                  <strong style={{ color: "#00a79d" }}>
                    ประเมินสุขภาพชุมชน
                  </strong>{" "}
                  อันได้แก่ ข้อมูล
                  <strong style={{ color: "#00a79d" }}>ศักยภาพและสถานะ</strong>
                  ที่บ่งบอกความสามารถของชุมชน{" "}
                  <strong style={{ color: "#00a79d" }}>ทุนทางสังคม</strong>
                  ที่มีส่วนช่วยในการพัฒนาและแก้ไขปัญหาของชุมชน ตัวช่วย
                  <strong style={{ color: "#00a79d" }}>
                    แนวทางการรวบรวมข้อมูล
                  </strong>
                  และการนำข้อมูลที่ได้มา{" "}
                  <strong style={{ color: "#00a79d" }}>
                    สรุปหาปัญหาและความต้องการ
                  </strong>
                  ร่วมกับคนในชุมชน ก่อนนำสู่การจัดโครงการเพื่อพัฒนาชุมชนในอนาคต
                </>,
                <>
                  วันนี้พี่พยาบาลจะพานักศึกษามาเริ่มต้นการใช้งานเว็บไซต์เพื่อเก็บข้อมูลที่จำเป็นในการประเมินชุมชนนะคะ
                  จากแผนที่หมู่บ้าน
                  น้องนักศึกษาเคยสังเกตบ้างหรือไม่คะว่าเราจะสามารถเก็บข้อมูลอะไรได้บ้างจากสถานที่ต่างๆ
                  ในหมู่บ้าน
                  พี่แอบใบ้ว่าให้น้องนักศึกษาลองคลิกเข้าไปดูในสถานที่ต่างๆ นะคะ
                  ^^ หากพร้อมแล้วก็ไปพบพี่ที่{" "}
                  <strong style={{ color: "#00a79d" }}>ศาลากลางบ้าน </strong>
                  เพื่อเริ่มต้นการเรียนรู้นะคะ
                </>,
                <>
                  ในขณะที่กำลังเรียนรู้
                  น้องนักศึกษาสามารถดูระดับความคืบหน้าของตนเองได้จาก{" "}
                  <strong style={{ color: "#00a79d" }}>
                    แถบเปอร์เซ็นรอบวงกลม
                  </strong>
                  มุมซ้ายบน และกลับมาทบทวนเนื้อหาได้ตลอดเวลาจาก{" "}
                  <strong style={{ color: "#00a79d" }}>ศาลากลางบ้าน </strong>
                  หรือที่{" "}
                  <strong style={{ color: "#00a79d" }}>Main Menu </strong>
                  หรือแถว 3 ขีดมุมซ้ายบนเช่นเดียวกันนะคะ
                </>,
              ]}
              tutorialState={tutorialState}
              onClose={() => setTutorialClose(true)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
