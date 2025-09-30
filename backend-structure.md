# TechMeet Backend Structure (Golang + React)

## Project Structure
```
techmeet-app/
├──

├── backend/                  # Golang backend
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   ├── internal/
│   │   ├── handlers/
│   │   │   └── registration.go
│   │   ├── models/
│   │   │   └── registration.go
│   │   ├── database/
│   │   │   └── connection.go
│   │   └── middleware/
│   │       └── cors.go
│   ├── migrations/           # Flyway migrations
│   │   └── V1__create_registrations_table.sql
│   ├── go.mod
│   └── go.sum
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Backend Implementation

### 1. main.go
```go
package main

import (
    "log"
    "net/http"
    "os"
    
    "github.com/gorilla/mux"
    "github.com/rs/cors"
    "your-app/internal/database"
    "your-app/internal/handlers"
    "your-app/internal/middleware"
)

func main() {
    // Initialize database
    db, err := database.InitDB()
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    defer db.Close()

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
    c := cors.New(cors.Options{
        AllowedOrigins: []string{"*"},
        AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders: []string{"*"},
    })

    handler := c.Handler(r)
    
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Server starting on port %s", port)
    log.Fatal(http.ListenAndServe(":"+port, handler))
}
```

### 2. models/registration.go
```go
package models

import (
    "time"
    "gorm.io/gorm"
)

type Registration struct {
    ID               uint      `json:"id" gorm:"primaryKey"`
    Name             string    `json:"name" gorm:"not null;size:100" validate:"required,min=2,max=100"`
    Email            string    `json:"email" gorm:"not null;unique;size:255" validate:"required,email,max=255"`
    Company          string    `json:"company" gorm:"not null;size:100" validate:"required,min=2,max=100"`
    Department       string    `json:"department" gorm:"not null;size:100" validate:"required,min=2,max=100"`
    Role             string    `json:"role" gorm:"not null;size:100" validate:"required,min=2,max=100"`
    InterestedTrack  string    `json:"interested_track" gorm:"not null" validate:"required,oneof=ai-ml software-engineering devops-cloud all"`
    Newsletter       bool      `json:"newsletter" gorm:"default:false"`
    Terms            bool      `json:"terms" gorm:"not null" validate:"required"`
    CreatedAt        time.Time `json:"created_at"`
    UpdatedAt        time.Time `json:"updated_at"`
    DeletedAt        gorm.DeletedAt `json:"-" gorm:"index"`
}
```

### 3. handlers/registration.go
```go
package handlers

import (
    "encoding/json"
    "net/http"
    
    "github.com/go-playground/validator/v10"
    "gorm.io/gorm"
    "your-app/internal/models"
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
```

### 4. database/connection.go
```go
package database

import (
    "fmt"
    "os"
    
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "your-app/internal/models"
)

func InitDB() (*gorm.DB, error) {
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
        os.Getenv("DB_HOST"),
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_NAME"),
        os.Getenv("DB_PORT"),
    )

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, err
    }

    // Auto migrate
    err = db.AutoMigrate(&models.Registration{})
    if err != nil {
        return nil, err
    }

    return db, nil
}
```

### 5. Flyway Migration (V1__create_registrations_table.sql)
```sql
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    company VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    interested_track VARCHAR(50) NOT NULL CHECK (interested_track IN ('ai-ml', 'software-engineering', 'devops-cloud', 'all')),
    newsletter BOOLEAN DEFAULT FALSE,
    terms BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_deleted_at ON registrations(deleted_at);
```

## Docker Configuration

### Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM golang:1.21-alpine AS backend-build
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=backend-build /app/server .
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
EXPOSE 8080
CMD ["./server"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - DB_USER=postgres
      - DB_PASSWORD=password
      - DB_NAME=techmeet
      - DB_PORT=5432
    depends_on:
      - db
      - flyway
    
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=techmeet
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
      
  flyway:
    image: flyway/flyway:latest
    command: -url=jdbc:postgresql://db:5432/techmeet -user=postgres -password=password -locations=filesystem:/flyway/sql migrate
    volumes:
      - ./backend/migrations:/flyway/sql
    depends_on:
      - db

volumes:
  postgres_data:
```

## go.mod
```go
module your-app

go 1.21

require (
    github.com/go-playground/validator/v10 v10.15.5
    github.com/gorilla/mux v1.8.0
    github.com/rs/cors v1.10.1
    gorm.io/driver/postgres v1.5.3
    gorm.io/gorm v1.25.5
)
```