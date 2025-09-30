package main

import (
	"log"
	"net/http"
	"os"

	"meetmate-go/internal/database"
	"meetmate-go/internal/handlers"
	"meetmate-go/internal/middleware"

	"github.com/gorilla/mux"
)

func main() {
	// Initialize database
	db, err := database.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	// Initialize handlers
	registrationHandler := handlers.NewRegistrationHandler(db)

	// Setup routes
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/register", registrationHandler.Register).Methods("POST")
	api.HandleFunc("/registrations", registrationHandler.GetRegistrations).Methods("GET")

	// Serve static files (React build)
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./frontend/dist/")))

	// Setup CORS
	c := middleware.SetupCORS()
	handler := c.Handler(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
