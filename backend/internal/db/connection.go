package db

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB ตัวแปรสากล (global) สำหรับเก็บ instance ของ gorm.DB
var DB *gorm.DB

// Connect ทำหน้าที่เชื่อมต่อฐานข้อมูลและกำหนดค่าให้กับตัวแปร DB
func Connect() error {
	// โหลดตัวแปรจากไฟล์ .env ถ้าล้มเหลวจะหยุดโปรแกรมทันที
	if err := godotenv.Load(); err != nil {
		log.Fatalf("[Connect] Error loading .env file: %v", err)
		return err
	}

	requiredVars := []string{"DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "DB_PORT"}
	for _, v := range requiredVars {
		if os.Getenv(v) == "" {
			log.Fatalf("Missing required environment variable: %s", v)
		}
	}

	// สร้าง Data Source Name (DSN) สำหรับเชื่อมต่อไปยัง PostgreSQL
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"))

	log.Printf("[Connect] Connecting to database with DSN: %s", dsn)

	// เปิดการเชื่อมต่อกับฐานข้อมูลด้วย GORM
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("[Connect] Failed to connect to database: %v", err)
		return err
	}

	// กำหนดค่า database ให้ตัวแปร DB เพื่อใช้งานในส่วนอื่นของโปรแกรม
	DB = database
	log.Println("[Connect] Database connection established successfully")
	return nil
}

// Close ปิดการเชื่อมต่อฐานข้อมูล
func Close() error {
	sqlDB, err := DB.DB()
	if err != nil {
		log.Printf("Failed to get sql.DB from GORM DB: %v", err)
		return err
	}

	if err := sqlDB.Close(); err != nil {
		log.Printf("Failed to close database connection: %v", err)
		return err
	}

	log.Println("Database connection closed successfully.")
	return nil
}
