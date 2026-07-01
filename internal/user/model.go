package user

import (
	"time"

	"github.com/gcerbaro/mimmisbrunnr/pkg/role"
)

type User struct {
	ID              int
	Name            string
	Email           string
	Password        string
	Birthday        time.Time
	Profile_picture *string
	Session         *int
	Role            role.Role
	Totp_secret     *string
	Totp_enabled    bool
	Created_at      time.Time
	Updated_at      time.Time
}
