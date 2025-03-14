"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";
import NavBar from "@/components/NavBar";
import { getUserByRole } from "@/services/endpoint/user";
import EditUserPopup from "@/components/EditUserPopup";
import { User } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";

// **Register Scales และ Components ที่ใช้**
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TeacherDashboard = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { role } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await getUserByRole("student");
      setStudents(data);
      setFilteredStudents(data);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    setFilteredStudents(
      students.filter(
        (student) =>
          student.fname.includes(search) ||
          student.lname.includes(search) ||
          student.email.includes(search) ||
          (student.student_id !== undefined &&
            student.student_id !== null &&
            student.student_id.toString().includes(search)) ||
          (student.adviser !== undefined &&
            student.adviser !== null &&
            student.adviser.toString().includes(search))
      )
    );
  }, [search, students]);

  const avgPreTest = Math.round(
    students.reduce((sum, s) => sum + (s.pre_test_score ?? 0), 0) /
      students.length
  );

  const avgPostTest = Math.round(
    students.reduce((sum, s) => sum + (s.post_test_score ?? 0), 0) /
      students.length
  );

  const avgHighestPostTest = Math.round(
    students.reduce((sum, s) => sum + (s.highest_post_test_score ?? 0), 0) /
      students.length
  );

  const preTestDoneCount = Math.round(
    (students.filter((s) => s.pre_test_date !== null).length /
      students.length) *
      100
  );

  const postTestDoneCount = Math.round(
    (students.filter((s) => s.post_test_date !== null).length /
      students.length) *
      100
  );

  const completedCount = students.filter((s) => s.total_progress >= 100).length;

  // Pie Chart: เปรียบเทียบความก้าวหน้าของนักเรียน
  const total_total_progressData = {
    labels: ["นักเรียนที่เรียนครบ 100%"],
    datasets: [
      {
        data: [completedCount, students.length - completedCount],

        backgroundColor: ["#36A2EB", "#f5f5f5"],
      },
    ],
  };

  // คำนวณค่าสูงสุดของข้อมูลและเพิ่ม buffer
  const maxDataValue = Math.max(avgPreTest, avgPostTest, avgHighestPostTest);
  const yAxisMax = maxDataValue + 10; // เพิ่มจากค่าสูงสุดอีก 10%

  // ปิดการแสดง Legend และ Grid
  const testScoreOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true, // ทำให้แกน Y เริ่มที่ 0
        suggestedMax: yAxisMax,
      },
    },
  };

  // Bar Chart: ค่าเฉลี่ย Pre-test / Post-test
  const testScoreData = {
    labels: ["Pre-test", "First time post-test", "Highest post-test score"],
    datasets: [
      {
        label: "",
        data: [avgPreTest, avgPostTest, avgHighestPostTest],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <NavBar />
        <Typography variant="h4">📊 Teacher Dashboard</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/*  ข้อมูลภาพรวม */}
        <Paper
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            justifyContent: "space-evenly",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box fontSize={"1.2rem"}>👨‍🎓 นักเรียนทั้งหมด: {students.length}</Box>{" "}
          <hr />
          <Box fontSize={"1.2rem"}>
            📊 ทำ Pre-test แล้ว : {preTestDoneCount}%
          </Box>
          <hr />
          <Box fontSize={"1.2rem"}>
            📊 ทำ Post-test แล้ว : {postTestDoneCount}%
          </Box>
        </Paper>

        {/*  กราฟแสดงผล */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Paper sx={{ p: 4, width: { md: "65%", xs: "auto" } }}>
            <Box sx={{ fontSize: "1.3rem" }}>
              📊 คะแนน Pre-test/Post-test เฉลี่ย
            </Box>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ height: "auto" }}>
                <Bar data={testScoreData} options={testScoreOptions} />
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 4, width: { md: "35%", xs: "auto" } }}>
            <Typography variant="h6" align="center">
              🎯 ความคืบหน้า
            </Typography>
            <Doughnut data={total_total_progressData} />
          </Paper>
        </Box>

        <Paper sx={{ p: 4 }}>
          {/*  ช่องค้นหา */}
          <TextField
            label="🔍 ค้นหานักเรียน"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/*  ตารางนักเรียน */}
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredStudents}
              columns={[
                {
                  field: "id",
                  headerName: "ลำดับ",
                  width: 60,
                  headerAlign: "center",
                  align: "center",
                },
                {
                  field: "total_progress",
                  headerName: "ความคืบหน้า (%)",
                  width: 116,
                  renderCell: (params) => (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor:
                            params.value === 100
                              ? "#4CAF50"
                              : params.value > 50
                              ? "#FFCE56"
                              : "#FF6384",
                          height: "20px",
                          borderRadius: "5px",
                          transition: "width 0.5s",
                          width: `${params.value}%`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px" }}>
                          {params.value}%
                        </Typography>
                      </Box>
                    </Box>
                  ),
                },
                {
                  field: "section",
                  headerName: "Sec.",
                  // maxWidth: 120,
                  align: "center",
                },
                {
                  field: "fname",
                  headerName: "ชื่อ",
                  minWidth: 100,
                  flex: 1,
                },
                {
                  field: "lname",
                  headerName: "นามสกุล",
                  minWidth: 100,
                  flex: 1,
                },
                {
                  field: "student_id",
                  headerName: "รหัสนักศึกษา",
                  minWidth: 110,
                  flex: 1,
                  align: "center",
                },
                {
                  field: "pre_test_score",
                  headerName: "คะแนน Pre-test",
                  width: 112,
                  align: "center",
                },
                {
                  field: "pre_test_date",
                  headerName: "วันที่ทำ Pre-test",
                  width: 112,
                  align: "center",
                  renderCell: (params) => {
                    const date = new Date(params.value);
                    const formattedDate = isNaN(date.getTime())
                      ? "-"
                      : date.toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                    return <Box>{formattedDate}</Box>;
                  },
                },
                {
                  field: "post_test_score",
                  headerName: "คะแนน Post-test ครั้งแรก",
                  width: 168,
                  renderCell: (params) => (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor:
                            params.value === 100
                              ? "#4CAF50"
                              : params.value >= 80
                              ? "#FFCE56"
                              : "",
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px" }}>
                          {params.value || "-"}
                        </Typography>
                      </Box>
                    </Box>
                  ),
                },
                {
                  field: "post_test_date",
                  headerName: "วันที่ทำ Post-test ครั้งแรก",
                  width: 112,
                  align: "center",
                  renderCell: (params) => {
                    const date = new Date(params.value);
                    const formattedDate = isNaN(date.getTime())
                      ? "-"
                      : date.toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                    return <Box>{formattedDate}</Box>;
                  },
                },
                {
                  field: "highest_post_test_score",
                  headerName: "คะแนน Post-test สูงสุด",
                  width: 156,
                  renderCell: (params) => (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor:
                            params.value === 100
                              ? "#4CAF50"
                              : params.value >= 80
                              ? "#FFCE56"
                              : "",
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px" }}>
                          {params.value || "-"}
                        </Typography>
                      </Box>
                    </Box>
                  ),
                },
                {
                  field: "email",
                  headerName: "อีเมล",
                  minWidth: 200,
                  flex: 1,
                },
                {
                  field: "adviser",
                  headerName: "อาจารย์ที่ปรึกษา",
                  minWidth: 200,
                  flex: 1,
                },
                {
                  field: "remark",
                  headerName: "หมายเหตุ",
                  minWidth: 100,
                  flex: 1,
                  renderCell: (params) => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Typography noWrap>{params.value || "-"}</Typography>
                    </Box>
                  ),
                },
                {
                  field: "edit",
                  headerName: role == "admin" ? "ดู/แก้ไข" : "รายละเอียด",
                  width: 100,
                  headerAlign: "center",
                  align: "center",
                  renderCell: (params) => (
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedUser(params.row)}
                    >
                      {role == "admin" ? "ดู/แก้ไข" : "ดู"}
                    </Button>
                  ),
                },
              ]}
            />
          </Box>
        </Paper>
      </Box>

      {selectedUser && (
        <EditUserPopup
          role={role}
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={(updatedUser) => {
            setStudents((prev) =>
              prev.map((stu) => (stu.id === updatedUser.id ? updatedUser : stu))
            );
            setFilteredStudents((prev) =>
              prev.map((stu) => (stu.id === updatedUser.id ? updatedUser : stu))
            );
            setSelectedUser(null);
          }}
          onDelete={() => {
            setStudents((prev) =>
              prev.filter((stu) => stu.id !== selectedUser.id)
            );
            setFilteredStudents((prev) =>
              prev.filter((stu) => stu.id !== selectedUser.id)
            );
            setSelectedUser(null);
          }}
        />
      )}
    </Box>
  );
};

export default TeacherDashboard;
