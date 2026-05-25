package api

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
	"gorm.io/gorm"
)

func Run(ctx context.Context, db *gorm.DB) {
	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(render.SetContentType(render.ContentTypeJSON))

	healthHandler := NewHealthHandler()
	sourceHandler := NewSourceHandler(db)
	articleHandler := NewArticleHandler(db)
	crawlerHandler := NewCrawlerHandler(db)
	aiHandler := NewAIHandler(db)
	logsHandler := NewLogsHandler(db)

	router.Route("/api/v1", func(r chi.Router) {
		r.Route("/healthz", healthHandler.Routes)
		r.Route("/sources", sourceHandler.Routes)
		r.Route("/articles", articleHandler.Routes)
		r.Route("/crawler", crawlerHandler.Routes)
		r.Route("/models", aiHandler.Routes)
		r.Route("/logs", logsHandler.Routes)
	})

	srv := http.Server{
		Addr:    ":3000",
		Handler: router,
	}

	go func() {
		log.Println("Server is running at :3000")
		srv.ListenAndServe()
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	err := srv.Shutdown(ctx)
	if err != nil {
		log.Fatalln("Shutdown error : ", err)
	}
}
