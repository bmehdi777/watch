package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)


type BaseModel struct {
	ID string `gorm:"type:text;primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (b *BaseModel) BeforeCreate(tx *gorm.DB) error {
	if b.ID == "" {
		b.ID = uuid.NewString()
	}
	return nil
}
