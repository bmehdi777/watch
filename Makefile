.PHONY: build build-api clean watch test prepare

prepare:
	go mod tidy

build: build-api

build-api:
	go build -o dist/watch-api cmd/api/main.go

clean:
	rm -r dist

watch:
	go tool air -c .air.toml

test:
	go test -v ./internals/pkg
