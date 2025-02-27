package auth

import (
	"log"
	"net/http"
	"time"
	"vvv_backend/pkg/utils"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	Service *AuthService
}

func (h *AuthHandler) Login(c *gin.Context) {
	log.Println("[AuthHandler][Login] Received login request")

	var credentials struct {
		Email      string `json:"email"`
		Password   string `json:"password"`
		RememberMe bool   `json:"remember_me"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		log.Printf("[AuthHandler][Login] Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input format"})
		return
	}

	loggedInUser, err := h.Service.Login(credentials.Email, credentials.Password)
	if err != nil {
		log.Printf("[AuthHandler][Login] Login failed for email %s: %v", credentials.Email, err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "email หรือ password ไม่ถูกต้อง"})
		return
	}

	// สร้าง Access Token (อายุ 15 นาที)
	accessToken, err := utils.GenerateJWT(loggedInUser, 15*time.Minute)
	if err != nil {
		log.Printf("[AuthHandler][Login] Failed to generate access token for user %s: %v", loggedInUser.Email, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// สร้าง Refresh Token (อายุ 1 วัน หรือ 7 วันถ้า Remember Me)
	refreshToken, err := utils.GenerateJWT(loggedInUser, time.Hour*24)
	if credentials.RememberMe {
		refreshToken, err = utils.GenerateJWT(loggedInUser, time.Hour*24*7)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	// เก็บ Refresh Token ใน HttpOnly Cookie
	//? Development: ให้ secure = false
	c.SetCookie("refresh_token", refreshToken, int(24*time.Hour/time.Second), "/", "", false, true)

	log.Printf("[AuthHandler][Login] User %s logged in successfully", loggedInUser.Email)
	c.JSON(http.StatusOK, gin.H{"token": accessToken, "user": loggedInUser})
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	log.Println("[AuthHandler][RefreshToken] Received refresh token request")

	// ดึงค่า Refresh Token จาก Cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		log.Println("[AuthHandler][RefreshToken] Refresh token missing in request")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token missing"})
		return
	}

	// ตรวจสอบความถูกต้องของ Refresh Token
	claims, err := utils.ValidateToken(refreshToken)
	if err != nil {
		log.Printf("[AuthHandler][RefreshToken] Invalid refresh token: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	// แปลง userID จาก claims
	userIDFloat, ok := claims["id"].(float64)
	if !ok {
		log.Println("[AuthHandler][RefreshToken] Invalid userID in token")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
		return
	}

	userID := uint(userIDFloat)

	// ดึงข้อมูลผู้ใช้ที่ละเอียดจากฐานข้อมูล
	fullUser, err := h.Service.GetUserByID(userID)
	if err != nil {
		log.Printf("[AuthHandler][RefreshToken] Failed to retrieve full user details: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve user details"})
		return
	}

	log.Printf("[AuthHandler][RefreshToken] Generating new access token for UserID=%d", fullUser.ID)

	// สร้าง Access Token ใหม่ (15 นาที) โดยใช้ข้อมูลจาก fullUser
	newAccessToken, err := utils.GenerateJWT(fullUser, 15*time.Minute)
	if err != nil {
		log.Printf("[AuthHandler][RefreshToken] Failed to generate new access token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to refresh access token"})
		return
	}

	log.Printf("[AuthHandler][RefreshToken] Token refreshed successfully for UserID=%d", fullUser.ID)

	// ส่ง response กลับ โดยคืน token ใหม่และข้อมูลผู้ใช้ที่ละเอียด
	c.JSON(http.StatusOK, gin.H{
		"token": newAccessToken,
		"user":  fullUser,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetCookie("refresh_token", "", -1, "/", "", true, true) // ลบ Cookie
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
	log.Println("[AuthHandler][Logout] Logged out successfully")
}
