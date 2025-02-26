package user

import (
	"encoding/json"
	"log"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func (r *UserRepository) InsertUser(user *User) error {
	log.Printf("[UserRepository][InsertUser] Inserting user with data: Email=%s, Role=%s, FName=%s, LName=%s, StudentID=%v",
		user.Email, user.Role, user.FName, user.LName, user.StudentID)

	// ใช้ GORM สร้างแถวใหม่ (row) ในตารางจาก struct User
	if err := r.DB.Create(user).Error; err != nil {
		log.Printf("[UserRepository][InsertUser] Failed to insert user %s: %v", user.Email, err)
		return err
	}

	log.Printf("[UserRepository][InsertUser] User %s inserted successfully", user.Email)
	return nil
}

func (r *UserRepository) GetUserByID(userID uint) (*User, error) {
	var user User

	log.Printf("[UserRepository][GetUserByID] Retrieving user with ID %d", userID)
	if err := r.DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("[UserRepository][GetUserByID] User with ID %d not found", userID)
			return nil, err
		}
		log.Printf("[UserRepository][GetUserByID] Failed to get user with ID %d: %v", userID, err)
		return nil, err
	}

	log.Printf("[UserRepository][GetUserByID] User with ID %d retrieved successfully", userID)
	return &user, nil
}

func (r *UserRepository) GetUsersByRole(role Role) ([]User, error) {
	log.Printf("[UserRepository][GetUsersByRole] Retrieving all users with role: %s", role)
	var users []User

	if err := r.DB.Where("role = ?", role).Find(&users).Error; err != nil {
		log.Printf("[UserRepository][GetUsersByRole] Failed to retrieve users with role %s: %v", role, err)
		return nil, err
	}

	log.Printf("[UserRepository][GetUsersByRole] Successfully retrieved %d users with role %s", len(users), role)
	return users, nil
}

func (r *UserRepository) GetUserByEmail(email string) (*User, error) {
	var user User

	log.Printf("[UserRepository][GetUserByEmail] Retrieving user with email: %s", email)
	if err := r.DB.Where("LOWER(email) = ?", strings.ToLower(email)).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("[UserRepository][GetUserByEmail] User with email %s not found", email)
			return nil, err
		}
		log.Printf("[UserRepository][GetUserByEmail] Failed to get user with email %s: %v", email, err)
		return nil, err
	}

	log.Printf("[UserRepository][GetUserByEmail] User with email %s retrieved successfully", email)
	return &user, nil
}

func (r *UserRepository) GetAllUsers(limit, offset int) ([]User, error) {
	log.Printf("[UserRepository][GetAllUsers] Retrieving all users...")
	var users []User

	if err := r.DB.Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		log.Printf("[UserRepository][GetAllUsers] Failed to retrieve all users: %v", err)
		return nil, err
	}

	log.Printf("[UserRepository][GetAllUsers] Successfully retrieved %d users", len(users))
	return users, nil
}

