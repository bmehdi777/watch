package models

import "gorm.io/gorm"

type LogModel struct {
	BaseModel
	Level   string
	Message string
}

func (LogModel) TableName() string {
	return "logs"
}

func LogInfo(db *gorm.DB, msg string) error {
	log := LogModel{
		Level:   "info",
		Message: msg,
	}

	tx := db.Create(&log)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

func LogError(db *gorm.DB, msg string) error {
	log := LogModel{
		Level: "error",
		Message: msg,
	}

	tx := db.Create(&log)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

func LogWarn(db *gorm.DB, msg string) error {
	log := LogModel{
		Level: "warn",
		Message: msg,
	}

	tx := db.Create(&log)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

type LogLightDTO struct {
	ID      string `json:"id"`
	Level   string `json:"level"`
	Message string `json:"message"`
}
