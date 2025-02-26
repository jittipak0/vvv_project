package auth

import (
	"errors"
	"log"
	"strings"
	"vvv_backend/internal/user"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserService UserServiceInterface
}

func (s *AuthService) Login(email, password string) (*user.User, error) {
	log.Printf("[Login] Attempting login with email: %s", email)

	user, err := s.UserService.AuthGetUserByEmail(strings.ToLower(email))
	if err != nil {
		log.Printf("[Login] User with email %s not found: %v", email, err)
		return nil, errors.New("email หรือ password ไม่ถูกต้อง")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		log.Printf("[Login] Invalid password for user %s", email)
		return nil, errors.New("email หรือ password ไม่ถูกต้อง")
	}

	log.Printf("[Login] User %s logged in successfully", email)
	return user, nil
}

func (s *AuthService) GetUserByID(id uint) (*user.User, error) {
	log.Printf("[GetUserByID] Get user by ID : %d", id)

	user, err := s.UserService.GetUserByID(id)
	if err != nil {
		log.Printf("[GetUserByID] User with id %d not found: %v", id, err)
		return nil, errors.New("เกิดข้อผิดพลาดบางอย่าง")
	}

	log.Printf("[GetUserByID] successfully")
	return user, nil
}
