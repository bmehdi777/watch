package ai

import (
	"context"
	"fmt"
	"strings"

	"github.com/ollama/ollama/api"
)

func GenerateTLDR(ctx context.Context, modelName string, preRequest string, articleContent string) (string, error) {
	noStream := false

	request := &api.ChatRequest{
		Model:  modelName,
		Stream: &noStream,
		Messages: []api.Message{
			{
				Role:    "system",
				Content: "You are a helpful assistant that summarizes articles clearly and concisely. You summarize in English.",
			},
			{
				Role:    "user",
				Content: fmt.Sprintf("%s\n\n%s", preRequest, articleContent),
			},
		},
	}

	var sb strings.Builder
	err := instance.Chat(ctx, request, func(resp api.ChatResponse) error {
		sb.WriteString(resp.Message.Content)
		return nil
	})
	if err != nil {
		return "", err
	}

	return sb.String(), nil
}
