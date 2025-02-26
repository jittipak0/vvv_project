package config

import "github.com/gin-contrib/cors"

// GetCORSConfig returns a CORS configuration
func GetCORSConfig(env string) cors.Config {
	config := cors.DefaultConfig()

	if env == "production" {
		// Production: ระบุ Origin ที่อนุญาตเท่านั้น
		config.AllowOrigins = []string{"https://your-production-frontend.com"}
	} else {
		// Development: เปลี่ยนจาก "*" เป็น "http://localhost:3000"
		config.AllowOrigins = []string{"http://localhost:3000", "http://192.168.1.108:3000"}
	}

	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Content-Type", "Authorization"}
	config.AllowCredentials = true //  รองรับ Credentials (เช่น Cookies, Authorization Headers)

	return config
}
