package api

import (
	"fmt"
	"net/http"
	"time"
	"watch/internals/pkg/models"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/render"
)

func Run() {
	db := models.InitializeDatabase()

	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(render.SetContentType(render.ContentTypeJSON))

	healthHandler := NewHealthHandler()
	sourceHandler := NewSourceHandler(db)

	router.Route("/healthz", healthHandler.Routes)
	router.Route("/sources", sourceHandler.Routes)

	fmt.Println("Server is running at :3000")
	http.ListenAndServe(":3000", router)
}
