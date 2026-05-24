package models

type SourceModel struct {
	BaseModel
	Title   string
	BlogUrl string
	RSSUrl  string
	Image   string
	Enabled bool
}

func (SourceModel) TableName() string {
	return "sources"
}

type SourceDTO struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	BlogUrl string `json:"blog_url"`
	RSSUrl  string `json:"rss_url"`
	Image   string `json:"image"`
	Enabled bool   `json:"enabled"`
}
