package test

import (
	"fmt"
	"log"
	"vvv_backend/internal/user"
)

type TestService struct {
	Repository  *TestRepository
	UserService UserServiceInterface
}

// CreateTest - Logic สำหรับสร้าง Test
func (s *TestService) CreateTest(test *Test) error {
	log.Printf("[TestService][CreateTest] Creating test: Title=%s", test.Title)

	// Call repository to create test
	err := s.Repository.CreateTest(test)
	if err != nil {
		log.Printf("[TestService][CreateTest] Failed to create test: Title=%s, Error=%v", test.Title, err)
		return err
	}

	log.Printf("[TestService][CreateTest] Successfully created test with ID=%d, Title=%s", test.ID, test.Title)
	return nil
}

// GetTestByID - Logic สำหรับดึง Test ตาม ID
func (s *TestService) GetTestByID(testID uint) (*TestResponse, error) {
	log.Printf("[TestService][GetTestByID] Fetching test with ID=%d", testID)

	// Call repository to get test by ID
	test, err := s.Repository.GetTestByID(testID)
	if err != nil {
		log.Printf("[TestService][GetTestByID] Test not found for ID=%d: %v", testID, err)
		return nil, err
	}

	testResponse := convertTestToResponse(test)
	log.Printf("[TestService][GetTestByID] Successfully retrieved test with ID=%d", testID)
	return &testResponse, nil
}

// GetTestByTitle - Logic สำหรับดึง Test ตาม Title
func (s *TestService) GetTestByTitle(title string) (*TestResponse, error) {
	log.Printf("[TestService][GetTestByTitle] Fetching test with Title=%s", title)

	// Call repository to get test by title
	test, err := s.Repository.GetTestByTitle(title)
	if err != nil {
		log.Printf("[TestService][GetTestByTitle] Test not found for Title=%s: %v", title, err)
		return nil, err
	}

	testResponse := convertTestToResponse(test)
	log.Printf("[TestService][GetTestByTitle] Successfully retrieved test with Title=%s", title)
	return &testResponse, nil
}

// AdminGetTestByID - Logic สำหรับดึง Test ตาม ID
func (s *TestService) AdminGetTestByID(testID uint) (*Test, error) {
	log.Printf("[TestService][AdminGetTestByID] Fetching test with ID=%d", testID)

	// Call repository to get test by ID
	test, err := s.Repository.GetTestByID(testID)
	if err != nil {
		log.Printf("[TestService][AdminGetTestByID] Test not found for ID=%d: %v", testID, err)
		return nil, err
	}

	log.Printf("[TestService][AdminGetTestByID] Successfully retrieved test with ID=%d", testID)
	return test, nil
}

// AdminGetTestByTitle - Logic สำหรับดึง Test ตาม Title
func (s *TestService) AdminGetTestByTitle(title string) (*Test, error) {
	log.Printf("[TestService][AdminGetTestByTitle] Fetching test with Title=%s", title)

	// Call repository to get test by title
	test, err := s.Repository.GetTestByTitle(title)
	if err != nil {
		log.Printf("[TestService][AdminGetTestByTitle] Test not found for Title=%s: %v", title, err)
		return nil, err
	}

	log.Printf("[TestService][AdminGetTestByTitle] Successfully retrieved test with Title=%s", title)
	return test, nil
}

// UpdateTest - Logic สำหรับอัปเดต Test
func (s *TestService) UpdateTest(testID uint, updatedTest *Test) error {
	log.Printf("[TestService][UpdateTest] Updating test with ID=%d", testID)

	// Call repository to update the test
	err := s.Repository.UpdateTest(testID, updatedTest)
	if err != nil {
		log.Printf("[TestService][UpdateTest] Failed to update test with ID=%d: %v", testID, err)
		return err
	}

	log.Printf("[TestService][UpdateTest] Successfully updated test with ID=%d", testID)
	return nil
}

