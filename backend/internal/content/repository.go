package content

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"

	"gorm.io/gorm"
)

type ContentRepository struct {
	DB *gorm.DB
}

func (r *ContentRepository) CreateOrUpdatePage(tx *gorm.DB, page *Page) error {
	log.Printf("[Repository][CreateOrUpdatePage] Checking if page exists: Title=%s", page.Title)

	var existingPage Page
	err := tx.Where("title = ?", page.Title).First(&existingPage).Error

	if err != nil && err != gorm.ErrRecordNotFound {
		log.Printf("[Repository][CreateOrUpdatePage] Error checking existing page: %v", err)
		return err
	}

	if err == gorm.ErrRecordNotFound {
		log.Printf("[Repository][CreateOrUpdatePage] Creating new page: Title=%s", page.Title)
		if err := tx.Create(page).Error; err != nil {
			log.Printf("[Repository][CreateOrUpdatePage] Failed to create page: Title=%s, Error=%v", page.Title, err)
			return err
		}
		log.Printf("[Repository][CreateOrUpdatePage] Page created successfully: Title=%s, ID=%d", page.Title, page.ID)

	} else {
		log.Printf("[Repository][CreateOrUpdatePage] Updating existing page: Title=%s, ID=%d", existingPage.Title, existingPage.ID)
		if err := tx.Save(&existingPage).Error; err != nil {
			log.Printf("[Repository][CreateOrUpdatePage] Failed to update page: Title=%s, ID=%d, Error=%v", existingPage.Title, existingPage.ID, err)
			return err
		}
		log.Printf("[Repository][CreateOrUpdatePage] Page updated successfully: Title=%s, ID=%d", existingPage.Title, existingPage.ID)
		page.ID = existingPage.ID
	}

	for _, group := range page.Groups {
		group.PageID = page.ID
		if err := r.CreateOrUpdateGroup(tx, &group); err != nil {
			return err
		}
	}

	return nil
}

func (r *ContentRepository) CreateOrUpdateGroup(tx *gorm.DB, group *Group) error {
	log.Printf("[ContentRepository][CreateOrUpdateGroup] Processing group: %s (PageID=%d)", group.Name, group.PageID)

	var existingGroup Group
	err := tx.Where("page_id = ? AND name = ?", group.PageID, group.Name).First(&existingGroup).Error

	if err != nil && err != gorm.ErrRecordNotFound {
		log.Printf("[ContentRepository][CreateOrUpdateGroup] Failed to check existing group (PageID=%d, Name=%s): %v", group.PageID, group.Name, err)
		return err
	}

	if err == gorm.ErrRecordNotFound {
		log.Printf("[ContentRepository][CreateOrUpdateGroup] Creating new group: %s (PageID=%d)", group.Name, group.PageID)
		if err := tx.Create(group).Error; err != nil {
			log.Printf("[ContentRepository][CreateOrUpdateGroup] Failed to create group: %s (PageID=%d): %v", group.Name, group.PageID, err)
			return err
		}
	} else {
		log.Printf("[ContentRepository][CreateOrUpdateGroup] Group already exists, updating: %s (GroupID=%d, PageID=%d)", group.Name, existingGroup.ID, group.PageID)
		group.ID = existingGroup.ID
	}

	// อัปเดตหรือสร้าง Contents ที่อยู่ใน Group
	for _, content := range group.Contents {
		content.GroupID = group.ID
		log.Printf("[ContentRepository][CreateOrUpdateGroup] Processing content (GroupID=%d, ContentID=%d)", group.ID, content.ID)

		if err := r.CreateOrUpdateContent(tx, &content); err != nil {
			log.Printf("[ContentRepository][CreateOrUpdateGroup] Failed to process content (GroupID=%d, ContentID=%d): %v", group.ID, content.ID, err)
			return err
		}
	}

	log.Printf("[ContentRepository][CreateOrUpdateGroup] Successfully processed group: %s (GroupID=%d, PageID=%d)", group.Name, group.ID, group.PageID)
	return nil
}

func (r *ContentRepository) CreateOrUpdateContent(tx *gorm.DB, content *Content) error {
	log.Printf("[Repository][CreateOrUpdateContent] Processing content for GroupID=%d, Type=%s", content.GroupID, content.Type)

	if content.GroupID == 0 {
		log.Printf("[Repository][CreateOrUpdateContent] ERROR: Invalid GroupID=%d", content.GroupID)
		return errors.New("invalid GroupID for content")
	}

	// Use FirstOrCreate to avoid duplicate entries
	var existingContent Content
	err := tx.Where("group_id = ? AND type = ? AND value = ?", content.GroupID, content.Type, content.Value).First(&existingContent).Error

	if err != nil && err != gorm.ErrRecordNotFound {
		log.Printf("[Repository][CreateOrUpdateContent] Failed to check existing content: %v", err)
		return err
	}

	if err == gorm.ErrRecordNotFound {
		log.Printf("[Repository][CreateOrUpdateContent] Creating new content: Type=%s, GroupID=%d", content.Type, content.GroupID)
		if err := tx.Create(content).Error; err != nil {
			log.Printf("[Repository][CreateOrUpdateContent] Failed to create content: Type=%s, GroupID=%d, Error=%v", content.Type, content.GroupID, err)
			return err
		}
	} else {
		log.Printf("[Repository][CreateOrUpdateContent] Content already exists, skipping insert: Type=%s, GroupID=%d", content.Type, content.GroupID)
	}

	log.Printf("[Repository][CreateOrUpdateContent] Success: ID=%d, GroupID=%d", content.ID, content.GroupID)
	return nil
}

