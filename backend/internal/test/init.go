package test

import (
	"log"

	"gorm.io/gorm"
)

func InitializeTestHandler(db *gorm.DB, userService UserServiceInterface) *TestHandler {
	// เรียกใช้ฟังก์ชัน Migrate ภายใน Initializer
	MigrateAndSeed(db)

	repository := &TestRepository{DB: db}
	service := &TestService{Repository: repository, UserService: userService}
	handler := &TestHandler{Service: service}
	return handler
}

// Migrate ฟังก์ชันสำหรับจัดการการ Migrate ของโมดูล test
func MigrateAndSeed(db *gorm.DB) {
	db.AutoMigrate(&Test{}, &Question{}, &Option{})

	// ตรวจสอบว่ามีข้อสอบหรือยัง
	var count int64
	db.Model(&Test{}).Count(&count)
	if count > 0 {
		log.Println("Test data already exists")
		return
	}

	log.Println("Seeding test data...")

	db.Create(&PreTest)
	db.Create(&PostTest)
	log.Println("Test data seeded successfully")
}
