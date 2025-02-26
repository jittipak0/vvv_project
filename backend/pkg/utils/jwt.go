package utils

import (
	"fmt"
	"os"

	"time"
	"vvv_backend/internal/user"

	"github.com/golang-jwt/jwt/v4"
)

// GenerateJWT สร้าง JWT โดยรับ userID และ role ของผู้ใช้งาน
func GenerateJWT(user *user.User, duration time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"id":             user.ID,
		"email":          user.Email,
		"password":       user.Password,
		"role":           user.Role,
		"fname":          user.FName,
		"lname":          user.LName,
		"tutorial":       user.Tutorial,
		"total_progress": user.TotalProgress,
		"post_test_pass": user.PostTestPass,
		"exp":            time.Now().Add(duration).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// ParseJWT ตรวจสอบและ parse JWT token
func ParseJWT(tokenString string) (*jwt.Token, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET not set in environment")
	}

	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// ตรวจสอบ signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})
}

// ValidateToken ตรวจสอบ JWT และคืนค่า Claims
func ValidateToken(tokenString string) (jwt.MapClaims, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET not set in environment")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// ตรวจสอบ signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid token: %v", err)
	}

	// ตรวจสอบว่าค่า Claims อยู่ในรูปแบบที่คาดหวังหรือไม่
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token claims")
}
