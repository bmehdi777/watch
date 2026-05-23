package crawler

import (
	"context"
	"time"

	"gorm.io/gorm"
)

var CrawlerController chan int

func Run(ctx context.Context, db *gorm.DB) {
	CrawlerController = make(chan int)
	ticker := time.NewTicker(30 * time.Minute)
	// Testing purpose
	// ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-CrawlerController:
			scrap(db)
		case <-ticker.C:
			scrap(db)
		case <-ctx.Done():
			return
		}
	}
}
