package models

type SourceModel struct {
	BaseModel
	Title   string
	URL     string
	Enabled bool
}

type SourceDTO struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	URL     string `json:"url"`
	Enabled bool   `json:"enabled"`
}
