package user

import (
	"log"
	"time"

	"github.com/alexedwards/argon2id"
	"gorm.io/gorm"
)

type Role string

const (
	RoleAdmin Role = "ADMIN"
	RoleUser  Role = "USER"
)

type User struct {
	gorm.Model
	Name           string `gorm:"type:varchar(100);not null"`
	Email          string `gorm:"unique;not null"`
	Password       string `gorm:"type:varchar(255); not null"`
	Birthday       time.Time
	ProfilePicture string  `gorm:"type:varchar(50);not null"`
	Session        *string `gorm:"type:char(36);index"` // UUID for session, nullable
	Role           Role    `gorm:"type:varchar(20);default:USER;not null"`
	// TOTPSecret     string   `gorm:"column:totp_secret"`
	// TOTPEnabled    bool     `gorm:"column:totp_enabled;default:false"`
}

func NewUser(
	dto CreateUserRequest,
) *User {

	hash, err := argon2id.CreateHash(dto.Password, argon2id.DefaultParams)
	if err != nil {
		log.Fatal(err)
	}
	match, err := argon2id.ComparePasswordAndHash(dto.Password, hash)
	if err != nil {
		log.Fatal(err)
	}

	if match {
	}

	return &User{
		Name:           dto.Name,
		Email:          dto.Email,
		Password:       hash,
		Birthday:       dto.Birthday,
		ProfilePicture: "",
		Role:           RoleUser,
		//totp_secret:     "",
		//totp_enabled:    false,
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