func (r *UserRepository) UpdateUserFields(userID uint, updateData map[string]interface{}) error {
	log.Printf("[UserRepository][UpdateUserFields] Updating fields for user ID %d", userID)

	// ดึงข้อมูล user จาก database
	var existingUser User
	if err := r.DB.First(&existingUser, userID).Error; err != nil {
		log.Printf("[UserRepository][UpdateUserFields] User ID %d not found: %v", userID, err)
		return err
	}

	// ลบฟิลด์ที่ไม่ควรเปลี่ยน
	delete(updateData, "id")
	delete(updateData, "created_at")
	delete(updateData, "pre_test_date")
	delete(updateData, "post_test_date")

	// ตรวจสอบและอัปเดตรหัสผ่าน
	if newPassword, ok := updateData["password"].(string); ok && newPassword != "" {
		if err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(newPassword)); err != nil {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
			if err != nil {
				log.Printf("[UserRepository][UpdateUserFields] Failed to hash password: %v", err)
				return err
			}
			updateData["password"] = string(hashedPassword)
		} else {
			delete(updateData, "password")
		}
	}

	// อัปเดต `visited_page`
	if newPages, ok := updateData["visited_page"].([]interface{}); ok {
		var updatedPages []string
		for _, page := range newPages {
			if strPage, ok := page.(string); ok {
				updatedPages = append(updatedPages, strPage)
			}
		}

		jsonPages, err := json.Marshal(updatedPages) //  แปลงเป็น JSON string
		if err != nil {
			log.Printf("[UserRepository][UpdateUserFields] Failed to serialize visited_page: %v", err)
			return err
		}
		updateData["visited_page"] = string(jsonPages) //  เก็บในรูปแบบ JSON
	}

	// อัปเดตเฉพาะฟิลด์ที่มีการเปลี่ยนแปลง
	if err := r.DB.Model(&existingUser).Updates(updateData).Error; err != nil {
		log.Printf("[UserRepository][UpdateUserFields] Failed to update user ID %d: %v", userID, err)
		return err
	}

	log.Printf("[UserRepository][UpdateUserFields] Successfully updated fields for user ID %d", userID)
	return nil
}

func (r *UserRepository) DeleteUser(id uint) error {
	log.Printf("[UserRepository][DeleteUser] Deleting user with ID %d", id)

	if err := r.DB.Delete(&User{}, id).Error; err != nil {
		log.Printf("[UserRepository][DeleteUser] Failed to delete user with ID %d: %v", id, err)
		return err
	}

	log.Printf("[UserRepository][DeleteUser] User with ID %d deleted successfully", id)
	return nil
}

func (r *UserRepository) DeleteUsersByIDs(userIDs []uint) error {
	log.Printf("[UserRepository][DeleteUsersByIDs] Deleting users with IDs: %v", userIDs)

	if err := r.DB.Where("id IN ?", userIDs).Delete(&User{}).Error; err != nil {
		log.Printf("[UserRepository][DeleteUsersByIDs] Failed to delete users with IDs: %v: %v", userIDs, err)
		return err
	}

	return nil
}

func (r *UserRepository) UpdateProgress(userID uint, progress int, page string) (*User, error) {
	log.Printf("[UserRepository][UpdateProgress] Updating progress for user ID %d", userID)

	var user User
	if err := r.DB.First(&user, userID).Error; err != nil {
		log.Printf("[UserRepository][UpdateProgress] User with ID %d not found: %v", userID, err)
		return nil, err
	}

	// ตรวจสอบว่าหน้านี้ถูกบันทึกไปแล้วหรือยัง
	for _, visited := range user.VisitedPage {
		if visited == page {
			log.Printf("[UserRepository][UpdateProgress] Page '%s' already visited by user ID %d", page, userID)
			// อัปเดต progress แต่ไม่เพิ่ม page ซ้ำ
			err := r.DB.Model(&user).Update("total_progress", progress).Error
			return &user, err
		}
	}

	// เพิ่ม page ลงใน slice
	user.VisitedPage = append(user.VisitedPage, page)

	// อัปเดตค่าในฐานข้อมูล
	if err := r.DB.Model(&user).
		Updates(map[string]interface{}{
			"total_progress": progress,
			"visited_page":   user.VisitedPage,
		}).Error; err != nil {
		log.Printf("[UserRepository][UpdateProgress] Failed to update progress for user ID %d: %v", userID, err)
		return nil, err
	}

	log.Printf("[UserRepository][UpdateProgress] Successfully updated progress for user ID %d", userID)
	return &user, nil
}

