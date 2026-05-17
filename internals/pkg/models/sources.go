package models

type SourceModel struct {
	BaseModel
	URL      string
	Enabled  bool
}

type SourceDTO struct {
	ID string `json:"id"`
	URL string `json:"url"`
	Enabled bool `json:"enabled"`
}
