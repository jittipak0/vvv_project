package routers

import (
	"log"
	"vvv_backend/config"
	"vvv_backend/internal/auth"
	"vvv_backend/internal/content"

	"vvv_backend/internal/storage"
	"vvv_backend/internal/test"
	"vvv_backend/internal/user"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, env string) *gin.Engine {
	r := gin.Default()

	// ตั้งค่า CORS
	r.Use(cors.New(config.GetCORSConfig(env)))

	// Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Serve static files (ให้ frontend เรียกใช้รูปภาพผ่าน URL)
	r.Static("/uploads", "/app/uploads")

	// API อื่น ๆ
	api := r.Group("/api")
	{
		// User Management
		userHandler := user.InitializeUserHandler(db)
		api.POST("/auth/signup", userHandler.SignUp)
		api.GET("/users", userHandler.GetAllUsers)
		api.GET("/users/:id", userHandler.GetUserByID)
		api.GET("/users/role/:role", userHandler.GetUsersByRole)
		api.GET("/users/email/:email", userHandler.GetUserByEmail)
		api.GET("/users/progress/:id", userHandler.GetUserProgress)
		api.PUT("/users/update/:id", userHandler.UpdateUser)
		api.PUT("/users/update/satisfaction-survey/:id", userHandler.UpdateSatisfactionSurvey)
		api.DELETE("/users/delete/:id", userHandler.DeleteUser)
		api.POST("/users/delete", userHandler.DeleteMultipleUsers)

		// Auth Management
		authHandler := auth.InitializeAuthHandler(db, userHandler.Service)
		api.POST("/auth/login", authHandler.Login)
		api.POST("/auth/refresh", authHandler.RefreshToken)
		api.POST("/auth/logout", authHandler.Logout)

		// Test Management
		testHandler := test.InitializeTestHandler(db, userHandler.Service)
		api.POST("/tests", testHandler.CreateTest)
		api.GET("/tests/:id", testHandler.GetTestByID)
		api.GET("/tests/title/:title", testHandler.GetTestByTitle)
		api.GET("admin/tests/:id", testHandler.AdminGetTestByID)
		api.GET("admin/tests/title/:title", testHandler.AdminGetTestByTitle)
		api.PUT("/tests/:id", testHandler.UpdateTest)
		api.POST("/tests/submitTest", testHandler.SubmitTest)

		// Page & Content Management
		cloudinaryStorage := storage.NewCloudinaryStorage()

		if cloudinaryStorage == nil {
			log.Fatal("[Error] Failed to initialize CloudinaryStorage")
		}
		contentHandler := content.InitializeContentHandler(db, cloudinaryStorage)
		api.POST("/pages", contentHandler.CreatePage)
		api.GET("/pages", contentHandler.GetAllPages)
		api.GET("/pages/:id", contentHandler.GetPageByID)
		api.GET("/pages/title/:title", contentHandler.GetPageByTitle)
		api.PUT("/pages/:id", contentHandler.UpdatePage)
		api.PUT("/pages/content/:id", contentHandler.UpdateContentFields)
		api.DELETE("/pages/:id", contentHandler.DeletePage)

		// Content CRUD
		api.POST("/contents", contentHandler.CreateContent)
		api.PUT("/contents/:id", contentHandler.UpdateContent)
		api.DELETE("/contents/:id", contentHandler.DeleteContent)
		api.POST("/upload/image", contentHandler.UploadImageHandler)
		api.DELETE("/upload/image/:fileURL", contentHandler.DeleteImageHandler)
	}

	return r
}
