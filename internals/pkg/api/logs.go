package api

import (
	"net/http"
	"watch/internals/pkg/models"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type LogsHandler struct {
	DB *gorm.DB
}

func NewLogsHandler(db *gorm.DB) *LogsHandler {
	return &LogsHandler{
		DB: db,
	}
}

func (l *LogsHandler) Routes(r chi.Router) {
	r.Get("/", l.getMany)
	r.Get("/{logID}", l.getOne)
}

func (l *LogsHandler) getMany(w http.ResponseWriter, r *http.Request) {
	var logModels []models.LogModel
	tx := l.DB.Find(&logModels)
	if tx.Error != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	logModelsDto := make([]models.LogLightDTO, len(logModels))

	for i, logModel := range logModels {
		logModelsDto[i] = models.LogLightDTO{
			ID:        logModel.ID,
			Level:     logModel.Level,
			Message:   logModel.Message,
			CreatedAt: logModel.CreatedAt,
		}
	}

	err := encodeJSON(w, r, http.StatusOK, &logModelsDto)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

}

func (l *LogsHandler) getOne(w http.ResponseWriter, r *http.Request) {
	logID := chi.URLParam(r, "aiModelID")

	var logModel models.LogModel
	tx := l.DB.First(&logModel, "ID = ?", logID)
	if tx.Error != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	logDto := models.LogLightDTO{
		ID:        logModel.ID,
		Level:     logModel.Level,
		Message:   logModel.Message,
		CreatedAt: logModel.CreatedAt,
	}

	err := encodeJSON(w, r, http.StatusOK, &logDto)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
}
