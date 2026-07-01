package user

import (
	"time"
)

type Role string

const (
	RoleAdmin Role = "ADMIN"
	RoleUser  Role = "USER"
)

type User struct {
	id              int
	Name            string
	Email           string
	Password        string
	Birthday        time.Time
	Profile_picture string
	Session         *int
	Role            Role
	totp_secret     string
	totp_enabled    bool
	Created_at      time.Time
	Updated_at      time.Time
}

func NewUser(
	dto CreateUserRequest,
) *User {

	return &User{
		Name:            dto.Name,
		Email:           dto.Email,
		Password:        dto.Password,
		Birthday:        dto.Birthday,
		Profile_picture: "",
		Role:            RoleUser,
		totp_secret:     "",
		totp_enabled:    false,
		Created_at:      time.Now(),
		Updated_at:      time.Now(),
	}
}

/*
func (u *User) EnableTotp(secret string) {
	if secret != "" {
		u.totp_secret = secret
		u.totp_enabled = true
	}
}

func (u *User) TOTPSecret() string { return u.totp_secret }
func (u *User) TOTPEnabled() bool  { return u.totp_enabled }
*/