func (r *ContentRepository) GetPageByID(id uint) (Page, error) {
	log.Printf("[Repository][GetPageByID] Retrieving page with ID %d", id)
	var page Page

	// Query the database for the page with preloaded contents and options
	if err := r.DB.Preload("Groups.Contents").First(&page, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("[Repository][GetPageByID] Page with ID %d not found", id)
			return Page{}, err
		}
		log.Printf("[Repository][GetPageByID] Error retrieving page with ID %d: %v", id, err)
		return Page{}, err
	}

	log.Printf("[Repository][GetPageByID] Successfully retrieved page with ID %d", id)
	return page, nil
}

func (r *ContentRepository) GetPageByTitle(title string) (Page, error) {
	title = strings.ToLower(title)

	log.Printf("[Repository][GetPageByTitle] Retrieving page with title %s", title)
	var page Page

	// Query the database for the page with preloaded contents and options
	if err := r.DB.Preload("Groups.Contents").Where("LOWER(title) = ?", title).First(&page).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("[Repository][GetPageByTitle] Page with title %s not found", title)
			return Page{}, err
		}
		log.Printf("[Repository][GetPageByTitle] Error retrieving page with title %s: %v", title, err)
		return Page{}, err
	}

	log.Printf("[Repository][GetPageByTitle] Successfully retrieved page with title %s", title)
	return page, nil
}

func (r *ContentRepository) GetAllPages() ([]Page, error) {
	log.Println("[Repository][GetAllPages] Retrieving all pages")
	var pages []Page

	// Query all pages with preloaded contents and options
	if err := r.DB.Preload("Groups.Contents").Find(&pages).Error; err != nil {
		log.Printf("[Repository][GetAllPages] Error retrieving pages: %v", err)
		return nil, err
	}

	log.Printf("[Repository][GetAllPages] Successfully retrieved %d pages", len(pages))
	return pages, nil
}

func (r *ContentRepository) UpdatePage(tx *gorm.DB, page *Page) error {
	log.Printf("[Repository][UpdatePage] Updating page with ID %d", page.ID)

	// อัปเดต Page (เฉพาะ Title และ Description)
	if err := tx.Model(&Page{}).Where("id = ?", page.ID).Updates(Page{
		Title: page.Title,
	}).Error; err != nil {
		log.Printf("[Repository][UpdatePage] Failed to update page: %v", err)
		return err
	}

	log.Printf("[Repository][UpdatePage] Page with ID %d updated successfully", page.ID)
	return nil
}

func (r *ContentRepository) DeletePage(tx *gorm.DB, pageID uint) error {
	log.Printf("[Repository][DeletePage] Deleting page with ID %d", pageID)

	// ลบ Page พร้อมกับ Content ที่เกี่ยวข้อง (Cascading Delete)
	if err := tx.Where("id = ?", pageID).Delete(&Page{}).Error; err != nil {
		log.Printf("[Repository][DeletePage] Failed to delete page: %v", err)
		return err
	}

	log.Printf("[Repository][DeletePage] Page with ID %d deleted successfully", pageID)
	return nil
}

func (r *ContentRepository) GetContentsByPageID(pageID uint) ([]Content, error) {
	log.Printf("[Repository][GetContentsByPageID] Retrieving contents for page ID %d", pageID)
	var contents []Content
	if err := r.DB.Where("page_id = ?", pageID).Find(&contents).Error; err != nil {
		log.Printf("[Repository][GetContentsByPageID] Failed to retrieve contents: %v", err)
		return nil, err
	}
	return contents, nil
}

func (r *ContentRepository) DeleteContent(tx *gorm.DB, contentID uint) error {
	log.Printf("[Repository][DeleteContent] Deleting Content ID=%d", contentID)
	if err := tx.Delete(&Content{}, contentID).Error; err != nil {
		log.Printf("[Repository][DeleteContent] Failed: %v", err)
		return err
	}
	log.Printf("[Repository][DeleteContent] Success: ID=%d", contentID)
	return nil
}

func (r *ContentRepository) UpdateContentFields(contentID uint, updates map[string]interface{}) error {
	log.Printf("[ContentRepository][UpdateContentFields] Received request to update ContentID=%d with updates: %v", contentID, updates)

	//  ตรวจสอบว่ามี fields ให้ update หรือไม่
	if len(updates) == 0 {
		log.Printf("[ContentRepository][UpdateContentFields] No fields to update for ContentID=%d", contentID)
		return errors.New("no fields to update")
	}

	// ตรวจสอบและ marshal ฟิลด์ที่ต้องการ serialize เป็น JSON
	for _, field := range []string{"ref", "title_ref"} {
		if val, exists := updates[field]; exists {
			// หากค่าที่ส่งเข้ามาไม่ใช่ string ให้ทำการ marshal ให้เป็น JSON string
			if _, ok := val.(string); !ok {
				marshaled, err := json.Marshal(val)
				if err != nil {
					return fmt.Errorf("failed to marshal field %s: %w", field, err)
				}
				updates[field] = string(marshaled)
			}
		}
	}

	//  ใช้ `Updates` เพื่ออัปเดตเฉพาะฟิลด์ที่ต้องการ
	if err := r.DB.Model(&Content{}).Where("id = ?", contentID).Updates(updates).Error; err != nil {
		log.Printf("[ContentRepository][UpdateContentFields] Failed to update ContentID=%d: %v", contentID, err)
		return err
	}

	log.Printf("[ContentRepository][UpdateContentFields] Successfully updated ContentID=%d", contentID)
	return nil
}
