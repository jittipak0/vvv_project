package user

import (
	"time"
)

// Role คือชนิดข้อมูลที่จะใช้ระบุบทบาทของผู้ใช้งาน
type Role string

// ประกาศค่าคงที่ (constant) สำหรับ Role
const (
	Admin   Role = "admin"
	Teacher Role = "teacher"
	Student Role = "student"
)

// User คือ struct ที่ใช้แทนตารางผู้ใช้งานในฐานข้อมูล
type User struct {
	ID                   uint                   `gorm:"primaryKey" json:"id"`                       // ใช้เป็น Primary Key
	Email                string                 `gorm:"unique;not null" json:"email"`               // ต้องไม่ซ้ำ (unique) และต้องไม่เป็น null
	Password             string                 `gorm:"not null" json:"password"`                   // รหัสผ่านต้องไม่เป็น null
	Role                 Role                   `gorm:"type:role;not null" json:"role"`             // ใช้ข้อมูลชนิด role ที่สร้างใน DB
	FName                string                 `gorm:"column:fname" json:"fname"`                  // ชื่อ (ไม่บังคับ)
	LName                string                 `gorm:"column:lname" json:"lname"`                  // นามสกุล (ไม่บังคับ)
	Tutorial             bool                   `gorm:"default:true" json:"tutorial"`               //
	TotalProgress        int                    `gorm:"default:0" json:"total_progress"`            //
	StudentID            *string                `json:"student_id"`                                 // รหัสนักศึกษา (เป็น pointer เพราะอาจไม่มีข้อมูล)
	Section              *string                `json:"section"`                                    //
	Adviser              *string                `json:"adviser"`                                    //
	PreTestScore         *float64               `json:"pre_test_score"`                             // คะแนน Pretest (pointer เพื่อรองรับกรณีไม่ใส่)
	PreTestDate          *time.Time             `json:"pre_test_date"`                              // วันที่ทำ Pretest (pointer เพื่อรองรับกรณีไม่ใส่)
	PostTestScore        *float64               `json:"post_test_score"`                            // คะแนน Posttest (pointer เพื่อรองรับกรณีไม่ใส่)
	PostTestDate         *time.Time             `json:"post_test_date"`                             // วันที่ทำ Posttest (pointer เพื่อรองรับกรณีไม่ใส่)
	HighestPostTestScore *float64               `json:"highest_post_test_score"`                    // เก็บคะแนนสูงสุดที่ทำได้
	HighestPostTestDate  *time.Time             `json:"highest_post_test_date"`                     //
	Remark               *string                `json:"remark"`                                     //
	VisitedPage          []string               `gorm:"serializer:json" json:"visited_page"`        // สำหรับเก็บรายชื่อหน้าที่เคยเข้า
	PostTestPass         bool                   `gorm:"default:false " json:"post_test_pass"`       // สถานะการสอบผ่าน
	SatisfactionSurvey   map[string]interface{} `gorm:"serializer:json" json:"satisfaction_survey"` // แบบประเมินความพึงพอใจ
	CreatedAt            time.Time              `gorm:"autoCreateTime" json:"created_at"`           //
	UpdatedAt            time.Time              `gorm:"autoUpdateTime" json:"updated_at"`           //
}

type ProgressResponse struct {
	TotalProgress int  `json:"progress"`
	Tutorial      bool `json:"tutorial"`
}
