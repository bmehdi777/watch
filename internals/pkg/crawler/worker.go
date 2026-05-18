package crawler

import (
	"context"
	"time"

	"gorm.io/gorm"
)

func Run(ctx context.Context, db *gorm.DB) {
	ticker := time.NewTicker(30 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:

		case <-ctx.Done():
			return
		}
	}
}
