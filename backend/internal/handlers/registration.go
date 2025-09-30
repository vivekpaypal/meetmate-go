package handlers

import (
	"encoding/json"
	"net/http"

	"meetmate-go/internal/models"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type RegistrationHandler struct {
	db       *gorm.DB
	validate *validator.Validate
}

func NewRegistrationHandler(db *gorm.DB) *RegistrationHandler {
	return &RegistrationHandler{
		db:       db,
		validate: validator.New(),
	}
}

func (h *RegistrationHandler) Register(w http.ResponseWriter, r *http.Request) {
	var registration models.Registration

	if err := json.NewDecoder(r.Body).Decode(&registration); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Validate input
	if err := h.validate.Struct(registration); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Save to database
	if err := h.db.Create(&registration).Error; err != nil {
		if err.Error() == "UNIQUE constraint failed: registrations.email" {
			http.Error(w, "Email already registered", http.StatusConflict)
			return
		}
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Registration successful",
		"id":      registration.ID,
	})
}

func (h *RegistrationHandler) GetRegistrations(w http.ResponseWriter, r *http.Request) {
	var registrations []models.Registration

	if err := h.db.Find(&registrations).Error; err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registrations)
}
