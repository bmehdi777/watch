package api

import (
	"context"
	"net/http"
	"watch/internals/pkg/models"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type SourceHandler struct {
	DB *gorm.DB
}

func NewSourceHandler(db *gorm.DB) *SourceHandler {
	return &SourceHandler{
		DB: db,
	}
}

func (s *SourceHandler) Routes(r chi.Router) {
	r.Get("/", s.getMany)
	r.Post("/", s.create)

	r.Group(func(r chi.Router) {
		r.Use(s.sourceCtx)
		r.Get("/{sourceID}", s.getOne)
		r.Put("/{sourceID}", s.update)
		r.Delete("/{sourceID}", s.delete)
	})
}

func (s *SourceHandler) getMany(w http.ResponseWriter, r *http.Request) {
	var sources []models.SourceModel
	tx := s.DB.Find(&sources)
	if tx.Error != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	err := encodeJSON(w, r, http.StatusOK, &sources)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

func (s *SourceHandler) getOne(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	source, ok := ctx.Value("source").(*models.SourceModel)
	if !ok {
		http.Error(w, http.StatusText(422), 422)
		return
	}

	err := encodeJSON(w, r, http.StatusOK, &source)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

func (s *SourceHandler) create(w http.ResponseWriter, r *http.Request) {
	sourceDTO, err := decodeJSON[models.SourceDTO](r)
	if err != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}

	source := models.SourceModel{
		BlogUrl: sourceDTO.BlogUrl,
		RSSUrl:  sourceDTO.RSSUrl,
		Enabled: sourceDTO.Enabled,
	}

	s.DB.Create(&source)

	w.WriteHeader(200)
}

func (s *SourceHandler) update(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	source, ok := ctx.Value("source").(*models.SourceModel)
	if !ok {
		http.Error(w, http.StatusText(422), 422)
		return
	}

	decodedSource, err := decodeJSON[models.SourceDTO](r)
	if err != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}

	tx := s.DB.Model(&source).Updates(decodedSource)
	if tx.Error != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}

	w.WriteHeader(204)
}
func (s *SourceHandler) delete(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	source, ok := ctx.Value("source").(*models.SourceModel)
	if !ok {
		http.Error(w, http.StatusText(422), 422)
		return
	}

	tx := s.DB.Delete(&source)
	if tx.Error != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	w.WriteHeader(200)
}

func (s *SourceHandler) sourceCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sourceID := chi.URLParam(r, "sourceID")

		var source models.SourceModel
		tx := s.DB.First(&source, "ID = ?", sourceID)

		if tx.Error != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		ctx := context.WithValue(r.Context(), "source", &source)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
