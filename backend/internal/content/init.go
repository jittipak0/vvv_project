package content

import (
	"log"
	"vvv_backend/internal/storage"

	"gorm.io/gorm"
)

func InitializeContentHandler(db *gorm.DB, storage storage.StorageService) *ContentHandler {
	// ตรวจสอบว่า storage ถูกกำหนดค่าหรือไม่
	if storage == nil {
		log.Fatal("[Error] StorageService is nil")
	}

	// เรียกใช้ฟังก์ชัน Migrate ภายใน Initializer
	if err := Migrate(db); err != nil {
		log.Fatalf("Failed to migrate content module: %v", err)
	}

	repository := &ContentRepository{DB: db}
	service := &ContentService{Repository: repository, Storage: storage}
	handler := &ContentHandler{Service: service}
	return handler
}

func Migrate(db *gorm.DB) error {
	log.Println("Running content migrations...")

	if err := db.AutoMigrate(&Page{}, &Content{}); err != nil {
		log.Printf("[Migrate] Failed to migrate content module: %v", err)
		return err
	}

	seedPages(db)
	return nil
}

func seedPages(db *gorm.DB) {
	log.Println("Seeding initial pages...")

	var count int64
	db.Model(&Page{}).Count(&count)

	if count > 0 {
		log.Println("Pages already exist, skipping seed.")
		return
	}

	err := db.Transaction(func(tx *gorm.DB) error {
		// สร้าง Pages (FirstOrCreate ป้องกันค่าซ้ำ)
		for _, page := range Pages {
			var existingPage Page
			tx.Where("title = ?", page.Title).FirstOrCreate(&existingPage, page)
			page.ID = existingPage.ID
		}

		// ดึง PageID จาก Database
		pageMap := make(map[string]uint)
		for _, page := range Pages {
			var dbPage Page
			if err := tx.Where("title = ?", page.Title).First(&dbPage).Error; err != nil {
				log.Printf("Failed to get Page ID for %s: %v", page.Title, err)
				return err
			}
			pageMap[page.Title] = dbPage.ID
		}

		// สร้าง Groups และ Contents
		for _, page := range Pages {
			pageID, exists := pageMap[page.Title]
			if !exists {
				log.Printf("Skipping groups for unknown page: %s", page.Title)
				continue
			}

			for _, group := range page.Groups {
				group.PageID = pageID
				group.PageTitle = page.Title

				// ใช้ FirstOrCreate ป้องกันค่าซ้ำ
				var existingGroup Group
				tx.Where("page_id = ? AND name = ?", group.PageID, group.Name).FirstOrCreate(&existingGroup, group)
				group.ID = existingGroup.ID

				// สร้าง Contents โดยอ้างอิง GroupID
				for _, content := range group.Contents {
					content.GroupID = group.ID
					if err := tx.Create(&content).Error; err != nil {
						log.Printf("Failed to create content for group %s: %v", group.Name, err)
						return err
					}
				}
			}
		}

		log.Println("Initial pages, groups, and contents seeded successfully.")
		return nil
	})

	if err != nil {
		log.Fatalf("Seeding failed: %v", err)
	}
}
