package controller

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

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
	// The signed-in account is the only one this endpoint may touch. It used to
	// take an email and registration number straight from the request body,
	// which let anyone create a row claiming to be a 2021 batch "senior" and
	// then sign in with that address to read every team's abstract. Sign-in
	// creates the row itself (GoogleCallback), so nothing legitimate depends on
	// this route creating one.
	userId, err := getSessionUserId(c)
	if err != nil {
		return utils.UnauthorizedError(c, "Your session has expired. Please sign in again.", &err)
	}

	user, err := dao.GetUser(*userId)
	if err != nil {
		return utils.InternalError(c, "We couldn't load your account right now. Please try again in a minute.", &err)
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
		return utils.UnauthorizedError(c, "Your session has expired. Please sign in again.", &err)
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
		return utils.UnauthorizedError(c, "Your session has expired. Please sign in again.", &err)
	}

	var dto models.RegisterTeamDto
	if err := c.Bind(&dto); err != nil {
		return utils.BadRequestError(c, "Something was wrong with the form. Please refresh the page and try again.", &err)
	}

	event, err := dao.ToEvent(dto.Event)
	if err != nil {
		return utils.BadRequestError(c, "Please choose one of the listed events.", &err)
	}

	team, err := dao.RegisterTeam(event, dto.TeamName, *userId, dto.MemberRegNoList)
	if err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
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
		return utils.UnauthorizedError(c, "Your session has expired. Please sign in again.", &err)
	}

	fEvent := c.FormValue("event")
	event, err := dao.ToEvent(fEvent)
	if err != nil {
		return utils.BadRequestError(c, "Please choose one of the listed events.", &err)
	}

	team, err := dao.GetTeam(event, *userId)
	if err != nil {
		return utils.InternalError(c, "We couldn't load your team right now. Please try again in a minute.", &err)
	}
	if team == nil {
		return utils.BadRequestError(c, "Register a team for this event first, then upload the abstract.", nil)
	}

	file, err := c.FormFile("file")
	if err != nil {
		return utils.BadRequestError(c, "Please choose a file to upload.", &err)
	}

	if file.Size > MaxFileSize {
		return utils.BadRequestError(c, "This PDF is larger than 3 MB. Please reduce its size and upload again.", nil)
	}

	if !strings.HasSuffix(strings.ToLower(file.Filename), ".pdf") {
		return utils.BadRequestError(c, "Only PDF files can be uploaded. Please save your abstract as a PDF.", nil)
	}
	if !utils.IsPDF(file) {
		return utils.BadRequestError(c, "This file doesn't look like a real PDF. Please export your abstract as a PDF and try again.", nil)
	}

	err = utils.SaveAbstract(file, event, team.TeamId)
	if err != nil {
		return utils.InternalError(c, "We couldn't save your abstract right now. Please try again in a minute.", &err)
	}

	err = dao.AddAbstractForTeam(team.TeamId)
	if err != nil {
		return utils.InternalError(c, "Your file was saved, but we couldn't record it. Please try uploading again.", &err)
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
		return utils.UnauthorizedError(c, "Your session has expired. Please sign in again.", &err)
	}

	user, err := dao.GetUser(*userId)
	if err != nil {
		return utils.InternalError(c, "We couldn't load your account right now. Please try again in a minute.", &err)
	}

	teamId, _ := strconv.Atoi(strTeamId)
	// A team's own members, the mentor allotted to it, and admins of the panel
	// may read the PDF. Everyone else is refused.
	isMember := dao.IsTeamMember(teamId, user.UserId)
	isMentor := dao.IsMentorForTeam(teamId, user.UserId)
	isAdmin := dao.IsAdmin(user.Email)
	if !isMember && !isMentor && !isAdmin && !dao.ValidSenior(&user.RegNo) {
		return utils.UnauthorizedError(c, "You can only view your own team's abstract.", nil)
	}
	// Reads outside your own team are logged, each under its own prefix so the
	// ADMIN trail keeps meaning "the panel did something".
	switch {
	case isAdmin:
		log.Printf("ADMIN: %s opened abstract for team %s", user.Email, strTeamId)
	case isMentor:
		log.Printf("MENTOR: %s opened abstract for team %s", user.Email, strTeamId)
	}

	path, err := utils.GetAbstractFile(strTeamId)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "No abstract has been uploaded for this team yet.", "error": ""})
	}
	// A replaced abstract must never be served from a stale cache.
	c.Response().Header().Set("Cache-Control", "no-store")
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
		return utils.UnauthorizedError(c, "Your session has expired. Please sign in again.", &err)
	}

	mentor := dao.CheckMentor(*userId)
	if mentor == nil {
		return utils.UnauthorizedError(c, "Only mentors can do this.", nil)
	}

	event := c.QueryParam("event")
	if event == "" {
		return utils.BadRequestError(c, "Please choose one of the listed events.", nil)
	}

	err = dao.Allot(*userId, event)
	if err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
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
		return utils.UnauthorizedError(c, "Your session has expired. Please sign in again.", &err)
	}

	mentor := dao.CheckMentor(*userId)
	if mentor == nil {
		return utils.UnauthorizedError(c, "Only mentors can do this.", nil)
	}

	event := c.QueryParam("event")
	if event == "" {
		return utils.BadRequestError(c, "Please choose one of the listed events.", nil)
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
		return utils.UnauthorizedError(c, "Your session has expired. Please sign in again.", &err)
	}

	mentor := dao.CheckMentor(*userId)
	if mentor == nil {
		return utils.UnauthorizedError(c, "Only mentors can do this.", nil)
	}

	event := c.FormValue("event")
	team, err := dao.GetTeamsForMentorEvent(*userId, event)
	if err != nil {
		return utils.InternalError(c, "We couldn't load your team right now. Please try again in a minute.", &err)
	}
	if team == nil {
		return utils.BadRequestError(c, "Register a team for this event first, then upload the abstract.", nil)
	}

	file, err := c.FormFile("file")
	if err != nil {
		return utils.BadRequestError(c, "Please choose a file to upload.", &err)
	}

	if file.Size > CSVFileSize {
		return utils.BadRequestError(c, "This CSV is larger than 512 KB. Please check you picked the right file.", nil)
	}

	if !strings.HasSuffix(file.Filename, ".csv") {
		return utils.BadRequestError(c, "Only CSV files can be uploaded here.", nil)
	}

	err = utils.SaveMidTermCSV(file, *userId, event)
	if err != nil {
		return utils.BadRequestError(c, "We couldn't save this CSV: "+err.Error(), nil)
	}

	err = utils.UploadMidTermScores(*userId, event)
	if err != nil {
		return utils.BadRequestError(c, "We couldn't read the scores in this CSV: "+err.Error(), nil)
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
		return utils.BadRequestError(c, "Please choose one of the listed events.", &err)
	}

	if !config.EnvVars.DeclareResult {
		// An empty list, not null: a caller that maps over this response should
		// see nothing to draw, not a crash, the day results are declared.
		return c.JSON(200, []models.DashboardTeam{})
	}

	rankings, err := dao.GetEventRanking(event)
	if err != nil {
		return utils.InternalError(c, "Unable to fetch event rankings", &err)
	}

	return c.JSON(200, &rankings)
}

// deadlineDto tells the site when registration closes, so the landing page can
// show a countdown without hardcoding a date into the build.
type deadlineDto struct {
	Deadline int64 `json:"deadline"`
	Passed   bool  `json:"passed"`
}

// GetRegistrationDeadline
//
// @Summary Registration deadline
// @Schemes
// @Description The unix timestamp after which registration and abstract submission close, and whether that moment has passed. Public on purpose: the deadline is not a secret.
// @Tags CodeSangam
// @Accept json
// @Produce json
// @Success 200 {object} deadlineDto
// @Router /v1/cs/deadline [get]
func GetRegistrationDeadline(c echo.Context) error {
	deadline := config.EnvVars.RegistrationDeadline
	// A deadline of 0 means "not configured", which is reported as not passed so
	// no part of the site hides itself because of a missing value.
	passed := deadline > 0 && time.Now().Unix() >= deadline
	return c.JSON(http.StatusOK, deadlineDto{Deadline: deadline, Passed: passed})
}
