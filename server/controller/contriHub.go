package controller

import (
	"net/http"

	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
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
// @Router /v1/contrihub/rankings [get]
func GetContriHubRankings(c echo.Context) error {
	users, err := dao.GetContriHubRankings()
	if err != nil {
		return utils.InternalError(c, "Unable to fetch ContriHUB rankings", &err)
	}

	return c.JSON(http.StatusOK, &users)
}
