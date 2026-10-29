package controller

import (
	"bytes"
	"encoding/csv"
	"errors"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
	"github.com/labstack/echo/v4"
)

// SubmitProjectLinks stores the signed-in member's own team's final links.
// Registration and abstract deadlines deliberately do not apply here.
//
// @Summary Submit or update final project links
// @Tags CodeSangam
// @Accept json
// @Produce json
// @Param X-CS-Project header string true "1"
// @Param links body models.ProjectLinksDto true "Both links are required"
// @Success 200 {object} models.ProjectLinksResponse
// @Failure 400 {string} string "Check the event and both links"
// @Failure 401 {string} string "Sign in first"
// @Router /v1/cs/project [post]
func SubmitProjectLinks(c echo.Context) error {
	userId, err := getSessionUserId(c)
	if err != nil {
		return utils.UnauthorizedError(c, "Your session has expired. Please sign in again.", nil)
	}
	var dto models.ProjectLinksDto
	if err := c.Bind(&dto); err != nil {
		return utils.BadRequestError(c, "We couldn't read those links. Reload the form and try again.", nil)
	}
	event, err := dao.ToEvent(strings.TrimSpace(dto.Event))
	if err != nil || !dao.ProjectSubmissionEvent(event) {
		return utils.BadRequestError(c, "Please choose one of your registered teams.", nil)
	}
	team, err := dao.GetTeam(event, *userId)
	if err != nil {
		return utils.InternalError(c, "We couldn't load your team. Please try again in a minute.", &err)
	}
	if team == nil {
		return utils.BadRequestError(c, "You do not have a registered team for that event. Contact the organizers if your team is missing.", nil)
	}
	github, video, err := utils.NormaliseProjectLinks(dto.GithubURL, dto.VideoURL)
	if err != nil {
		return projectValidationError(c, err)
	}
	project, err := dao.SaveProjectLinks(team.TeamId, github, video)
	if err != nil {
		return utils.InternalError(c, "Your links were not saved. Keep them in the form and try again in a minute.", &err)
	}
	log.Printf("PROJECT: user %d saved links for %s#%d", *userId, event, team.TeamId)
	c.Response().Header().Set(echo.HeaderCacheControl, "no-store")
	return c.JSON(http.StatusOK, models.ProjectLinksResponse{Message: "Both project links are saved.", Project: project})
}

func projectValidationError(c echo.Context, err error) error {
	field := ""
	var linkErr *utils.ProjectLinkError
	if errors.As(err, &linkErr) {
		field = linkErr.Field
	}
	return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error(), "field": field, "error": ""})
}

type adminProjectDto struct {
	models.ProjectLinksDto
	TeamId int `json:"team_id"`
}

// AdminSetProjectLinks uses the existing admin session, CSRF header and audit
// trail to record links received outside the team's form.
//
// @Summary Set final links on behalf of a team
// @Tags Admin
// @Accept json
// @Produce json
// @Param links body adminProjectDto true "Event, team id and both links"
// @Success 200 {object} models.ProjectLinksResponse
// @Router /admin/team/project [post]
func AdminSetProjectLinks(c echo.Context) error {
	var dto adminProjectDto
	if err := c.Bind(&dto); err != nil || dto.TeamId <= 0 {
		return utils.BadRequestError(c, "Choose a registered team and provide both links.", nil)
	}
	event, err := dao.ToEvent(strings.TrimSpace(dto.Event))
	if err != nil || !dao.ProjectSubmissionEvent(event) {
		return utils.BadRequestError(c, "Final project links are accepted only for DroidRush, Webster and Softablitz.", nil)
	}
	github, video, err := utils.NormaliseProjectLinks(dto.GithubURL, dto.VideoURL)
	if err != nil {
		return projectValidationError(c, err)
	}
	project, err := dao.SetProjectLinksForTeam(event, dto.TeamId, github, video)
	if err != nil {
		return utils.BadRequestError(c, "We couldn't save the links. Check that this team is still registered for the selected event.", &err)
	}
	audit(c, "set-project-links", event.String()+"#"+strconv.Itoa(dto.TeamId))
	c.Response().Header().Set(echo.HeaderCacheControl, "no-store")
	return c.JSON(http.StatusOK, models.ProjectLinksResponse{Message: "Both project links are saved.", Project: project})
}

