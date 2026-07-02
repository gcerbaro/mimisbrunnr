package user

func (u *User) update(dto UpdateUserRequest) {
	u.Name = *dto.Name
	u.Email = *dto.Email
	u.Birthday = *dto.Birthday
	u.ProfilePicture = *dto.ProfilePicture
}
