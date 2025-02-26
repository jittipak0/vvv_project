package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"vvv_backend/config"
	"vvv_backend/internal/db"
	"vvv_backend/internal/routers"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Starting the application...")

	// Load environment variables
	config.LoadEnv()

	// Get environment type (e.g., "development", "production")
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development" // default to development if not set
	}

	// Connect to the database
	if err := db.Connect(); err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	log.Println("Database connection established successfully.")

	// Setup router with DB and environment
	router := routers.SetupRouter(db.DB, env)

	// Start the server
	startServer(router)
}

// startServer starts the HTTP server
func startServer(router *gin.Engine) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: router,
	}

	go func() {
		log.Printf("Starting server on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	gracefulShutdown(server)
}

// gracefulShutdown handles application termination gracefully
func gracefulShutdown(server *http.Server) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	if err := db.Close(); err != nil {
		log.Printf("Error closing database connection: %v", err)
	} else {
		log.Println("Database connection closed.")
	}

	log.Println("Server exited.")
}
