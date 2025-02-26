package content

import (
	"errors"
	"io"
	"log"
	"vvv_backend/internal/storage"

	"gorm.io/gorm"
)

type ContentService struct {
	Repository *ContentRepository
	Storage    storage.StorageService
}

func (s *ContentService) GetAllPages() ([]Page, error) {
	log.Println("[Service][GetAllPages] Fetching all pages")
	pages, err := s.Repository.GetAllPages()
	if err != nil {
		log.Printf("[Service][GetAllPages] Failed to fetch pages: %v", err)
		return nil, err
	}
	return pages, nil
}

func (s *ContentService) GetPageByID(id uint) (Page, error) {
	log.Printf("[Service][GetPageByID] Fetching page with ID %d", id)
	page, err := s.Repository.GetPageByID(id)
	if err != nil {
		log.Printf("[Service][GetPageByID] Failed to fetch page with ID %d: %v", id, err)
		return Page{}, err
	}
	return page, nil
}

func (s *ContentService) GetPageByTitle(title string) (Page, error) {
	log.Printf("[Service][GetPageByTitle] Fetching page with Title %s", title)
	page, err := s.Repository.GetPageByTitle(title)
	if err != nil {
		log.Printf("[Service][GetPageByTitle] Failed to fetch page with Title %s: %v", title, err)
		return Page{}, err
	}
	return page, nil
}

func (s *ContentService) CreateOrUpdatePage(request *Page) (Page, error) {
	log.Printf("[ContentService][CreateOrUpdatePage] Processing page: %s", request.Title)

	tx := s.Repository.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			log.Printf("[ContentService][CreateOrUpdatePage] Panic, rolling back transaction: %s", request.Title)
			tx.Rollback()
		}
	}()

	// ตรวจสอบว่ามี Page อยู่ในระบบแล้วหรือไม่
	var existingPage Page
	err := tx.Where("title = ?", request.Title).Preload("Groups.Contents").First(&existingPage).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("[ContentService][CreateOrUpdatePage] Failed to fetch page: %s, Error: %v", request.Title, err)
		tx.Rollback()
		return Page{}, err
	}

	// ใช้โครงสร้างของ Page เดิมถ้ามีอยู่
	existingPage.Title = request.Title
	//! existingPage.IsCountedInProgress = request.IsCountedInProgress

	// ลบกลุ่มและเนื้อหาเก่าก่อนแทนที่ (เพื่อป้องกันซ้ำซ้อน)
	if len(existingPage.Groups) > 0 {
		if err := tx.Where("page_id = ?", existingPage.ID).Delete(&Group{}).Error; err != nil {
			log.Printf("[ContentService][CreateOrUpdatePage] Failed to delete old groups: %s, Error: %v", request.Title, err)
			tx.Rollback()
			return Page{}, err
		}
	}

	// สร้าง Groups ใหม่
	var newGroups []Group
	for _, groupReq := range request.Groups {
		newGroup := Group{
			PageID:    existingPage.ID,
			PageTitle: request.Title,
			Name:      groupReq.Name,
		}

		// สร้าง Contents ใหม่
		var newContents []Content
		for _, contentReq := range groupReq.Contents {
			newContent := Content{
				GroupID:  newGroup.ID,
				Type:     contentReq.Type,
				Value:    contentReq.Value,
				Ref:      contentReq.Ref,
				TitleRef: contentReq.TitleRef,
			}
			newContents = append(newContents, newContent)
		}

		newGroup.Contents = newContents
		newGroups = append(newGroups, newGroup)
	}

	// บันทึก Page ใหม่พร้อม Groups และ Contents
	existingPage.Groups = newGroups
	if err := tx.Save(&existingPage).Error; err != nil {
		log.Printf("[ContentService][CreateOrUpdatePage] Failed to save page: %s, Error: %v", request.Title, err)
		tx.Rollback()
		return Page{}, err
	}

	// Commit Transaction
	if err := tx.Commit().Error; err != nil {
		log.Printf("[ContentService][CreateOrUpdatePage] Commit failed: %s, Error: %v", request.Title, err)
		tx.Rollback()
		return Page{}, err
	}

	log.Printf("[ContentService][CreateOrUpdatePage] Success: %s (PageID=%d)", existingPage.Title, existingPage.ID)
	return existingPage, nil
}

func (s *ContentService) DeletePage(pageID uint) error {
	log.Printf("[Service][DeletePage] Deleting Page ID=%d", pageID)
	tx := s.Repository.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Println("[Service][DeletePage] Transaction rolled back due to panic")
		}
	}()

	var page Page
	if err := tx.Where("id = ?", pageID).First(&page).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("[Service][DeletePage] Page ID=%d not found", pageID)
			return err
		}
		log.Printf("[Service][DeletePage] Failed: %v", err)
		tx.Rollback()
		return err
	}

	if err := s.Repository.DeletePage(tx, pageID); err != nil {
		log.Printf("[Service][DeletePage] Delete failed: %v", err)
		tx.Rollback()
		return err
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("[Service][DeletePage] Commit failed: %v", err)
		tx.Rollback()
		return err
	}

	log.Printf("[Service][DeletePage] Success: ID=%d", pageID)
	return nil
}

