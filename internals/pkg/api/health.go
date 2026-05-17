package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

type HealthHandler struct{}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

func (h *HealthHandler) Routes(r chi.Router) {
	r.With(render.SetContentType(render.ContentTypePlainText)).Get("/", h.get)
}

func (h *HealthHandler) get(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("OK"))
}
