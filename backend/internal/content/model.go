package content

import "time"

type Page struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"type:varchar(255);not null;unique" json:"title"`
	Groups    []Group   `gorm:"foreignKey:PageID;constraint:OnDelete:CASCADE" json:"groups"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Group struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	PageID    uint      `gorm:"index;not null;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;references:ID" json:"page_id"`
	PageTitle string    `gorm:"not null" json:"page_title"`
	Name      string    `gorm:"type:varchar(100);not null" json:"name"`
	Contents  []Content `gorm:"foreignKey:GroupID;constraint:OnDelete:CASCADE" json:"contents"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Content struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	GroupID   uint      `gorm:"index;not null;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;references:ID" json:"group_id"`
	Type      string    `gorm:"type:varchar(30);not null" json:"type"` // เช่น "text", "vdo", "img", "ref"
	Value     string    `gorm:"type:text" json:"value"`
	TitleRef  []string  `gorm:"serializer:json" json:"title_ref"`
	Ref       []string  `gorm:"serializer:json" json:"ref"`
	RefType   string    `gorm:"type:varchar(30);" json:"ref_type"`
	UpdatedAt time.Time `json:"updated_at"`
}
