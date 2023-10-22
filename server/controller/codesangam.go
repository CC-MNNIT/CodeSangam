package controller

import (
	"errors"

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
	userId, err := getSessionUserId(c)
	if err != nil {
		return utils.UnauthorizedError(c, "User not logged in", &err)
	}

	user, err := dao.GetUserInfo(*userId)
	if err != nil {
		return utils.InternalError(c, "Unable to fetch user info", &err)
	}

	return c.JSON(200, &user)
}

// RegisterTeam
//
// @Summary Register team to database for an event
// @Schemes
// @Description Registers the team to the database for an event. Members list should not include the leader.
// @Tags CodeSangam
// @Accept json
// @Produce json
// @Param team body models.RegisterTeamDto true "Team"
// @Success 200 {object} models.DashboardTeam
// @Router /v1/cs/register [post]
func RegisterTeam(c echo.Context) error {
	userId, err := getSessionUserId(c)
	if err != nil {
		return utils.UnauthorizedError(c, "User not logged in", &err)
	}

	var dto models.RegisterTeamDto
	if err := c.Bind(&dto); err != nil {
		return utils.BadRequestError(c, "Unable to parse teamDto", &err)
	}

	event, err := dao.ToEvent(dto.Event)
	if err != nil {
		return utils.BadRequestError(c, "Invalid event", &err)
	}

	team, err := dao.RegisterTeam(event, dto.TeamName, *userId, dto.MemberRegNoList)
	if err != nil {
		return utils.BadRequestError(c, "Unable to register team", &err)
	}

	return c.JSON(200, &team)
}

func getSessionUserId(c echo.Context) (*int, error) {
	sess, err := utils.GetSession(c)
	if err != nil {
		return nil, errors.New("unable to get session")
	}

	userBytes := sess.Values[utils.UserSessionKey]
	if userBytes == nil {
		return nil, errors.New("user session null")
	}
	userId := userBytes.(int)
	return &userId, nil
}

// GetEventRanking
//
// @Summary Fetch event ranking from database
// @Schemes
// @Description Returns the event ranking
// @Tags CodeSangam
// @Accept json
// @Produce json
// @Param event query string true "event"
// @Success 200 {object} []models.DashboardTeam
// @Router /v1/cs/ranking [get]
func GetEventRanking(c echo.Context) error {
	qEvent := c.QueryParam("event")

	event, err := dao.ToEvent(qEvent)
	if err != nil {
		return utils.BadRequestError(c, "Invalid event", &err)
	}

	rankings, err := dao.GetEventRanking(event)
	if err != nil {
		return utils.InternalError(c, "Unable to fetch event rankings", &err)
	}

	return c.JSON(200, &rankings)
}
