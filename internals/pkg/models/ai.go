package models

import "gorm.io/gorm"

type AIModel struct {
	BaseModel
	Name          string
	DisplayName   string
	PrefixRequest string
	Enabled       bool
}

func (AIModel) TableName() string {
	return "ai_models"
}
func (a *AIModel) BeforeCreate(tx *gorm.DB) error {
	if err := a.BaseModel.BeforeCreate(tx); err != nil {
		return err
	}

	if a.PrefixRequest == "" {
		a.PrefixRequest = "Please summarize the following article:"
	}

	return nil
}

type AILightDTO struct {
	Name          string `json:"name"`
	DisplayName   string `json:"display_name"`
	PrefixRequest string `json:"prefix_request"`
	Enabled       bool   `json:"enabled"`
}

type AIModelDTO struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	DisplayName   string `json:"display_name"`
	PrefixRequest string `json:"prefix_request"`
	Enabled       bool   `json:"enabled"`
}
