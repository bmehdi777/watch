package models

type ArticleModel struct {
	BaseModel
	Title         string
	Link          string
	Description   string
	PublishedDate string
	Liked         bool
	ReadLater     bool
	Guid          string
}

func (ArticleModel) TableName() string {
	return "articles"
}

type ArticleLightDTO struct {
	ID            string `json:"id"`
	Title         string `json:"title"`
	Link          string `json:"link"`
	PublishedDate string `json:"published_date"`
	Liked         bool   `json:"liked"`
	ReadLater     bool   `json:"read_later"`
}

type ArticleDTO struct {
	ArticleLightDTO
	Content string `json:"content"`
}
