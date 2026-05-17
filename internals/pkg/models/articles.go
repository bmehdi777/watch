package models

import "time"

type ArticleModel struct {
	BaseModel
	Title         string
	Link          string
	Content       string
	PublishedDate time.Time
}

type ArticleLightDTO struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	Link  string `json:"link"`
}

type ArticleDTO struct {
	ArticleLightDTO
	Content string `json:"content"`
}
