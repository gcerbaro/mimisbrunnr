package user

import (
	"time"
)

type CreateUserRequest struct {
	Name     string
	Email    string
	Password string
	Birthday time.Time
}

type UpdateUserRequest struct {
	Name           *string
	Email          *string
	Birthday       *time.Time
	ProfilePicture *string
}

type UserResponse struct {
	Name           string
	Email          string
	Birthday       string
	ProfilePicture string
}
