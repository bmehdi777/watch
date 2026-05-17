package api

import (
	"context"
	"net/http"
	"watch/internals/pkg/models"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type ArticleHandler struct {
	DB *gorm.DB
}

func NewArticleHandler(db *gorm.DB) *ArticleHandler {
	return &ArticleHandler{
		DB: db,
	}
}

func (a *ArticleHandler) Routes(r chi.Router) {
	r.Get("/", a.getMany)
	r.Group(func(r chi.Router) {
		r.Use(a.articleCtx)
		r.Get("/{articleID}", a.getOne)
	})
}

func (a *ArticleHandler) getMany(w http.ResponseWriter, r *http.Request) {}
func (a *ArticleHandler) getOne(w http.ResponseWriter, r *http.Request)  {}

func (a *ArticleHandler) articleCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		articleID := chi.URLParam(r, "articleID")

		var article models.ArticleModel
		tx := a.DB.First(&article, "ID = ?", articleID)

		if tx.Error != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		ctx := context.WithValue(r.Context(), "article", &article)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
