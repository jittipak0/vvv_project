import React, { useState } from "react";
import { IconButton, Box, Drawer, List, ListItem, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccordionItem from "./AccordionItem";
import { useAuth } from "@/hooks/useAuth";

const NavDrawer: React.FC = () => {
  const { role, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Box>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon
          sx={{
            color: "#fff",
            fontSize: "25px",
            filter: "drop-shadow(2px 4px 2px rgba(0, 0, 0, 1))",
          }}
        />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem>
              <Link href="/" passHref>
                Home
              </Link>
            </ListItem>
            {(role === "admin" || role === "teacher") && (
              <ListItem>
                <Link href="/admin" passHref>
                  Dashboard
                </Link>
              </ListItem>
            )}

            {/*  แสดง Accordion ของหมวดหลัก */}
            {/* <AccordionItem
              title="เนื้อหาการเรียนรู้"
              links={[
                { label: "- ทุนทางสังคม", path: "/review/social-capital" },
                {
                  label: "- ศักยภาพชุมชน 5 มิติ",
                  path: "/review/community-potential",
                },
                {
                  label:
                    "- การวิเคราะห์ นำเสนอ ระบุและจัดลำดับปัญหาและความต้องการ",
                  path: "/review/learning-options",
                },
              ]}
            /> */}

            <AccordionItem
              title="ทบทวน Video"
              links={[
                {
                  label: "- ความหมายการประเมินชุมชน",
                  path: "/review/community-hall",
                },
                {
                  label: "- ทุนทางสังคม 6 ระดับ",
                  path: "/review/social-capital",
                },
                {
                  label: "- RECAP",
                  path: "/review/social-capital",
                },
                {
                  label: "- TCNAP",
                  path: "/review/community-potential",
                },
                {
                  label: "- ศักยภาพชุมชนด้านสุขภาพ",
                  path: "/learning/health/forum",
                },
                {
                  label: "- ศักยภาพชุมชนด้านสังคมและวัฒนธรรม",
                  path: "/learning/society/forum",
                },
                {
                  label: "- ศักยภาพชุมชนด้านสิ่งแวดล้อม",
                  path: "/learning/environment/forum",
                },
                {
                  label: "- ศักยภาพชุมชนด้านเศรษฐกิจ",
                  path: "/learning/economy/forum",
                },
                {
                  label: "- ศักยภาพชุมชนด้านการเมืองการปกครอง",
                  path: "/learning/politics/forum",
                },

                {
                  label: "- วิเคราะห์และนำเสนอข้อมูล",
                  path: "/review/learning-options",
                },
                {
                  label: "- การระบุปัญหาและความต้องการ",
                  path: "/review/learning-options",
                },
                {
                  label: "- การจัดลำดับปัญหาและความต้องการ",
                  path: "/review/learning-options",
                },
              ]}
            ></AccordionItem>

            {role === "admin" && (
              <AccordionItem
                title="Admin Menu"
                links={[
                  {
                    label: "สร้าง Admin/Teacher",
                    path: "/admin/add-admin",
                  },
                  {
                    label: "แก้ไขลิงค์แบบประเมิน",
                    path: "/admin/edit-content?labelpage=satisfaction-survey",
                  },
                ]}
              >
                <AccordionItem
                  title="แก้ไข Test"
                  links={[
                    { label: "Edit Pre-test", path: "/admin/edit-pre-test" },
                    { label: "Edit Post-test", path: "/admin/edit-post-test" },
                  ]}
                />
                <AccordionItem
                  title="แก้ไขคอนเทนต์"
                  links={[
                    {
                      label: "- ความหมายการประเมินชุมชน",
                      path: "/admin/edit-content?labelpage=community-hall",
                    },
                    {
                      label: "- ทุนทางสังคม 6 ระดับ \n - RECAP",
                      path: "/admin/edit-content?labelpage=social-capital",
                    },
                    {
                      label: "- TCNAP",
                      path: "/admin/edit-content?labelpage=community-potential",
                    },
                    {
                      label:
                        "- การวิเคราะห์ นำเสนอ ระบุและจัดลำดับปัญหาและความต้องการ",
                      path: "/admin/edit-content?labelpage=learning-options",
                    },
                  ]}
                >
                  <AccordionItem
                    title="ด้านสุขภาพ"
                    links={[
                      {
                        label: "- อธิบายเนื้อหาสาระสำคัญ",
                        path: "/admin/edit-content?title=ด้านสุขภาพ&label=อธิบายเนื้อหาสาระสำคัญ&labelpage=health-forum",
                      },
                      {
                        label: "- ข้อมูลศักยภาพชุมชน",
                        path: "/admin/edit-content?title=ด้านสุขภาพ&label=ข้อมูลศักยภาพชุมชน&labelpage=health-assessment-tool",
                      },
                      {
                        label: "- การเลือกรูปแบบการนำเสนอข้อมูล",
                        path: "/admin/edit-content?title=ด้านสุขภาพ&label=การเลือกรูปแบบการนำเสนอข้อมูล&labelpage=health-data-visualization",
                      },
                      {
                        label: "- Quiz",
                        path: "/admin/edit-content?title=ด้านสุขภาพ&label=Quiz&labelpage=health-quiz",
                      },
                    ]}
                  />

                  <AccordionItem
                    title="ด้านสังคมและวัฒนธรรม"
                    links={[
                      {
                        label: "- อธิบายเนื้อหาสาระสำคัญ",
                        path: "/admin/edit-content?title=ด้านสังคมและวัฒนธรรม&label=อธิบายเนื้อหาสาระสำคัญ&labelpage=society-forum",
                      },
                      {
                        label: "- ข้อมูลศักยภาพชุมชน",
                        path: "/admin/edit-content?title=ด้านสังคมและวัฒนธรรม&label=ข้อมูลศักยภาพชุมชน&labelpage=society-assessment-tool",
                      },
                      {
                        label: "- การเลือกรูปแบบการนำเสนอข้อมูล",
                        path: "/admin/edit-content?title=ด้านสังคมและวัฒนธรรม&label=การเลือกรูปแบบการนำเสนอข้อมูล&labelpage=society-data-visualization",
                      },
                      {
                        label: "- Quiz",
                        path: "/admin/edit-content?title=ด้านสังคมและวัฒนธรรม&label=Quiz&labelpage=society-quiz",
                      },
                    ]}
                  />

                  <AccordionItem
                    title="ด้านการเมืองการปกครอง"
                    links={[
                      {
                        label: "- อธิบายเนื้อหาสาระสำคัญ",
                        path: "/admin/edit-content?title=ด้านการเมืองการปกครอง&label=อธิบายเนื้อหาสาระสำคัญ&labelpage=politics-forum",
                      },
                      {
                        label: "- ข้อมูลศักยภาพชุมชน",
                        path: "/admin/edit-content?title=ด้านการเมืองการปกครอง&label=ข้อมูลศักยภาพชุมชน&labelpage=politics-assessment-tool",
                      },
                      {
                        label: "- การเลือกรูปแบบการนำเสนอข้อมูล",
                        path: "/admin/edit-content?title=ด้านการเมืองการปกครอง&label=การเลือกรูปแบบการนำเสนอข้อมูล&labelpage=politics-data-visualization",
                      },
                      {
                        label: "- Quiz",
                        path: "/admin/edit-content?title=ด้านการเมืองการปกครอง&label=Quiz&labelpage=politics-quiz",
                      },
                    ]}
                  />

                  <AccordionItem
                    title="ด้านเศรษฐกิจ"
                    links={[
                      {
                        label: "- อธิบายเนื้อหาสาระสำคัญ",
                        path: "/admin/edit-content?title=ด้านเศรษฐกิจ&label=อธิบายเนื้อหาสาระสำคัญ&labelpage=economy-forum",
                      },
                      {
                        label: "- ข้อมูลศักยภาพชุมชน",
                        path: "/admin/edit-content?title=ด้านเศรษฐกิจ&label=ข้อมูลศักยภาพชุมชน&labelpage=economy-assessment-tool",
                      },
                      {
                        label: "- การเลือกรูปแบบการนำเสนอข้อมูล",
                        path: "/admin/edit-content?title=ด้านเศรษฐกิจ&label=การเลือกรูปแบบการนำเสนอข้อมูล&labelpage=economy-data-visualization",
                      },
                      {
                        label: "- Quiz",
                        path: "/admin/edit-content?title=ด้านเศรษฐกิจ&label=Quiz&labelpage=economy-quiz",
                      },
                    ]}
                  />

                  <AccordionItem
                    title="ด้านสิ่งแวดล้อม"
                    links={[
                      {
                        label: "- อธิบายเนื้อหาสาระสำคัญ",
                        path: "/admin/edit-content?title=ด้านสิ่งแวดล้อม&label=อธิบายเนื้อหาสาระสำคัญ&labelpage=environment-forum",
                      },
                      {
                        label: "- ข้อมูลศักยภาพชุมชน",
                        path: "/admin/edit-content?title=ด้านสิ่งแวดล้อม&label=ข้อมูลศักยภาพชุมชน&labelpage=environment-assessment-tool",
                      },
                      {
                        label: "- การเลือกรูปแบบการนำเสนอข้อมูล",
                        path: "/admin/edit-content?title=ด้านสิ่งแวดล้อม&label=การเลือกรูปแบบการนำเสนอข้อมูล&labelpage=environment-data-visualization",
                      },
                      {
                        label: "- Quiz",
                        path: "/admin/edit-content?title=ด้านสิ่งแวดล้อม&label=Quiz&labelpage=environment-quiz",
                      },
                    ]}
                  />
                </AccordionItem>
              </AccordionItem>
            )}

            <ListItem>
              <Link href="/about" passHref>
                About
              </Link>
            </ListItem>

            {/* ปุ่ม Logout */}
            <ListItem>
              <Button
                variant="text"
                color="error"
                onClick={handleLogout}
                fullWidth
                sx={{ textAlign: "left", border: "1px solid red", mt: "15px" }}
              >
                Logout
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavDrawer;
