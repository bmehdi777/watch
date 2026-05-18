package models

type SourceModel struct {
	BaseModel
	Title   string
	BlogUrl string
	RSSUrl  string
	Enabled bool
}

type SourceDTO struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	BlogUrl string `json:"blog_url"`
	RSSUrl  string `json:"rss_url"`
	Enabled bool   `json:"enabled"`
}
