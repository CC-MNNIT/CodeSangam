package controller

import (
	"errors"
	"net/http"
	"strings"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
	"github.com/labstack/echo/v4"
)

const (
	// File size
	MaxFileSize int64 = 3 << 20 // 3 MB
	CSVFileSize int64 = 1 << 19 // 512 KB
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

// UploadAbstractSubmission
//
// @Summary Upload abstract submission to server
// @Schemes
// @Description Uploads the abstract submission to the server
// @Tags CodeSangam
// @Accept json
// @Param event formData string true "event"
// @Param file formData file true "file"
// @Success 200 {string} string
// @Router /v1/cs/abstract [post]
func UploadAbstractSubmission(c echo.Context) error {
	userId, err := getSessionUserId(c)
	if err != nil {
		return utils.UnauthorizedError(c, "User not logged in", &err)
	}

	fEvent := c.FormValue("event")
	event, err := dao.ToEvent(fEvent)
	if err != nil {
		return utils.BadRequestError(c, "Invalid event", &err)
	}

	team, err := dao.GetTeam(event, *userId)
	if err != nil {
		return utils.InternalError(c, "Unable to fetch team", &err)
	}
	if team == nil {
		return utils.BadRequestError(c, "Team not registered", nil)
	}

	file, err := c.FormFile("file")
	if err != nil {
		return utils.BadRequestError(c, "Unable to parse file", &err)
	}

	if file.Size > MaxFileSize {
		return utils.BadRequestError(c, "File size too large. Should be less than 3 MB", nil)
	}

	if !strings.HasSuffix(file.Filename, ".pdf") {
		return utils.BadRequestError(c, "Invalid file extension", nil)
	}

	err = utils.SaveAbstract(file, event, team.TeamId)
	if err != nil {
		return utils.InternalError(c, "Unable to save abstract", &err)
	}

	err = dao.AddAbstractForTeam(team.TeamId)
	if err != nil {
		return utils.InternalError(c, "Unable to add abstract for team", &err)
	}

	return c.NoContent(http.StatusOK)
}

// GetAbstractFile
//
// @Summary Fetch abstract file from server
// @Schemes
// @Description Returns the abstract file
// @Tags CodeSangam
// @Accept json
// @Produce application/pdf
// @Param id query string true "id"
// @Success 200 {string} string "application/pdf"
// @Router /v1/cs/abstract [get]
func GetAbstractFile(c echo.Context) error {
	strTeamId := c.QueryParam("id")

	userId, err := getSessionUserId(c)
	if err != nil {
		return utils.UnauthorizedError(c, "User not logged in", &err)
	}

	user, err := dao.GetUser(*userId)
	if err != nil {
		return utils.InternalError(c, "Unable to fetch user", &err)
	}

	if !dao.ValidSenior(&user.RegNo) {
		return utils.UnauthorizedError(c, "User not authorized", nil)
	}

	path, err := utils.GetAbstractFile(strTeamId)
	if err != nil {
		return utils.InternalError(c, "Unable to fetch abstract file", &err)
	}
	return c.File(path)
}

// AllotTeamsToMentor
//
// @Summary Allot teams to mentor
// @Schemes
// @Description Allots the teams to the mentor
// @Tags CodeSangam
// @Accept json
// @Produce json
// @Param event query string true "event"
// @Success 200 {string} string
// @Router /v1/cs/allot [post]
func AllotTeamsToMentor(c echo.Context) error {
	userId, err := getSessionUserId(c)
	if err != nil {
		return utils.UnauthorizedError(c, "User not logged in", &err)
	}

	mentor := dao.CheckMentor(*userId)
	if mentor == nil {
		return utils.UnauthorizedError(c, "User not authorized for mentor", nil)
	}

	event := c.QueryParam("event")
	if event == "" {
		return utils.BadRequestError(c, "Invalid event", nil)
	}

	err = dao.Allot(*userId, event)
	if err != nil {
		return utils.InternalError(c, "Unable to allot teams", &err)
	}

	return c.NoContent(http.StatusOK)
}

// GetAllotmentCSV
//
// @Summary Fetch allotment csv from server
// @Schemes
// @Description Returns the allotment csv
// @Tags CodeSangam
// @Accept json
// @Produce text/csv
// @Param event query string true "event"
// @Success 200 {string} string "text/csv"
// @Router /v1/cs/allot [get]
func GetAllotmentCSV(c echo.Context) error {
	userId, err := getSessionUserId(c)
	if err != nil {
		return utils.UnauthorizedError(c, "User not logged in", &err)
	}

	mentor := dao.CheckMentor(*userId)
	if mentor == nil {
		return utils.UnauthorizedError(c, "User not authorized for mentor", nil)
	}

	event := c.QueryParam("event")
	if event == "" {
		return utils.BadRequestError(c, "Invalid event", nil)
	}

	path, err := utils.GetAllotmentCSV(*userId, event)
	if err != nil {
		return utils.InternalError(c, "Unable to fetch abstract file", &err)
	}
	return c.File(path)
}

// UploadMidTermEval
//
// @Summary Upload mid term evaluation to server
// @Schemes
// @Description Uploads the mid term evaluation to the server
// @Tags CodeSangam
// @Accept json
// @Param event formData string true "event"
// @Param file formData file true "file"
// @Success 200 {string} string
// @Router /v1/cs/midterm [post]
func UploadMidTermEval(c echo.Context) error {
	userId, err := getSessionUserId(c)
	if err != nil {
		return utils.UnauthorizedError(c, "User not logged in", &err)
	}

	mentor := dao.CheckMentor(*userId)
	if mentor == nil {
		return utils.UnauthorizedError(c, "User not authorized for mentor", nil)
	}

	event := c.FormValue("event")
	team, err := dao.GetTeamsForMentorEvent(*userId, event)
	if err != nil {
		return utils.InternalError(c, "Unable to fetch team", &err)
	}
	if team == nil {
		return utils.BadRequestError(c, "Team not registered", nil)
	}

	file, err := c.FormFile("file")
	if err != nil {
		return utils.BadRequestError(c, "Unable to parse file", &err)
	}

	if file.Size > CSVFileSize {
		return utils.BadRequestError(c, "File size too large. Should be less than 512 KB", nil)
	}

	if !strings.HasSuffix(file.Filename, ".csv") {
		return utils.BadRequestError(c, "Invalid file extension", nil)
	}

	err = utils.SaveMidTermCSV(file, *userId, event)
	if err != nil {
		return utils.InternalError(c, "Unable to save csv", &err)
	}

	err = utils.UploadMidTermScores(*userId, event)
	if err != nil {
		return utils.BadRequestError(c, "Unable to upload scores", &err)
	}

	return c.NoContent(http.StatusOK)
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

	if !config.EnvVars.DeclareResult {
		return c.JSON(200, nil)
	}

	rankings, err := dao.GetEventRanking(event)
	if err != nil {
		return utils.InternalError(c, "Unable to fetch event rankings", &err)
	}

	return c.JSON(200, &rankings)
}
