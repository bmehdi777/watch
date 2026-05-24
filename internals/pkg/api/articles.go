package api

import (
	"context"
	"log"
	"net/http"
	"watch/internals/pkg/ai"
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
	// Testing purpose only
	// r.Post("/", a.create)
	r.Get("/", a.getMany)
	r.Post("/search", a.search)
	r.Group(func(r chi.Router) {
		r.Use(a.articleCtx)
		r.Get("/{articleID}", a.getOne)
		r.Post("/{articleID}/tldr", a.generateTldr)
	})
}

func (a *ArticleHandler) getMany(w http.ResponseWriter, r *http.Request) {
	var articles []models.ArticleModel
	tx := a.DB.Order("date(published_date) DESC").Find(&articles)
	if tx.Error != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	articlesLight := make([]models.ArticleLightDTO, len(articles))

	for i, articleModel := range articles {
		articlesLight[i] = models.ArticleLightDTO{
			ID:            articleModel.ID,
			Title:         articleModel.Title,
			Link:          articleModel.Link,
			PublishedDate: articleModel.PublishedDate,
			Liked:         articleModel.Liked,
			ReadLater:     articleModel.ReadLater,
		}
	}

	err := encodeJSON(w, r, http.StatusOK, &articlesLight)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
}

func (a *ArticleHandler) search(w http.ResponseWriter, r *http.Request) {
	searchDTO, err := decodeJSON[models.ArticleLightDTO](r)
	if err != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}

	var articles []models.ArticleModel
	db := a.DB.Model(&models.ArticleModel{})
	if searchDTO.Title != "" {
		db = db.Where("title LIKE ?", "%"+searchDTO.Title+"%")
	}
	if searchDTO.Liked {
		db = db.Where("liked = 1")
	}

	tx := db.Find(&articles)
	if tx.Error != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	articlesLight := make([]models.ArticleLightDTO, len(articles))

	for i, articleModel := range articles {
		articlesLight[i] = models.ArticleLightDTO{
			ID:            articleModel.ID,
			Title:         articleModel.Title,
			Link:          articleModel.Link,
			PublishedDate: articleModel.PublishedDate,
			Liked:         articleModel.Liked,
			ReadLater:     articleModel.ReadLater,
		}
	}

	err = encodeJSON(w, r, http.StatusOK, &articlesLight)
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

	articleDTO := models.ArticleDTO{
		ArticleLightDTO: models.ArticleLightDTO{
			ID:            article.ID,
			Title:         article.Title,
			Link:          article.Link,
			PublishedDate: article.PublishedDate,
			Liked:         article.Liked,
			ReadLater:     article.ReadLater,
			TldrGenerated: article.TldrGenerated,
		},
		Content: article.Description,
		Tldr:    article.Tldr,
	}

	err := encodeJSON(w, r, http.StatusOK, &articleDTO)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

func (a *ArticleHandler) generateTldr(w http.ResponseWriter, r *http.Request) {
	tldrDTO, err := decodeJSON[models.TldrDTO](r)
	if err != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}

	ctx := r.Context()
	article, ok := ctx.Value("article").(*models.ArticleModel)
	if !ok {
		http.Error(w, http.StatusText(422), 422)
		return
	}

	if article.TldrGenerated && !tldrDTO.Force {
		w.WriteHeader(200)
		return
	}

	var currentAiModel models.AIModel
	tx := a.DB.First(&currentAiModel, "enabled = 1")
	if tx.Error != nil {
		http.Error(w, "Unable to get current AI model", 500)
		return
	}

	// not sure about this
	if &currentAiModel == nil {
		http.Error(w, "No AI model activated", 400)
	}

	go func() {
		background := context.Background()
		tldr, err := ai.GenerateTLDR(background, currentAiModel.Name, currentAiModel.PrefixRequest, article.Description)
		if err != nil {
			log.Println("An error occured while generating TLDR : ", err)
			return
		}

		article.TldrGenerated = true
		article.Tldr = tldr

		tx = a.DB.Save(&article)
		if tx.Error != nil {
			log.Println("Unable to save TLDR : ", tx.Error)
			return
		}
	}()

	w.WriteHeader(200)
}

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
