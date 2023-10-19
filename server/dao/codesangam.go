package dao

import (
	"github.com/CC-MNNIT/CodeSangam/server/initialize"
	"github.com/CC-MNNIT/CodeSangam/server/models"
)

const (
	// Table name
	userTable = "user"
)

func SaveUser(dto *models.UserDto) (*models.User, error) {
	if pUser := exists(&dto.Email); pUser != nil {
		return pUser, nil
	}

	var user models.User

	result := initialize.Db.Table(userTable).Create(&models.User{
		RegNo:  dto.RegNo,
		Name:   dto.Name,
		Email:  dto.Email,
		Avatar: dto.Avatar,
	}).Scan(&user)

	if err := result.Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func exists(email *string) *models.User {
	var user models.User
	result := initialize.Db.Table(userTable).Where("email = ?", *email).First(&user)
	if result.Error != nil {
		return nil
	}
	return &user
}