func (r *UserRepository) UpdateScorePretest(userID uint, score float64) (*User, error) {
	log.Printf("[UserRepository][UpdateScorePretest] Updating pretest score for user ID %d", userID)

	now := time.Now()

	if err := r.DB.
		Table("users").
		Where("id = ?", userID).
		Updates(map[string]interface{}{
			"pre_test_score": score,
			"pre_test_date":  now,
		}).Error; err != nil {
		log.Printf("[UserRepository][UpdateScorePretest] Failed to update pretest score for user ID %d: %v", userID, err)
		return nil, err
	}

	log.Printf("[UserRepository][UpdateScorePretest] Successfully updated pretest score for user ID %d", userID)

	var user User
	if err := r.DB.First(&user, userID).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) UpdateScorePosttest(userID uint, score float64, postTestPass bool) (*User, error) {
	log.Printf("[UserRepository][UpdateScorePosttest] Updating posttest score for user ID %d", userID)

	var user User
	if err := r.DB.First(&user, userID).Error; err != nil {
		log.Printf("[UserRepository][UpdateScorePosttest] User not found for ID %d: %v", userID, err)
		return nil, err
	}

	// ตรวจสอบว่าค่าปัจจุบันเป็น NULL หรือไม่
	if user.PostTestDate == nil || user.PostTestScore == nil {
		log.Printf("[UserRepository][UpdateScorePosttest] No existing posttest score. Updating for the first time.")

		// อัปเดตค่า post_test_score, post_test_date, post_test_pass
		updateData := map[string]interface{}{
			"post_test_score":         score,
			"post_test_date":          time.Now(),
			"post_test_pass":          postTestPass,
			"highest_post_test_score": score,
			"highest_post_test_date":  time.Now(),
		}

		if err := r.DB.Model(&user).Updates(updateData).Error; err != nil {
			log.Printf("[UserRepository][UpdateScorePosttest] Failed to update posttest score for user ID %d: %v", userID, err)
			return nil, err
		}

	} else if score > *user.PostTestScore {
		log.Printf("[UserRepository][UpdateScorePosttest] New score is higher. Updating highest score record.")

		// อัปเดตค่า highest_post_test_score, highest_post_test_date, และ post_test_pass
		updateData := map[string]interface{}{
			"highest_post_test_score": score,
			"highest_post_test_date":  time.Now(),
			"post_test_pass":          postTestPass,
		}

		if err := r.DB.Model(&user).Updates(updateData).Error; err != nil {
			log.Printf("[UserRepository][UpdateScorePosttest] Failed to update highest posttest score for user ID %d: %v", userID, err)
			return nil, err
		}
	} else {
		log.Printf("[UserRepository][UpdateScorePosttest] New score is not higher. No update required.")
	}

	// ดึงข้อมูลล่าสุดหลังอัปเดต
	if err := r.DB.First(&user, userID).Error; err != nil {
		log.Printf("[UserRepository][UpdateScorePosttest] Failed to fetch updated user data for ID %d: %v", userID, err)
		return nil, err
	}

	log.Printf("[UserRepository][UpdateScorePosttest] Successfully updated posttest score for user ID %d", userID)
	return &user, nil
}

func (r *UserRepository) UpdateSatisfactionSurvey(userID uint, surveyData map[string]interface{}) (*User, error) {
	log.Printf("[UserRepository][UpdateSatisfactionSurvey] Updating satisfaction survey for user ID %d", userID)

	// หา user ใน database
	var user User
	if err := r.DB.First(&user, userID).Error; err != nil {
		log.Printf("[UserRepository][UpdateSatisfactionSurvey] User with ID %d not found: %v", userID, err)
		return nil, err
	}

	// อัปเดตค่า SatisfactionSurvey
	user.SatisfactionSurvey = surveyData

	// บันทึกลง DB
	if err := r.DB.Save(&user).Error; err != nil {
		log.Printf("[UserRepository][UpdateSatisfactionSurvey] Failed to update survey for user ID %d: %v", userID, err)
		return nil, err
	}

	log.Printf("[UserRepository][UpdateSatisfactionSurvey] Successfully updated survey for user ID %d", userID)
	return &user, nil
}
