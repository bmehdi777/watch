package api

import "net/http"

func healthzHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("OK"))
}
