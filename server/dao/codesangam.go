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
