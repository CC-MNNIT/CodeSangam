package controller

import (
	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
	"github.com/labstack/echo/v4"
)

// SaveUser
//
// @Summary Save user to database
// @Schemes
// @Description Saves the user to the database
// @Tags CodeSangam
// @Accept json
// @Produce json
// @Param user body models.UserDto true "User"
// @Success 200 {object} models.User
// @Router /v1/cs/user [post]
func SaveUser(c echo.Context) error {
	var dto models.UserDto

	if err := c.Bind(&dto); err != nil {
		return utils.BadRequestError(c, "Unable to parse userDto", &err)
	}

	user, err := dao.SaveUser(&dto)
	if err != nil {
		return utils.InternalError(c, "Unable to save user", &err)
	}

	return c.JSON(200, &user)
}

// GetUserInfo
//
// @Summary Fetch user info from database
// @Schemes
// @Description Returns the user info
// @Tags CodeSangam
// @Accept json
// @Produce json
// @Success 200 {object} models.DashboardUserDto
// @Router /v1/cs/user [get]
func GetUserInfo(c echo.Context) error {
	sess, err := utils.GetSession(c)
	if err != nil {
		return utils.InternalError(c, "Unable to get session", &err)
	}

	userBytes := sess.Values[utils.UserSessionKey]
	if userBytes == nil {
		return utils.BadRequestError(c, "User not logged in", nil)
	}

	user, err := dao.GetUserInfo(userBytes.(int))
	if err != nil {
		return utils.InternalError(c, "Unable to fetch user info", &err)
	}

	return c.JSON(200, &user)
}
