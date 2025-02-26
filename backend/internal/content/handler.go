package content

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ContentHandler struct {
	Service *ContentService
}

func (h *ContentHandler) CreatePage(c *gin.Context) {
	var request Page

	log.Println("[Handler][CreatePage] Request received")

	// Decode the request body
	if err := c.ShouldBindJSON(&request); err != nil {
		log.Printf("[Handler][CreatePage] Invalid JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid JSON format"})
		return
	}
	log.Println("[Handler][CreatePage] JSON decoded successfully")

	// Validate data
	if request.Title == "" {
		log.Println("[Handler][CreatePage] Validation error: Missing title")
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Title is required"})
		return
	}

	if len(request.Groups) == 0 {
		log.Println("[Handler][CreatePage] Validation error: No questions provided")
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "At least one question is required"})
		return
	}
	log.Println("[Handler][CreatePage] Request validation passed")

	// Call service
	Response, err := h.Service.CreateOrUpdatePage(&request)
	if err != nil {
		log.Printf("[Handler][CreatePage] Service error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to create page"})
		return
	}
	log.Println("[Handler][CreatePage] Page created successfully")

	// Send response back to the client
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Page created successfully",
		"data":    Response,
	})
	log.Println("[Handler][CreatePage] Response sent")
}

func (h *ContentHandler) GetAllPages(c *gin.Context) {
	log.Println("[Handler][GetAllPages] Request received")

	// Call service
	pages, err := h.Service.GetAllPages()
	if err != nil {
		log.Printf("[Handler][GetAllPages] Error retrieving pages: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to retrieve pages"})
		return
	}

	// Check if pages are empty
	if len(pages) == 0 {
		log.Println("[Handler][GetAllPages] No pages found")
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "No pages found",
			"data":    []Page{},
		})
		return
	}

	// Send response back to the client
	log.Printf("[Handler][GetAllPages] Retrieved %d pages", len(pages))
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Pages retrieved successfully",
		"data":    pages,
	})
}

func (h *ContentHandler) GetPageByID(c *gin.Context) {
	log.Println("[Handler][GetPageByID] Request received")

	// Parse and validate ID
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		log.Printf("[Handler][GetPageByID] Invalid ID format: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid ID format",
		})
		return
	}

	// Call service
	page, err := h.Service.GetPageByID(uint(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("[Handler][GetPageByID] Page with ID %d not found", id)
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Page not found",
			})
			return
		}
		log.Printf("[Handler][GetPageByID] Failed to fetch page with ID %d: %v", id, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve page",
		})
		return
	}

	// Send response back to the client
	log.Printf("[Handler][GetPageByID] Page retrieved successfully for ID %d", id)
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Page retrieved successfully",
		"data":    page,
	})
}

func (h *ContentHandler) GetPageByTitle(c *gin.Context) {
	log.Println("[Handler][GetPageByTitle] Request received")

	// Parse and validate Title
	title := c.Param("title")

	// Call service
	page, err := h.Service.GetPageByTitle(title)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("[Handler][GetPageByTitle] Page with Title %s not found", title)
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Page not found",
			})
			return
		}
		log.Printf("[Handler][GetPageByTitle] Failed to fetch page with Title %s: %v", title, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve page",
		})
		return
	}

	// Send response back to the client
	log.Printf("[Handler][GetPageByTitle] Page retrieved successfully for Title %s", title)
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Page retrieved successfully",
		"data":    page,
	})
}

func (h *ContentHandler) UpdatePage(c *gin.Context) {
	log.Println("[Handler][UpdatePage] Handling request to update page")

	// ดึง ID จาก URL Parameters
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		log.Printf("[Handler][UpdatePage] Invalid ID: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// อ่านข้อมูล Request Body
	var request Page
	if err := c.ShouldBindJSON(&request); err != nil {
		log.Printf("[Handler][UpdatePage] Invalid request body: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// ตั้งค่า ID ของ Page ใน Request
	request.ID = uint(id)

	// เรียกใช้ Service เพื่ออัปเดต Page
	updatedPage, err := h.Service.CreateOrUpdatePage(&request)
	if err != nil {
		log.Printf("[Handler][UpdatePage] Failed to update page: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update page"})
		return
	}

	// ส่งข้อมูลกลับไปยัง Client
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Page updated successfully",
		"data":    updatedPage,
	})
}

func (h *ContentHandler) DeletePage(c *gin.Context) {
	log.Println("[Handler][DeletePage] Handling request to delete page")

	// ดึง ID จาก URL Parameters
	idParam := c.Param("id")
	pageID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		log.Printf("[Handler][DeletePage] Invalid ID: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// เรียกใช้ Service เพื่อลบ Page
	if err := h.Service.DeletePage(uint(pageID)); err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Page not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete page"})
		return
	}

	// ส่ง Response กลับไปยัง Client
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Page deleted successfully",
	})
}

