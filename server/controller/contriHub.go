package controller

import (
	"net/http"

	"github.com/CC-MNNIT/CodeSangam/server/initialize"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"github.com/labstack/echo/v4"
)

// GetContriHubRankings
//
// @Summary Fetch rankings from ContriHUB
// @Schemes
// @Description Returns the list of ranked users
// @Tags ContriHUB
// @Accept json
// @Produce json
// @Success 200 {object} []models.ContriHUBUser
// @Router /api/v1/contrihub/rankings [get]
func GetContriHubRankings(c echo.Context) error {
	var users []models.ContriHUBUser

	err := initialize.ContriHubDB.Raw(
		`SELECT * FROM user_profile_userprofile us 
		INNER JOIN auth_user au 
		ON us.user_id = au.id 
		WHERE us.total_points > 0 
		ORDER BY total_points DESC;`,
	).Find(&users).Error

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, &users)
}
