package models

import "time"

type ArticleModel struct {
	BaseModel
	Title         string
	Link          string
	Content       string
	PublishedDate time.Time
	Liked         bool
}

type ArticleLightDTO struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	Link          string    `json:"link"`
	PublishedDate time.Time `json:"published_date"`
	Liked         bool      `json:"liked"`
}

type ArticleDTO struct {
	ArticleLightDTO
	Content string `json:"content"`
}
