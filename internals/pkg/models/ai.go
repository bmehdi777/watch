package models

type AiModel struct {
	BaseModel
	Name          string
	PrefixRequest string
	Enabled       bool
}

func (AiModel) TableName() string {
	return "ai_models"
}

type AiDTO struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	PrefixRequest string `json:"prefix_request"`
	Enabled       bool   `json:"enabled"`
}
