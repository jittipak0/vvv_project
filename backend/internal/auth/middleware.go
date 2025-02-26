package auth

import (
	"log"
	"net/http"
	"time"

	"vvv_backend/internal/user"
	"vvv_backend/pkg/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// ดึง Token จาก Header
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			log.Println("[AuthMiddleware] Access token missing, checking refresh token...")

			// 🔄 ถ้าไม่มี Access Token → ใช้ Refresh Token
			refreshToken, err := c.Cookie("refresh_token")
			if err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
				return
			}

			claims, err := utils.ValidateToken(refreshToken)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
				return
			}

			// 🔑 สร้าง Access Token ใหม่
			// ใช้การเช็คค่าแบบปลอดภัย
			userID, ok := claims["userID"].(float64)
			if !ok {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
				return
			}

			role, ok := claims["role"].(string)
			if !ok {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid role"})
				return
			}

			email, ok := claims["email"].(string)
			if !ok {
				email = ""
			}

			// สร้าง Struct `user.User` อย่างถูกต้อง
			user := &user.User{
				ID:    uint(userID),
				Role:  user.Role(role),
				Email: email,
			}

			// สร้าง Access Token ใหม่ (อายุ 15 นาที)
			newAccessToken, err := utils.GenerateJWT(user, 15*time.Minute)

			if err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to refresh access token"})
				return
			}

			// 🔗 ใส่ Header ใหม่
			c.Header("Authorization", "Bearer "+newAccessToken)
			c.Set("userID", uint(userID))
			c.Set("role", role)
		}

		c.Next()
	}
}
