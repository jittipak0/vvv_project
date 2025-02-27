package config

import (
	"os"
	"strings"

	"github.com/gin-contrib/cors"
)

// GetCORSConfig returns a CORS configuration
func GetCORSConfig(env string) cors.Config {
	config := cors.DefaultConfig()

	if env == "production" {
		allowedOriginsEnv := os.Getenv("ALLOW_ORIGINS")
		if allowedOriginsEnv == "" {
			allowedOriginsEnv = "https://mydomain.com"
		}
		// แยกด้วย comma
		origins := strings.Split(allowedOriginsEnv, ",")
		// Trim space ถ้ามี
		for i, o := range origins {
			origins[i] = strings.TrimSpace(o)
		}
		config.AllowOrigins = origins
	} else {
		config.AllowOrigins = []string{"http://localhost:3000"}
	}

	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Content-Type", "Authorization"}
	config.AllowCredentials = true

	return config
}
