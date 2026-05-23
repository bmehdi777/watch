package api

import (
	"net/http"
	"watch/internals/pkg/crawler"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type CrawlerHandler struct {
	DB *gorm.DB
}

func NewCrawlerHandler(db *gorm.DB) *CrawlerHandler {
	return &CrawlerHandler{
		DB: db,
	}
}

func (c *CrawlerHandler) Routes(r chi.Router) {
	r.Post("/", c.refresh)
}

func (c *CrawlerHandler) refresh(w http.ResponseWriter, r *http.Request) {
	crawler.CrawlerController <- 1
}
