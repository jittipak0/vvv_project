package user

import (
	"log"
	"os"

	"gorm.io/gorm"
)

func InitializeUserHandler(db *gorm.DB) *UserHandler {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatalf("JWT_SECRET is not set in environment variables")
	}
	if err := Migrate(db); err != nil {
		log.Fatalf("Failed to migrate user module: %v", err)
	}

	repository := &UserRepository{DB: db}
	service := &UserService{Repository: repository}
	handler := &UserHandler{Service: service}
	return handler
}

// Migrate ทำหน้าที่สร้าง (หรือปรับปรุง) ตารางและ schema ที่ต้องการในฐานข้อมูล
func Migrate(db *gorm.DB) error {
	log.Println("[Migrate] Starting database migration...")

	// ตรวจสอบ และสร้าง Enum "role" ถ้ายังไม่มี
	log.Println("[Migrate] Creating custom type 'role' if not exists...")
	createEnumSQL := `
	DO $$ BEGIN
		IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
			CREATE TYPE role AS ENUM ('admin', 'teacher', 'student');
		END IF;
	END $$;
	`
	if err := db.Exec(createEnumSQL).Error; err != nil {
		log.Printf("[Migrate] Failed to create custom type 'role': %v", err)
		return err
	}

	// ใช้ GORM AutoMigrate เพื่อสร้าง/อัปเดตตาราง User
	log.Println("[Migrate] Auto migrating 'User' model...")
	if err := db.AutoMigrate(&User{}); err != nil {
		log.Printf("[Migrate] AutoMigrate failed: %v", err)
		return err
	}

	log.Println("[Migrate] Database migration completed successfully")
	return nil
}
