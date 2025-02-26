package test

import "time"

type Test struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Title       string     `gorm:"type:varchar(255);not null;unique" json:"title"`
	Questions   []Question `gorm:"foreignKey:TestID;constraint:OnDelete:CASCADE;" json:"questions"`
	TotalPoints int        `gorm:"default:0" json:"total_points"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type Question struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	TestID         uint      `gorm:"not null" json:"test_id"` // Foreign Key
	Text           string    `gorm:"type:text;not null" json:"text"`
	Points         float64   `gorm:"default:0" json:"points"`
	IsMultiCorrect bool      `gorm:"default:false" json:"is_multi_correct"`
	Options        []Option  `gorm:"foreignKey:QuestionID;constraint:OnDelete:CASCADE;" json:"options"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Option struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	QuestionID uint      `gorm:"not null" json:"question_id"` // Foreign Key
	Text       string    `gorm:"type:text;not null" json:"text"`
	IsCorrect  bool      `gorm:"default:false" json:"is_correct"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type TestSubmission struct {
	UserID      uint          `json:"user_id"`
	TestID      uint          `json:"test_id"`
	TestTitle   string        `json:"test_title"`
	TotalPoints int           `json:"total_points"`
	Answers     []UserAnswers `json:"answers"`
}

type UserAnswers struct {
	QuestionID      uint   `json:"question_id"`
	SelectedOptions []uint `json:"selected_options"`
}

// ================================================
// ================== response ====================
// ================================================

type TestResponse struct {
	ID        uint               `json:"id"`
	Title     string             `json:"title"`
	Questions []QuestionResponse `json:"questions"`
}

type QuestionResponse struct {
	ID             uint             `json:"id"`
	TestID         uint             `json:"test_id"`
	Text           string           `json:"text"`
	Points         float64          `json:"points"`
	IsMultiCorrect bool             `json:"is_multi_correct"`
	Options        []OptionResponse `json:"options"`
}

type OptionResponse struct {
	ID         uint   `json:"id"`
	QuestionID uint   `json:"question_id"`
	Text       string `json:"text"`
}
