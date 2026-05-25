package models

type ArticleModel struct {
	BaseModel
	Title         string
	Link          string
	Content       string
	Description   string
	Tldr          string
	TldrGenerated bool
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
	Description   string `json:"description"`
	PublishedDate string `json:"published_date"`
	Liked         bool   `json:"liked"`
	ReadLater     bool   `json:"read_later"`
	TldrGenerated bool   `json:"tldr_generated"`
}

type ArticleDTO struct {
	ArticleLightDTO
	Content string `json:"content"`
	Tldr    string `json:"tldr"`
}

type TldrDTO struct {
	Force bool `json:"force"`
}

type ArticlePatchDTO struct {
	Liked     *bool `json:"liked"`
	ReadLater *bool `json:"read_later"`
}
