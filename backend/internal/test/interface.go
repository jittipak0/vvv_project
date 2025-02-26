package test

import "vvv_backend/internal/user"

// UserServiceInterface กำหนด Interface สำหรับดึงข้อมูล User
type UserServiceInterface interface {
	UpdateScore(userID uint, testTitle string, totalPoints int, score float64) (*user.User, error)
}
