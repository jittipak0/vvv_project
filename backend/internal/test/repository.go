package test

import (
	"log"
	"time"

	"gorm.io/gorm"
)

// TestRepository สำหรับ test/question/option
type TestRepository struct {
	DB *gorm.DB
}

func (r *TestRepository) CreateTest(test *Test) error {
	log.Printf("[Repository][CreateTest] Attempting to insert test: Title=%s", test.Title)

	// Insert the test
	if err := r.DB.Create(test).Error; err != nil {
		log.Printf("[Repository][CreateTest] Failed to insert test: Title=%s, Error=%v", test.Title, err)
		return err
	}

	log.Printf("[Repository][CreateTest] Test inserted successfully: Title=%s, ID=%d", test.Title, test.ID)
	return nil
}

func (r *TestRepository) GetTestByID(id uint) (*Test, error) {
	log.Printf("[Repository][GetTestByID] Retrieving test with ID %d", id)
	var test Test

	// Query the database for the test with preloaded questions and options
	if err := r.DB.Preload("Questions.Options").Where("id = ?", id).First(&test).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("[Repository][GetTestByID] Test with ID %d not found", id)
			return &Test{}, err
		}
		log.Printf("[Repository][GetTestByID] Error retrieving test with ID %d: %v", id, err)
		return &Test{}, err
	}

	log.Printf("[Repository][GetTestByID] Successfully retrieved test with ID %d", id)
	return &test, nil
}

func (r *TestRepository) GetTestByTitle(title string) (*Test, error) {
	log.Printf("[Repository][GetTestByTitle] Retrieving test with title %s", title)
	var test Test

	// Query the database for the test with preloaded questions and options
	if err := r.DB.Preload("Questions.Options").Where("title = ?", title).First(&test).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("[Repository][GetTestByTitle] Test with title %s not found", title)
			return &Test{}, err
		}
		log.Printf("[Repository][GetTestByTitle] Error retrieving test with title %s: %v", title, err)
		return &Test{}, err
	}

	log.Printf("[Repository][GetTestByTitle] Successfully retrieved test with title %s", title)
	return &test, nil
}

func (r *TestRepository) GetAllTests() ([]Test, error) {
	log.Println("[Repository][GetAllTests] Retrieving all tests")
	var tests []Test

	// Query all tests with preloaded questions and options
	if err := r.DB.Preload("Questions.Options").Find(&tests).Error; err != nil {
		log.Printf("[Repository][GetAllTests] Error retrieving tests: %v", err)
		return nil, err
	}

	log.Printf("[Repository][GetAllTests] Successfully retrieved %d tests", len(tests))
	return tests, nil
}

func (r *TestRepository) DeleteTestByID(id uint) error {
	log.Printf("[Repository][DeleteTestByID] Deleting test with ID %d", id)

	// ลบ Test โดย ID
	if err := r.DB.Where("id = ?", id).Delete(&Test{}).Error; err != nil {
		log.Printf("[Repository][DeleteTestByID] Failed to delete test with ID %d: %v", id, err)
		return err
	}

	log.Printf("[Repository][DeleteTestByID] Test with ID %d deleted successfully", id)
	return nil
}

func (r *TestRepository) UpdateTest(testID uint, updatedTest *Test) error {
	log.Printf("[TestRepository][UpdateTest] Deleting all questions and options for TestID=%d", testID)

	return r.DB.Transaction(func(tx *gorm.DB) error {
		// 1️⃣ ลบ Options ก่อน เพื่อลบ Foreign Key Constraint
		if err := tx.Where("question_id IN (SELECT id FROM questions WHERE test_id = ?)", testID).Delete(&Option{}).Error; err != nil {
			log.Printf("[TestRepository][UpdateTest] Failed to delete options for TestID=%d: %v", testID, err)
			return err
		}

		// 2️⃣ ลบ Questions
		if err := tx.Where("test_id = ?", testID).Delete(&Question{}).Error; err != nil {
			log.Printf("[TestRepository][UpdateTest] Failed to delete questions for TestID=%d: %v", testID, err)
			return err
		}

		// 3️⃣ อัปเดตข้อมูล Test
		log.Printf("[TestRepository][UpdateTest] Updating test metadata for TestID=%d", testID)
		if err := tx.Model(&Test{}).Where("id = ?", testID).Updates(map[string]interface{}{
			"title":        updatedTest.Title,
			"updated_at":   time.Now(),
			"total_points": updatedTest.TotalPoints,
		}).Error; err != nil {
			log.Printf("[TestRepository][UpdateTest] Failed to update test metadata for TestID=%d: %v", testID, err)
			return err
		}

		// 4️⃣ เพิ่ม Questions ใหม่ทั้งหมด
		for i := range updatedTest.Questions {
			updatedTest.Questions[i].TestID = testID
			updatedTest.Questions[i].ID = 0 // **ให้ Database กำหนดค่า ID ใหม่**

			if err := tx.Create(&updatedTest.Questions[i]).Error; err != nil {
				log.Printf("[TestRepository][UpdateTest] Failed to create new question: %v", err)
				return err
			}
		}

		log.Printf("[TestRepository][UpdateTest] Successfully updated test with ID=%d", testID)
		return nil
	})
}