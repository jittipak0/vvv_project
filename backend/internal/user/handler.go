package user

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	Service *UserService
}

func (h *UserHandler) SignUp(c *gin.Context) {
	var user User

	log.Printf("[UserHandler][SignUp] Received SignUp request")

	if err := c.ShouldBindJSON(&user); err != nil {
		log.Printf("[UserHandler][SignUp] Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := h.Service.SignUp(&user); err != nil {
		log.Printf("[UserHandler][SignUp] Service.SignUp failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to register user"})
		return
	}

	log.Printf("[UserHandler][SignUp] User %s registered successfully", user.Email)
	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func (h *UserHandler) GetAllUsers(c *gin.Context) {
	log.Printf("[UserHandler][GetAllUsers] Received request to fetch all users")

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	users, err := h.Service.GetAllUsers(limit, offset)
	if err != nil {
		log.Printf("[UserHandler][GetAllUsers] Failed to fetch users: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	log.Printf("[UserHandler][GetAllUsers] Successfully fetched %d users", len(users))
	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) GetUserByID(c *gin.Context) {
	log.Printf("[UserHandler][GetUserByID] Received request to fetch user by ID")

	idParam := c.Param("id")
	userID, err := strconv.Atoi(idParam)
	if err != nil {
		log.Printf("[UserHandler][GetUserByID] Invalid user ID: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	log.Printf("[UserHandler][GetUserByID] Fetching user with ID: %d", userID)

	user, err := h.Service.GetUserByID(uint(userID))
	if err != nil {
		log.Printf("[UserHandler][GetUserByID] User ID %d not found", userID)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	log.Printf("[UserHandler][GetUserByID] Successfully fetched user: ID=%d, Email=%s", user.ID, user.Email)
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) GetUsersByRole(c *gin.Context) {
	role := c.Param("role")
	if role == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Role parameter is required"})
		return
	}

	log.Printf("[UserHandler][GetUsersByRole] Received request to fetch users with role: %s", role)

	users, err := h.Service.GetUsersByRole(Role(role))
	if err != nil {
		log.Printf("[UserHandler][GetUsersByRole] Failed to fetch users by role %s: %v", role, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users by role"})
		return
	}

	log.Printf("[UserHandler][GetUsersByRole] Successfully fetched %d users with role %s", len(users), role)
	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) GetUserByEmail(c *gin.Context) {
	log.Printf("[UserHandler][GetUserByEmail] Received request to fetch user by Email")

	userEmail := c.Param("email")

	log.Printf("[UserHandler][GetUserByEmail] Fetching user with Email: %s", userEmail)

	user, err := h.Service.GetUserByEmail(userEmail)
	if err != nil {
		log.Printf("[UserHandler][GetUserByEmail] User Email %s not found", userEmail)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	log.Printf("[UserHandler][GetUserByEmail] Successfully fetched user: Email=%s", user.Email)
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) GetUserProgress(c *gin.Context) {
	log.Printf("[UserHandler][GetUserProgress] Received request to fetch user by ID")

	idParam := c.Param("id")
	userID, err := strconv.Atoi(idParam)
	if err != nil {
		log.Printf("[UserHandler][GetUserProgress] Invalid user ID: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	log.Printf("[UserHandler][GetUserProgress] Fetching user with ID: %d", userID)

	user, err := h.Service.GetUserProgress(uint(userID))
	if err != nil {
		log.Printf("[UserHandler][GetUserProgress] User ID %d not found", userID)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// log.Printf("[UserHandler][GetUserProgress] Successfully fetched user: ID=%d, Email=%s", user.ID, user.Email)
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	idParam := c.Param("id")
	userID, err := strconv.Atoi(idParam)
	if err != nil {
		log.Printf("[UserHandler][UpdateUser] Invalid user ID: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		log.Printf("[UserHandler][UpdateUser] Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[UserHandler][UpdateUser] Received update request for user ID: %d", userID)

	// เรียก Service ให้อัปเดตเฉพาะฟิลด์ที่ส่งมา
	user, err := h.Service.UpdateUser(uint(userID), updateData)
	if err != nil {
		log.Printf("[UserHandler][UpdateUser] Failed to update user ID %d: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	log.Printf("[UserHandler][UpdateUser] Successfully updated user ID %d", userID)
	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully", "data": user})
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	userID, err := strconv.Atoi(idParam)
	if err != nil {
		log.Printf("[UserHandler][DeleteUser] Invalid user ID: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	log.Printf("[UserHandler][DeleteUser] Received request to delete user with ID: %d", userID)

	if err := h.Service.DeleteUser(uint(userID)); err != nil {
		log.Printf("[UserHandler][DeleteUser] Failed to delete user ID %d: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	log.Printf("[UserHandler][DeleteUser] Successfully deleted user ID %d", userID)
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func (h *UserHandler) DeleteMultipleUsers(c *gin.Context) {
	log.Printf("[UserHandler][DeleteMultipleUsers] Received request to delete multiple users")

	var req struct {
		UserIDs []uint `json:"user_ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[UserHandler][DeleteMultipleUsers] Invalid request: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if len(req.UserIDs) == 0 {
		log.Printf("[UserHandler][DeleteMultipleUsers] No user IDs provided")
		c.JSON(http.StatusBadRequest, gin.H{"error": "No user IDs provided"})
		return
	}

	err := h.Service.DeleteMultipleUsers(req.UserIDs)
	if err != nil {
		log.Printf("[UserHandler][DeleteMultipleUsers] Failed to delete users: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete users"})
		return
	}

	log.Printf("[UserHandler][DeleteMultipleUsers] Successfully deleted users")
	c.JSON(http.StatusOK, gin.H{"message": "Users deleted successfully"})
}

func (h *UserHandler) UpdateSatisfactionSurvey(c *gin.Context) {
	idParam := c.Param("id")
	userID, err := strconv.Atoi(idParam)
	if err != nil {
		log.Printf("[UserHandler][UpdateSatisfactionSurvey] Invalid user ID: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var surveyData map[string]interface{}
	if err := c.ShouldBindJSON(&surveyData); err != nil {
		log.Printf("[UserHandler][UpdateSatisfactionSurvey] Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[UserHandler][UpdateSatisfactionSurvey] Received satisfaction survey update for user ID: %d", userID)

	user, err := h.Service.UpdateSatisfactionSurvey(uint(userID), surveyData)
	if err != nil {
		log.Printf("[UserHandler][UpdateSatisfactionSurvey] Failed to update satisfaction survey for user ID %d: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update satisfaction survey"})
		return
	}

	log.Printf("[UserHandler][UpdateSatisfactionSurvey] Successfully updated satisfaction survey for user ID %d", userID)
	c.JSON(http.StatusOK, gin.H{
		"message": "Satisfaction survey updated successfully",
		"user":    user,
	})
}