func (h *ContentHandler) CreateContent(c *gin.Context) {
	var content Content

	if err := c.ShouldBindJSON(&content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.Service.CreateContent(&content); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Content created successfully", "content": content})
}

func (h *ContentHandler) UpdateContent(c *gin.Context) {
	contentID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid content ID"})
		return
	}

	var updatedContent Content
	if err := c.ShouldBindJSON(&updatedContent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	updatedData, err := h.Service.UpdateContent(uint(contentID), &updatedContent)
	if err != nil {
		if err.Error() == "content not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Content not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Content updated successfully", "content": updatedData})
}

func (h *ContentHandler) UpdateContentFields(c *gin.Context) {
	log.Println("[ContentHandler][UpdateContentFields] Received request to update content")

	//  ดึงค่า contentID จาก URL
	contentID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		log.Printf("[ContentHandler][UpdateContentFields] Invalid content ID: %s", c.Param("id"))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid content ID"})
		return
	}
	log.Printf("[ContentHandler][UpdateContentFields] Parsed contentID=%d", contentID)

	//  อ่าน JSON ที่ส่งมา
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		log.Printf("[ContentHandler][UpdateContentFields] Invalid request body: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	log.Printf("[ContentHandler][UpdateContentFields] Received update data for ContentID=%d: %v", contentID, updates)

	//  อัปเดต Content
	updatedContent, err := h.Service.UpdateContentFields(uint(contentID), updates)
	if err != nil {
		if err.Error() == "content not found" {
			log.Printf("[ContentHandler][UpdateContentFields] ContentID=%d not found", contentID)
			c.JSON(http.StatusNotFound, gin.H{"error": "Content not found"})
			return
		}
		log.Printf("[ContentHandler][UpdateContentFields] Failed to update ContentID=%d: %v", contentID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update content"})
		return
	}

	log.Printf("[ContentHandler][UpdateContentFields] ContentID=%d updated successfully: %+v", contentID, updatedContent)

	//  ส่ง Response กลับไป
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Content updated successfully",
		"data":    updatedContent,
	})
}

func (h *ContentHandler) DeleteContent(c *gin.Context) {
	log.Println("[Handler][DeleteContent] Handling request to delete content")

	// ดึง ID จาก URL Parameters
	idParam := c.Param("id")
	contentID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		log.Printf("[Handler][DeleteContent] Invalid ID: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// เรียกใช้ Service เพื่อลบ Content
	if err := h.Service.DeleteContent(uint(contentID)); err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Content not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete content"})
		return
	}

	// ส่ง Response กลับไปยัง Client
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Content deleted successfully",
	})
}

// UploadImageHandler อัปโหลดรูป
func (h *ContentHandler) UploadImageHandler(c *gin.Context) {
	log.Println("[ContentHandler][UploadImageHandler] Received image upload request")

	// ดึงค่า oldFileURL จาก form-data
	oldFileURL := c.PostForm("oldFileURL")

	//  ดึงไฟล์จาก request
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		log.Printf("[ContentHandler][UploadImageHandler] Failed to retrieve file from request: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file"})
		return
	}
	defer file.Close()

	log.Printf("[ContentHandler][UploadImageHandler] Uploading file: %s", header.Filename)

	//  อัปโหลดรูป
	fileURL, err := h.Service.UploadImage(oldFileURL, file, header.Filename)
	if err != nil {
		log.Printf("[ContentHandler][UploadImageHandler] Failed to upload file: %s, Error: %v", header.Filename, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upload failed"})
		return
	}

	log.Printf("[ContentHandler][UploadImageHandler] File uploaded successfully: %s, URL: %s", header.Filename, fileURL)

	//  ส่ง Response กลับไป
	c.JSON(http.StatusOK, gin.H{"url": fileURL})
}

// DeleteImageHandler ลบรูป
func (h *ContentHandler) DeleteImageHandler(c *gin.Context) {
	log.Println("[ContentHandler][DeleteImageHandler] Received image delete request")

	//  ดึง fileURL จากพารามิเตอร์
	fileURL := c.Param("fileURL")
	log.Printf("[ContentHandler][DeleteImageHandler] Deleting file: %s", fileURL)

	//  ลบรูป
	err := h.Service.DeleteImage(fileURL)
	if err != nil {
		log.Printf("[ContentHandler][DeleteImageHandler] Failed to delete file: %s, Error: %v", fileURL, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}

	log.Printf("[ContentHandler][DeleteImageHandler] File deleted successfully: %s", fileURL)

	//  ส่ง Response กลับไป
	c.JSON(http.StatusOK, gin.H{"message": "File deleted successfully"})
}
