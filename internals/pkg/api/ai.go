package api

import (
	"context"
	"net/http"
	"watch/internals/pkg/models"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type AIHandler struct {
	DB *gorm.DB
}

func NewAiHandler(db *gorm.DB) *AIHandler {
	return &AIHandler{
		DB: db,
	}
}

func (a *AIHandler) Routes(r chi.Router) {
	r.Get("/", a.getMany)
	r.Post("/", a.create)
	r.Group(func(r chi.Router) {
		r.Use(a.aiModelCtx)
		r.Put("/{aiModelID}", a.update)
	})
}

func (a *AIHandler) getMany(w http.ResponseWriter, r *http.Request) {
	var aiModels []models.AIModel
	tx := a.DB.Find(&aiModels)
	if tx.Error != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	aiModelsDto := make([]models.AIModelDTO, len(aiModels))

	for i, aiModel := range aiModels {
		aiModelsDto[i] = models.AIModelDTO{
			ID:            aiModel.ID,
			Name:          aiModel.Name,
			DisplayName:   aiModel.DisplayName,
			PrefixRequest: aiModel.PrefixRequest,
			Enabled:       aiModel.Enabled,
		}
	}

	err := encodeJSON(w, r, http.StatusOK, &aiModelsDto)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
}

func (a *AIHandler) create(w http.ResponseWriter, r *http.Request) {
	aiModelDTO, err := decodeJSON[models.AILightDTO](r)
	if err != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}

	aiModel := models.AIModel{
		Name:          aiModelDTO.Name,
		DisplayName:   aiModelDTO.DisplayName,
		PrefixRequest: aiModelDTO.PrefixRequest,
		Enabled:       false,
	}

	a.DB.Create(&aiModel)

	w.WriteHeader(200)
}

func (a *AIHandler) update(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	aiModel, ok := ctx.Value("aiModel").(*models.AIModel)
	if !ok {
		http.Error(w, http.StatusText(422), 422)
		return
	}

	decodedAIModel, err := decodeJSON[models.AILightDTO](r)
	if err != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}

	tx := a.DB.Model(&aiModel).Updates(decodedAIModel)
	if tx.Error != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}

	w.WriteHeader(204)
}

func (a *AIHandler) aiModelCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		aiModelId := chi.URLParam(r, "aiModelID")

		var aiModel models.AIModel
		tx := a.DB.First(&aiModel, "ID = ?", aiModelId)
		if tx.Error != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		ctx := context.WithValue(r.Context(), "aiModel", &aiModel)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