// ฟังก์ชันสำหรับคำนวณคะแนน
func (s *TestService) CalculateScore(testID uint, userAnswers []UserAnswers) (float64, error) {
	log.Printf("[TestService][CalculateScore] Calculating score for TestID=%d", testID)

	// ดึงข้อมูล Test จาก Repository
	test, err := s.Repository.GetTestByID(testID)
	if err != nil {
		log.Printf("[TestService][CalculateScore] Failed to fetch test with ID=%d: %v", testID, err)
		return 0, err
	}

	var score float64 = 0.0

	// ตรวจสอบคำตอบของผู้ใช้
	for _, userAnswer := range userAnswers {
		for _, question := range test.Questions {
			if question.ID == userAnswer.QuestionID {
				correctOptions := make(map[uint]bool)
				for _, option := range question.Options {
					if option.IsCorrect {
						correctOptions[option.ID] = true
					}
				}

				// ตรวจสอบว่าคำตอบตรงกับตัวเลือกที่ถูกต้อง
				isCorrect := len(correctOptions) == len(userAnswer.SelectedOptions)
				for _, selectedOption := range userAnswer.SelectedOptions {
					if !correctOptions[selectedOption] {
						isCorrect = false
					}
				}

				if isCorrect {
					score += float64(question.Points)
				}
				break
			}
		}
	}

	log.Printf("[TestService][CalculateScore] User scored %.2f points on TestID=%d", score, testID)
	return score, nil
}

// ฟังก์ชันบันทึกผลสอบของผู้ใช้
func (s *TestService) SubmitTest(testSubmission TestSubmission) (*user.User, float64, error) {
	log.Printf("[TestService][SubmitTest] Received test submission for UserID=%d, TestID=%d", testSubmission.UserID, testSubmission.TestID)

	// ตรวจสอบว่ามีคำตอบส่งมาหรือไม่
	if len(testSubmission.Answers) == 0 {
		log.Printf("[TestService][SubmitTest] No answers provided for UserID=%d, TestID=%d", testSubmission.UserID, testSubmission.TestID)
		return nil, 0, fmt.Errorf("no answers provided")
	}

	// คำนวณคะแนน
	score, err := s.CalculateScore(testSubmission.TestID, testSubmission.Answers)
	if err != nil {
		log.Printf("[TestService][SubmitTest] Failed to calculate score for UserID=%d, TestID=%d: %v", testSubmission.UserID, testSubmission.TestID, err)
		return nil, 0, err
	}

	// อัปเดตคะแนนในตาราง User
	user, err := s.UserService.UpdateScore(testSubmission.UserID, testSubmission.TestTitle, testSubmission.TotalPoints, score)
	if err != nil {
		log.Printf("[TestService][SubmitTest] Failed to update user score for UserID=%d, TestTitle=%s: %v", testSubmission.UserID, testSubmission.TestTitle, err)
		return nil, 0, err
	}

	log.Printf("[TestService][SubmitTest] Test submitted successfully for UserID=%d, TestID=%d with Score=%.2f", testSubmission.UserID, testSubmission.TestID, score)
	return user, score, nil
}

func convertTestToResponse(test *Test) TestResponse {
	log.Printf("[TestService][convertTestToResponse] Converting test to response format, TestID=%d", test.ID)
	return TestResponse{
		ID:        test.ID,
		Title:     test.Title,
		Questions: convertQuestionsToResponse(test.Questions),
	}
}

func convertQuestionsToResponse(questions []Question) []QuestionResponse {
	log.Printf("[TestService][convertQuestionsToResponse] Converting %d questions to response format", len(questions))
	var questionResponses []QuestionResponse
	for _, q := range questions {
		questionResponses = append(questionResponses, QuestionResponse{
			ID:             q.ID,
			TestID:         q.TestID,
			Text:           q.Text,
			Points:         q.Points,
			IsMultiCorrect: q.IsMultiCorrect,
			Options:        convertOptionsToResponse(q.Options),
		})
	}
	return questionResponses
}

func convertOptionsToResponse(options []Option) []OptionResponse {
	log.Printf("[TestService][convertOptionsToResponse] Converting %d options to response format", len(options))
	var optionResponses []OptionResponse
	for _, o := range options {
		optionResponses = append(optionResponses, OptionResponse{
			ID:         o.ID,
			QuestionID: o.QuestionID,
			Text:       o.Text,
		})
	}
	return optionResponses
}
