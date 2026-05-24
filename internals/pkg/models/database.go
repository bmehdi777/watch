package models

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitializeDatabase() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	db.AutoMigrate(&SourceModel{})
	db.AutoMigrate(&ArticleModel{})
	db.AutoMigrate(&AIModel{})
	db.AutoMigrate(&LogModel{})

	return db
}
