package user

import (
	"errors"
	"log"
	"strings"

	// "vvv_backend/internal/auth"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	Repository *UserRepository
}

func (s *UserService) SignUp(user *User) error {
	log.Printf("[UserService][SignUp] SignUping user with email: %s", user.Email)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("[UserService][SignUp] Failed to hash password for user %s: %v", user.Email, err)
		return err
	}

	user.Email = strings.TrimSpace(user.Email)
	user.Password = strings.TrimSpace(user.Password)
	user.Password = string(hashedPassword)
	user.FName = strings.TrimSpace(user.FName)
	user.LName = strings.TrimSpace(user.LName)

	if err := s.Repository.InsertUser(user); err != nil {
		log.Printf("[UserService][SignUp] Failed to create user %s: %v", user.Email, err)
		return err
	}

	log.Printf("[UserService][SignUp] User %s registered successfully", user.Email)
	return nil
}

func (s *UserService) GetAllUsers(limit, offset int) ([]User, error) {
	log.Printf("[UserService][GetAllUsers] Fetching all users from the database")

	users, err := s.Repository.GetAllUsers(limit, offset)
	if err != nil {
		log.Printf("[UserService][GetAllUsers] Error fetching users: %v", err)
		return nil, err
	}

	return users, nil
}

func (s *UserService) GetUserByID(userID uint) (*User, error) {
	log.Printf("[UserService][GetUserByID] Fetching user with ID: %d", userID)

	user, err := s.Repository.GetUserByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("[UserService][GetUserByID] User ID %d not found", userID)
			return nil, err
		}
		log.Printf("[UserService][GetUserByID] Error fetching user ID %d: %v", userID, err)
		return nil, err
	}

	log.Printf("[UserService][GetUserByID] Successfully fetched user: ID=%d, Email=%s", user.ID, user.Email)
	return user, nil
}

func (s *UserService) GetUserByEmail(userEmail string) (*User, error) {
	log.Printf("[UserService][GetUserByEmail] Fetching user with Email: %s", userEmail)

	user, err := s.Repository.GetUserByEmail(userEmail)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("[UserService][GetUserByEmail] User Email %s not found", userEmail)
			return nil, err
		}
		log.Printf("[UserService][GetUserByEmail] Error fetching user Email %s: %v", userEmail, err)
		return nil, err
	}

	log.Printf("[UserService][GetUserByEmail] Successfully fetched user: Email=%s", user.Email)
	return user, nil
}

func (s *UserService) GetUserProgress(userID uint) (ProgressResponse, error) {
	log.Printf("[UserService][GetUserProgress] Fetching progress for user ID: %d", userID)

	user, err := s.Repository.GetUserByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("[UserService][GetUserProgress] User ID %d not found", userID)
			return ProgressResponse{}, err
		}
		log.Printf("[UserService][GetUserProgress] Error fetching user ID %d: %v", userID, err)
		return ProgressResponse{}, err
	}

	// ประกาศ response ก่อนใช้งาน
	response := ProgressResponse{
		TotalProgress: user.TotalProgress,
		Tutorial:      user.Tutorial,
	}

	log.Printf("[UserService][GetUserProgress] Successfully fetched progress for user ID=%d", user.ID)
	return response, nil
}

func (s *UserService) GetUsersByRole(role Role) ([]User, error) {
	log.Printf("[UserService][GetUsersByRole] Fetching users with role: %s", role)

	users, err := s.Repository.GetUsersByRole(role)
	if err != nil {
		log.Printf("[UserService][GetUsersByRole] Error fetching users by role %s: %v", role, err)
		return nil, err
	}

	return users, nil
}

