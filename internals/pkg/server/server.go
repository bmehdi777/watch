package server

import (
	"context"
	"watch/internals/pkg/ai"
	"watch/internals/pkg/api"
	"watch/internals/pkg/crawler"
	"watch/internals/pkg/models"
)

func Run() {
	db := models.InitializeDatabase()
	background := context.Background()
	ai.InitializeOllama()

	go api.Run(background, db)
	crawler.Run(background, db)
}
