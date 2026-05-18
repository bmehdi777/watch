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
	// r.Post("/", a.create)
	r.Group(func(r chi.Router) {
		r.Use(a.articleCtx)
		r.Get("/{articleID}", a.getOne)
	})
}

func (a *ArticleHandler) getMany(w http.ResponseWriter, r *http.Request) {
	var articles []models.ArticleModel
	tx := a.DB.Find(&articles)
	if tx.Error != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	articlesLight := make([]models.ArticleLightDTO, len(articles))

	for i, articleModel := range articles {
		articlesLight[i] = models.ArticleLightDTO{
			ID:    articleModel.ID,
			Title: articleModel.Title,
			Link:  articleModel.Link,
			Liked: articleModel.Liked,
		}
	}

	err := encodeJSON(w, r, http.StatusOK, &articlesLight)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
}

func (a *ArticleHandler) getOne(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	article, ok := ctx.Value("article").(*models.ArticleModel)
	if !ok {
		http.Error(w, http.StatusText(422), 422)
		return
	}

	err := encodeJSON(w, r, http.StatusOK, &article)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

// Debug purpose only
// func (a *ArticleHandler) create(w http.ResponseWriter, r *http.Request) {
// 	articleDTO, err := decodeJSON[models.ArticleDTO](r)
// 	if err != nil {
// 		http.Error(w, http.StatusText(400), 400)
// 		return
// 	}
//
// 	article := models.ArticleModel{
// 		Title: articleDTO.Title,
// 		Link: articleDTO.Title,
// 		Content: "",
// 		PublishedDate: time.Now(),
// 		Liked: articleDTO.Liked,
// 	}
//
// 	a.DB.Create(&article)
//
// 	w.WriteHeader(200)
// }

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