func (s *ContentService) DeleteContent(contentID uint) error {
	log.Printf("[Service][DeleteContent] Deleting Content ID=%d", contentID)
	tx := s.Repository.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Println("[Service][DeleteContent] Transaction rolled back due to panic")
		}
	}()

	var content Content
	if err := tx.Where("id = ?", contentID).First(&content).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("[Service][DeleteContent] Content ID=%d not found", contentID)
			return err
		}
		log.Printf("[Service][DeleteContent] Failed: %v", err)
		tx.Rollback()
		return err
	}

	if err := s.Repository.DeleteContent(tx, contentID); err != nil {
		log.Printf("[Service][DeleteContent] Delete failed: %v", err)
		tx.Rollback()
		return err
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("[Service][DeleteContent] Commit failed: %v", err)
		tx.Rollback()
		return err
	}

	log.Printf("[Service][DeleteContent] Success: ID=%d", contentID)
	return nil
}

func (s *ContentService) CreateContent(content *Content) error {
	if content.GroupID == 0 {
		return errors.New("page_id is required")
	}
	return s.Repository.CreateOrUpdateContent(s.Repository.DB, content)
}

func (s *ContentService) UpdateContent(contentID uint, updatedData *Content) (*Content, error) {
	var content Content

	if err := s.Repository.DB.First(&content, contentID).Error; err != nil {
		return nil, errors.New("content not found")
	}

	if updatedData.Type != "" {
		content.Type = updatedData.Type
	}
	if updatedData.Value != "" {
		content.Value = updatedData.Value
	}
	if updatedData.GroupID != 0 {
		content.GroupID = updatedData.GroupID
	}

	if err := s.Repository.CreateOrUpdateContent(s.Repository.DB, &content); err != nil {
		return nil, err
	}

	return &content, nil
}

func (s *ContentService) UpdateContentFields(contentID uint, updates map[string]interface{}) (*Content, error) {
	log.Printf("[ContentService][UpdateContentFields] Received request to update ContentID=%d with updates: %v", contentID, updates)

	var content Content

	//  ค้นหา Content ที่ต้องการอัปเดต
	if err := s.Repository.DB.First(&content, contentID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("[ContentService][UpdateContentFields] ContentID=%d not found", contentID)
			return nil, errors.New("content not found")
		}
		log.Printf("[ContentService][UpdateContentFields] Failed to retrieve ContentID=%d: %v", contentID, err)
		return nil, err
	}

	log.Printf("[ContentService][UpdateContentFields] Found ContentID=%d, proceeding with update", contentID)

	//  อัปเดตเฉพาะฟิลด์ที่ระบุ
	if err := s.Repository.UpdateContentFields(contentID, updates); err != nil {
		log.Printf("[ContentService][UpdateContentFields] Failed to update ContentID=%d: %v", contentID, err)
		return nil, err
	}

	log.Printf("[ContentService][UpdateContentFields] Successfully updated ContentID=%d, retrieving updated content", contentID)

	//  ดึงข้อมูลที่อัปเดตแล้วกลับมา
	if err := s.Repository.DB.First(&content, contentID).Error; err != nil {
		log.Printf("[ContentService][UpdateContentFields] Failed to retrieve updated ContentID=%d: %v", contentID, err)
		return nil, err
	}

	log.Printf("[ContentService][UpdateContentFields] ContentID=%d updated successfully with new data: %+v", contentID, content)

	return &content, nil
}

// UploadImage อัปโหลดรูปไปยัง Storage
func (s *ContentService) UploadImage(oldFileURL string, file io.Reader, fileName string) (string, error) {
	log.Printf("[ContentService][UploadImage] Received request to upload file: %s", fileName)

	//  ตรวจสอบว่า Storage ถูก initialize หรือไม่
	if s.Storage == nil {
		log.Println("[ContentService][UploadImage] Error: StorageService is nil")
		return "", errors.New("storage service is not initialized")
	}

	log.Printf("[ContentService][UploadImage] oldFileURL: %v", oldFileURL)

	// หากมี URL รูปเดิม ให้พยายามลบรูปนั้นออกก่อน
	if oldFileURL != "" {
		err := s.Storage.DeleteFile(oldFileURL)
		if err != nil {
			log.Printf("[ContentService][UploadImage] Failed to delete old image: %v", err)
			// return "", err
		} else {
			log.Printf("[ContentService][UploadImage] Old image deleted successfully: %s", oldFileURL)
		}
	}

	//  อัปโหลดไฟล์ไปยัง Storage
	url, err := s.Storage.UploadFile(file, fileName)
	if err != nil {
		log.Printf("[ContentService][UploadImage] Error: Failed to upload file: %s, Error: %v", fileName, err)
		return "", err
	}

	log.Printf("[ContentService][UploadImage] File uploaded successfully: %s, URL: %s", fileName, url)
	return url, nil
}

// DeleteImage ลบรูปจาก Storage
func (s *ContentService) DeleteImage(fileURL string) error {
	log.Printf("[ContentService][DeleteImage] Received request to delete file: %s", fileURL)

	//  ตรวจสอบว่า Storage ถูก initialize หรือไม่
	if s.Storage == nil {
		log.Println("[ContentService][DeleteImage] Error: StorageService is nil")
		return errors.New("storage service is not initialized")
	}

	//  ลบไฟล์จาก Storage
	err := s.Storage.DeleteFile(fileURL)
	if err != nil {
		log.Printf("[ContentService][DeleteImage] Error: Failed to delete file: %s, Error: %v", fileURL, err)
		return err
	}

	log.Printf("[ContentService][DeleteImage] File deleted successfully: %s", fileURL)
	return nil
}
