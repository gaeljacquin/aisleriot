package main

import (
	"bufio"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
)

func loadEnv() {
	file, err := os.Open(".env")
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "#") || strings.TrimSpace(line) == "" {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.ToUpper(strings.TrimSpace(parts[0]))
			value := strings.TrimSpace(parts[1])
			os.Setenv(key, value)
		}
	}
}

func main() {
	loadEnv()
	clientURLs := os.Getenv("CLIENT_URLS")
	allowedOrigins := strings.Split(clientURLs, ",")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		isAllowed := false

		if clientURLs == "*" {
			isAllowed = true
		} else if origin != "" {
			for _, o := range allowedOrigins {
				if strings.TrimSpace(o) == origin {
					isAllowed = true
					break
				}
			}
		}

		if isAllowed {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}

		if r.Method == "OPTIONS" {
			if isAllowed {
				w.WriteHeader(http.StatusOK)
				return
			}
			w.WriteHeader(http.StatusForbidden)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "hello world"})
	})

	log.Println("Server starting on :8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
