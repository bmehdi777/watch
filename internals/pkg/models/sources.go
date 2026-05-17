package models

type SourceModel struct {
	BaseModel
	Title   string
	URL     string
	Enabled bool
}

type SourceDTO struct {
	Title   string `json:"title"`
	ID      string `json:"id"`
	URL     string `json:"url"`
	Enabled bool   `json:"enabled"`
}
