package test

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TestHandler struct {
	Service *TestService
}

func (h *TestHandler) CreateTest(c *gin.Context) {
	log.Println("[TestHandler][CreateTest] Received request to create a new test")

	var test Test
	if err := c.ShouldBindJSON(&test); err != nil {
		log.Printf("[TestHandler][CreateTest] Invalid request format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}
	log.Printf("[TestHandler][CreateTest] Request parsed successfully: %+v", test)

	// Call service to create the test
	if err := h.Service.CreateTest(&test); err != nil {
		log.Printf("[TestHandler][CreateTest] Failed to create test: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create test"})
		return
	}

	log.Printf("[TestHandler][CreateTest] Test created successfully with ID=%d", test.ID)
	c.JSON(http.StatusCreated, gin.H{"message": "Test created successfully", "test": test})
}

func (h *TestHandler) GetTestByID(c *gin.Context) {
	log.Println("[TestHandler][GetTestByID] Received request")

	// Parse and validate ID
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		log.Printf("[TestHandler][GetTestByID] Invalid ID format: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid ID format",
		})
		return
	}
	log.Printf("[TestHandler][GetTestByID] Fetching test with ID=%d", id)

	// Call service
	test, err := h.Service.GetTestByID(uint(id))
	if err != nil {
		log.Printf("[TestHandler][GetTestByID] Test not found for ID=%d: %v", id, err)
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Test not found",
		})
		return
	}

	// Send response back to the client
	log.Printf("[TestHandler][GetTestByID] Successfully retrieved test for ID=%d", id)
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Test retrieved successfully",
		"data":    test,
	})
}

func (h *TestHandler) GetTestByTitle(c *gin.Context) {
	log.Println("[TestHandler][GetTestByTitle] Received request")

	// Parse and validate title
	title := c.Param("title")
	log.Printf("[TestHandler][GetTestByTitle] Fetching test with title: %s", title)

	// Call service
	test, err := h.Service.GetTestByTitle(title)
	if err != nil {
		log.Printf("[TestHandler][GetTestByTitle] Test not found for title: %s - Error: %v", title, err)
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Test not found",
		})
		return
	}

	// Send response back to the client
	log.Printf("[TestHandler][GetTestByTitle] Successfully retrieved test for title: %s", title)
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Test retrieved successfully",
		"data":    test,
	})
}

func (h *TestHandler) AdminGetTestByID(c *gin.Context) {
	log.Println("[TestHandler][AdminGetTestByID] Received request")

	// Parse and validate ID
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		log.Printf("[TestHandler][AdminGetTestByID] Invalid ID format: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid ID format",
		})
		return
	}
	log.Printf("[TestHandler][AdminGetTestByID] Fetching test with ID=%d", id)

	// Call service
	test, err := h.Service.AdminGetTestByID(uint(id))
	if err != nil {
		log.Printf("[TestHandler][AdminGetTestByID] Test not found for ID=%d: %v", id, err)
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Test not found",
		})
		return
	}

	// Send response back to the client
	log.Printf("[TestHandler][AdminGetTestByID] Successfully retrieved test for ID=%d", id)
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Test retrieved successfully",
		"data":    test,
	})
}

func (h *TestHandler) AdminGetTestByTitle(c *gin.Context) {
	log.Println("[TestHandler][AdminGetTestByTitle] Received request")

	// Parse and validate title
	title := c.Param("title")
	log.Printf("[TestHandler][AdminGetTestByTitle] Fetching test with title: %s", title)

	// Call service
	test, err := h.Service.AdminGetTestByTitle(title)
	if err != nil {
		log.Printf("[TestHandler][AdminGetTestByTitle] Test not found for title: %s - Error: %v", title, err)
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Test not found",
		})
		return
	}

	// Send response back to the client
	log.Printf("[TestHandler][AdminGetTestByTitle] Successfully retrieved test for title: %s", title)
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Test retrieved successfully",
		"data":    test,
	})
}

func (h *TestHandler) UpdateTest(c *gin.Context) {
	log.Println("[TestHandler][UpdateTest] Received request")

	// Parse and validate test ID
	testID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		log.Printf("[TestHandler][UpdateTest] Invalid test ID format: %s", c.Param("id"))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid test ID"})
		return
	}
	log.Printf("[TestHandler][UpdateTest] Updating test with ID=%d", testID)

	// Parse request body
	var updatedTest Test
	if err := c.ShouldBindJSON(&updatedTest); err != nil {
		log.Printf("[TestHandler][UpdateTest] Invalid request format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Call service to update test
	if err := h.Service.UpdateTest(uint(testID), &updatedTest); err != nil {
		log.Printf("[TestHandler][UpdateTest] Failed to update test with ID=%d: %v", testID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update test"})
		return
	}

	log.Printf("[TestHandler][UpdateTest] Successfully updated test with ID=%d", testID)
	c.JSON(http.StatusOK, gin.H{"message": "Test updated successfully", "test": updatedTest})
}

func (h *TestHandler) SubmitTest(c *gin.Context) {
	log.Println("[TestHandler][SubmitTest] Received request")

	// Parse request body
	var request TestSubmission
	if err := c.ShouldBindJSON(&request); err != nil {
		log.Printf("[TestHandler][SubmitTest] Invalid request format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}
	log.Printf("[TestHandler][SubmitTest] Processing test submission for UserID=%d, TestID=%d", request.UserID, request.TestID)

	// Call service to process test submission
	user, score, err := h.Service.SubmitTest(request)
	if err != nil {
		log.Printf("[TestHandler][SubmitTest] Failed to submit test for UserID=%d, TestID=%d: %v", request.UserID, request.TestID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit test"})
		return
	}

	log.Printf("[TestHandler][SubmitTest] Test submitted successfully for UserID=%d, TestID=%d, Score=%f", request.UserID, request.TestID, score)
	c.JSON(http.StatusOK, gin.H{
		"message":  "Test submitted successfully",
		"score":    score,
		"userData": user,
	})
}
