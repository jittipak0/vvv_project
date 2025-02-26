package auth

import (
	"log"
	"os"

	"gorm.io/gorm"
)

func InitializeAuthHandler(db *gorm.DB, userService UserServiceInterface) *AuthHandler {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatalf("JWT_SECRET is not set in environment variables")
	}

	service := &AuthService{UserService: userService}
	handler := &AuthHandler{Service: service}
	return handler
}