// ProjectLinksCSV includes registered teams without submissions so organizers
// can see what is missing. Team id, not team name, is the workbook join key.
//
// @Summary Download final submission links
// @Tags Admin
// @Produce text/csv
// @Param event query string false "Optional event tag"
// @Success 200 {string} string "CSV of teams and final project links"
// @Failure 403 {string} string "Admins only"
// @Router /v1/cs/project/links.csv [get]
func ProjectLinksCSV(c echo.Context) error {
	only := strings.TrimSpace(c.QueryParam("event"))
	if only != "" {
		event, err := dao.ToEvent(only)
		if err != nil || !dao.ProjectSubmissionEvent(event) {
			return utils.BadRequestError(c, "Choose a valid event.", nil)
		}
	}
	overview, err := dao.GetAdminOverview()
	if err != nil {
		return utils.InternalError(c, "We couldn't prepare the links export. Please try again in a minute.", &err)
	}
	sort.Slice(overview.Teams, func(i, j int) bool {
		a, b := overview.Teams[i], overview.Teams[j]
		if a.EventTag != b.EventTag {
			return a.EventTag < b.EventTag
		}
		if strings.ToLower(a.Name) != strings.ToLower(b.Name) {
			return strings.ToLower(a.Name) < strings.ToLower(b.Name)
		}
		return a.TeamId < b.TeamId
	})
	var data bytes.Buffer
	data.WriteString("\uFEFF") // Let Excel recognize UTF-8 team names.
	writer := csv.NewWriter(&data)
	writer.UseCRLF = true
	if err := writer.Write([]string{"team_id", "team_name", "event", "leader", "github_url", "video_url", "updated_at"}); err != nil {
		return err
	}
	for _, team := range overview.Teams {
		event, eventErr := dao.ToEvent(team.EventTag)
		if eventErr != nil || !dao.ProjectSubmissionEvent(event) {
			continue
		}
		if only != "" && team.EventTag != only {
			continue
		}
		leader, updated := "", ""
		for _, member := range team.Members {
			if member.Leader {
				leader = member.Name
				break
			}
		}
		if !team.ProjectUpdatedAt.IsZero() {
			updated = team.ProjectUpdatedAt.UTC().Format(time.RFC3339)
		}
		if err := writer.Write([]string{strconv.Itoa(team.TeamId), csvSafeCell(team.Name), team.EventTag, csvSafeCell(leader), team.GithubURL, team.VideoURL, updated}); err != nil {
			return err
		}
	}
	writer.Flush()
	if err := writer.Error(); err != nil {
		return utils.InternalError(c, "We couldn't prepare the links export.", &err)
	}
	name := "CodeSangam_Final_Links"
	if only != "" {
		name += "_" + only
	}
	c.Response().Header().Set(echo.HeaderContentDisposition, `attachment; filename="`+name+`.csv"`)
	c.Response().Header().Set(echo.HeaderCacheControl, "no-store")
	c.Response().Header().Set("X-Content-Type-Options", "nosniff")
	audit(c, "export-project-links", "event="+only)
	return c.Blob(http.StatusOK, "text/csv; charset=utf-8", data.Bytes())
}

// Quoting CSV alone does not stop spreadsheet formulas in user-chosen names.
func csvSafeCell(value string) string {
	trimmed := strings.TrimLeftFunc(value, unicode.IsSpace)
	if trimmed != "" && strings.ContainsRune("=+-@", rune(trimmed[0])) {
		return "'" + value
	}
	if strings.HasPrefix(value, "\t") || strings.HasPrefix(value, "\r") || strings.HasPrefix(value, "\n") {
		return "'" + value
	}
	return value
}
