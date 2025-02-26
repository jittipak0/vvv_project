package auth

import (
	// "time"
	"vvv_backend/internal/user"
)

// UserServiceInterface กำหนด Interface สำหรับดึงข้อมูล User
type UserServiceInterface interface {
	AuthGetUserByEmail(email string) (*user.User, error)
	GetUserByID(userID uint) (*user.User, error)
}
