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
