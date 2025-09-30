package models

import (
	"time"

	"gorm.io/gorm"
)

type Registration struct {
	ID              uint           `json:"id" gorm:"primaryKey"`
	Name            string         `json:"name" gorm:"not null;size:100" validate:"required,min=2,max=100"`
	Email           string         `json:"email" gorm:"not null;unique;size:255" validate:"required,email,max=255"`
	Company         string         `json:"company" gorm:"not null;size:100" validate:"required,min=2,max=100"`
	Department      string         `json:"department" gorm:"not null;size:100" validate:"required,min=2,max=100"`
	Role            string         `json:"role" gorm:"not null;size:100" validate:"required,min=2,max=100"`
	InterestedTrack string         `json:"interested_track" gorm:"not null" validate:"required,oneof=ai-ml software-engineering devops-cloud all"`
	Newsletter      bool           `json:"newsletter" gorm:"default:false"`
	Terms           bool           `json:"terms" gorm:"not null" validate:"required"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
}
