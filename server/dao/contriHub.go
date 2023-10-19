package dao

import (
	"github.com/CC-MNNIT/CodeSangam/server/initialize"
	"github.com/CC-MNNIT/CodeSangam/server/models"
)

func GetContriHubRankings() (*[]models.ContriHUBUser, error) {
	var users []models.ContriHUBUser

	err := initialize.ContriHubDB.Raw(
		`SELECT * FROM user_profile_userprofile us 
		INNER JOIN auth_user au 
		ON us.user_id = au.id 
		WHERE us.total_points > 0 
		ORDER BY total_points DESC;`,
	).Find(&users).Error

	if err != nil {
		return nil, err
	}

	return &users, nil
}