func (s *UserService) UpdateUser(userID uint, updateData map[string]interface{}) (*User, error) {
	log.Printf("[UserService][UpdateUser] Updating user ID %d", userID)

	log.Printf("[UserService][UpdateUser] updateData %v", updateData)

	// ส่งเฉพาะฟิลด์ที่ต้องการอัปเดตไปที่ Repository
	if err := s.Repository.UpdateUserFields(userID, updateData); err != nil {
		log.Printf("[UserService][UpdateUser] Failed to update user ID %d: %v", userID, err)
		return nil, err
	}

	log.Printf("[UserService][UpdateUser] Successfully updated user ID %d", userID)

	// ดึงข้อมูลใหม่หลังอัปเดต
	user, err := s.Repository.GetUserByID(userID)
	if err != nil {
		log.Printf("[UserService][UpdateUser] User ID %d not found: %v", userID, err)
		return nil, err
	}

	return user, nil
}

func (s *UserService) DeleteUser(userID uint) error {
	log.Printf("[UserService][DeleteUser] Deleting user with ID: %d", userID)

	_, err := s.Repository.GetUserByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("[UserService][DeleteUser] User with ID %d not found", userID)
			return errors.New("user not found")
		}
		log.Printf("[UserService][DeleteUser] Error fetching user with ID %d: %v", userID, err)
		return err
	}

	if err := s.Repository.DeleteUser(userID); err != nil {
		log.Printf("[UserService][DeleteUser] Error deleting user ID %d: %v", userID, err)
		return err
	}

	return nil
}

func (s *UserService) DeleteMultipleUsers(userIDs []uint) error {
	log.Printf("[UserService][DeleteMultipleUsers] Deleting users: %v", userIDs)

	err := s.Repository.DeleteUsersByIDs(userIDs)
	if err != nil {
		log.Printf("[UserService][DeleteMultipleUsers] Error deleting users: %v", err)
		return err
	}

	log.Printf("[UserService][DeleteMultipleUsers] Deleted %v users successfully", userIDs)
	return nil
}

func (s *UserService) UpdateSatisfactionSurvey(userID uint, surveyData map[string]interface{}) (*User, error) {
	log.Printf("[UserService][UpdateSatisfactionSurvey] Updating satisfaction survey for user ID %d", userID)

	user, err := s.Repository.UpdateSatisfactionSurvey(userID, surveyData)
	if err != nil {
		log.Printf("[UserService][UpdateSatisfactionSurvey] Failed to update satisfaction survey for user ID %d: %v", userID, err)
		return nil, err
	}
	log.Printf("[UserService][UpdateSatisfactionSurvey] Successfully updated satisfaction survey for user ID %d", userID)
	return user, nil
}

// * สำหรับ Implement Interface

func (s *UserService) AuthGetUserByEmail(email string) (*User, error) {
	log.Printf("[UserService][AuthGetUserByEmail] Fetching user with email: %s", email)

	user, err := s.Repository.GetUserByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("[UserService][GetUserByEmail] User Email %s not found", email)
			return nil, err
		}
		log.Printf("[UserService][GetUserByEmail] Error fetching user Email %s: %v", email, err)
		return nil, err
	}

	return user, nil
}

func (s *UserService) UpdateProgress(userID uint, progress int, page string) (*User, error) {
	log.Printf("[UserService][UpdateProgress] Updating progress user with ID %d", userID)

	user, err := s.Repository.UpdateProgress(userID, progress, page)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (s *UserService) UpdateScore(userID uint, testTitle string, totalPoints int, score float64) (*User, error) {
	log.Printf("[UserService][UpdateScore] Updating score for user ID %d", userID)

	var (
		user *User // เพิ่มการประกาศตัวแปร user ก่อนใช้งาน
		err  error
	)

	// ตรวจสอบว่าเป็น pre-test หรือ post-test
	if strings.ToLower(testTitle) == "pre-test" {
		user, err = s.Repository.UpdateScorePretest(userID, score)
	} else {
		var postTestPass bool
		if score < (float64(totalPoints) * 0.8) {
			postTestPass = false
		} else {
			postTestPass = true
		}
		user, err = s.Repository.UpdateScorePosttest(userID, score, postTestPass)
	}

	if err != nil {
		log.Printf("[UserService][UpdateScore] Failed to update score for user ID %d: %v", userID, err)
		return nil, err
	}

	log.Printf("[UserService][UpdateScore] Successfully updated score for user ID %d", userID)
	return user, nil
}
