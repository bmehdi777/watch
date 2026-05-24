package ai

import (
	"context"
	"net/http"
	"net/url"
	"sync"
	"time"

	"github.com/ollama/ollama/api"
)

var (
	instance *api.Client
	once     sync.Once
)

func InitializeOllama() {
	once.Do(func() {
		ollamaURL, _ := url.Parse("http://localhost:11434")

		httpClient := &http.Client{
			Timeout: 5 * time.Minute,
		}

		instance = api.NewClient(ollamaURL, httpClient)
	})
}

func PullModel(ctx context.Context, modelName string) error {
	err := instance.Pull(ctx, &api.PullRequest{
		Model: modelName,
	}, func(_ api.ProgressResponse) error {
		return nil
	})

	if err != nil {
		return err
	}

	return nil
}
