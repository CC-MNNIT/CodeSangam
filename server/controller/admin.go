package controller

import (
	"archive/zip"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/middleware"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
	"github.com/labstack/echo/v4"
)

type adminTeamDto struct {
	Event  string `json:"event"`
	TeamId int    `json:"team_id"`
	Name   string `json:"name"`
	RegNo  string `json:"reg_no"`
	UserId int    `json:"user_id"`
}

type adminUserDto struct {
	UserId int    `json:"user_id"`
	Name   string `json:"name"`
	RegNo  string `json:"reg_no"`
}

type adminEmailDto struct {
	Email string `json:"email"`
}

type adminRow struct {
	models.Admin
	Founding bool
	Self     bool
}

func adminEmail(c echo.Context) string {
	email, _ := c.Get(middleware.AdminEmailKey).(string)
	return email
}

func audit(c echo.Context, action string, detail string) {
	log.Printf("ADMIN: %s %s %s", adminEmail(c), action, detail)
}

func ok(c echo.Context, msg string) error {
	return c.JSON(http.StatusOK, map[string]string{"message": msg})
}

// AdminPage renders the admin panel with every team, person and admin.
//
// @Summary Admin panel
// @Tags Admin
// @Produce html
// @Router /admin [get]
func AdminPage(c echo.Context) error {
	overview, err := dao.GetAdminOverview()
	if err != nil {
		return utils.InternalError(c, "Unable to load admin data", &err)
	}
	attachAbstractVersions(overview.Teams)
	admins, err := dao.ListAdmins()
	if err != nil {
		return utils.InternalError(c, "Unable to load admins", &err)
	}
	me := adminEmail(c)
	rows := make([]adminRow, 0, len(admins))
	for _, a := range admins {
		rows = append(rows, adminRow{Admin: a, Founding: dao.IsFoundingAdmin(a.Email), Self: a.Email == me})
	}
	return c.Render(http.StatusOK, "admin.html", map[string]interface{}{
		"BaseUrl":      config.EnvVars.BaseUrl,
		"Email":        me,
		"Teams":        overview.Teams,
		"Users":        overview.Users,
		"Events":       overview.Counts,
		"Admins":       rows,
		"AnyAbstracts": anyAbstract(overview.Teams),
		"TeamCount":    len(overview.Teams),
		"UserCount":    len(overview.Users),
		"AdminCount":   len(rows),
	})
}

// anyAbstract reports whether any team has a submission on record, so the panel
// only offers the zip download when it would have something in it.
func anyAbstract(teams []dao.AdminTeam) bool {
	for _, team := range teams {
		if team.Abstract {
			return true
		}
	}
	return false
}

func bindTeam(c echo.Context) (*adminTeamDto, dao.Event, error) {
	var dto adminTeamDto
	if err := c.Bind(&dto); err != nil {
		return nil, "", err
	}
	event, err := dao.ToEvent(dto.Event)
	if err != nil {
		return nil, "", err
	}
	return &dto, event, nil
}

func AdminRenameTeam(c echo.Context) error {
	dto, event, err := bindTeam(c)
	if err != nil {
		return utils.BadRequestError(c, "Invalid request", &err)
	}
	if err := dao.RenameTeam(event, dto.TeamId, dto.Name); err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
	}
	audit(c, "rename-team", event.String()+"#"+strconv.Itoa(dto.TeamId)+" -> "+dto.Name)
	return ok(c, "Team renamed")
}

func AdminAddMember(c echo.Context) error {
	dto, event, err := bindTeam(c)
	if err != nil {
		return utils.BadRequestError(c, "Invalid request", &err)
	}
	if err := dao.AddTeamMember(event, dto.TeamId, dto.RegNo); err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
	}
	audit(c, "add-member", event.String()+"#"+strconv.Itoa(dto.TeamId)+" + "+dto.RegNo)
	return ok(c, "Member added")
}

func AdminRemoveMember(c echo.Context) error {
	dto, event, err := bindTeam(c)
	if err != nil {
		return utils.BadRequestError(c, "Invalid request", &err)
	}
	if err := dao.RemoveTeamMember(event, dto.TeamId, dto.UserId); err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
	}
	audit(c, "remove-member", event.String()+"#"+strconv.Itoa(dto.TeamId)+" - uid "+strconv.Itoa(dto.UserId))
	return ok(c, "Member removed")
}

func AdminRevokeTeam(c echo.Context) error {
	dto, event, err := bindTeam(c)
	if err != nil {
		return utils.BadRequestError(c, "Invalid request", &err)
	}
	if err := dao.RevokeTeam(event, dto.TeamId); err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
	}
	// The database rows are gone; take the PDF with them, otherwise it lingers
	// on disk forever - invisible to the panel, and still readable by anyone
	// who kept the old URL.
	if path, found := utils.AbstractPath(dto.TeamId, event.String()); found {
		if err := os.Remove(path); err != nil {
			log.Println("ADMIN: could not delete the abstract for " + path + ": " + err.Error())
		}
	}
	audit(c, "revoke-team", event.String()+"#"+strconv.Itoa(dto.TeamId))
	return ok(c, "Registration revoked")
}

func AdminUpdateUser(c echo.Context) error {
	var dto adminUserDto
	if err := c.Bind(&dto); err != nil {
		return utils.BadRequestError(c, "Invalid request", &err)
	}
	if err := dao.UpdateUser(dto.UserId, dto.Name, dto.RegNo); err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
	}
	audit(c, "update-user", "uid "+strconv.Itoa(dto.UserId)+" -> "+dto.Name+" / "+dto.RegNo)
	return ok(c, "Details saved")
}

func AdminDeleteUser(c echo.Context) error {
	var dto adminUserDto
	if err := c.Bind(&dto); err != nil {
		return utils.BadRequestError(c, "Invalid request", &err)
	}
	if err := dao.DeleteUser(dto.UserId); err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
	}
	audit(c, "delete-user", "uid "+strconv.Itoa(dto.UserId))
	return ok(c, "Person removed")
}

func AdminAddAdmin(c echo.Context) error {
	var dto adminEmailDto
	if err := c.Bind(&dto); err != nil {
		return utils.BadRequestError(c, "Invalid request", &err)
	}
	if err := dao.AddAdmin(dto.Email, adminEmail(c)); err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
	}
	audit(c, "add-admin", dto.Email)
	return ok(c, "Admin added")
}

func AdminRemoveAdmin(c echo.Context) error {
	var dto adminEmailDto
	if err := c.Bind(&dto); err != nil {
		return utils.BadRequestError(c, "Invalid request", &err)
	}
	if err := dao.RemoveAdmin(dto.Email, adminEmail(c)); err != nil {
		return utils.BadRequestError(c, err.Error(), nil)
	}
	audit(c, "remove-admin", dto.Email)
	return ok(c, "Admin removed")
}

// attachAbstractVersions fills in the on-disk timestamp of each team's abstract.
//
// It lives in the controller rather than dao because dao cannot import utils
// (utils imports dao), so the storage path stays defined in exactly one place.
// A team recorded in the abstract table but missing from disk keeps 0, and the
// panel then shows no link to it.
func attachAbstractVersions(teams []dao.AdminTeam) {
	for i := range teams {
		uploaded := utils.AbstractUploadedAt(teams[i].TeamId, teams[i].EventTag)
		if uploaded.IsZero() {
			continue
		}
		teams[i].AbstractVersion = uploaded.Unix()
		teams[i].AbstractLabel = uploaded.In(ist).Format("2 Jan 2006, 3:04 PM")
	}
}

// zipSafeName turns a team name into a zip entry name that cannot escape its
// folder: no separators, no control characters, bounded length, never empty.
func zipSafeName(name string, teamId int) string {
	const reserved = `/\:*?"<>|`
	var b strings.Builder
	for _, r := range strings.TrimSpace(name) {
		if b.Len() >= 60 {
			break
		}
		switch {
		case r < 32 || r == 127:
			// control character: dropped
		case strings.ContainsRune(reserved, r):
			b.WriteRune('-')
		case r == ' ' || r == '\t':
			b.WriteRune('_')
		default:
			b.WriteRune(r)
		}
	}
	if clean := strings.Trim(b.String(), "_-"); clean != "" {
		return clean
	}
	return fmt.Sprintf("team-%d", teamId)
}

// AdminAbstractsZip streams every submitted abstract as one zip, grouped into a
// folder per event, with a README that maps each file back to its team.
//
// @Summary Download all abstracts
// @Tags Admin
// @Produce application/zip
// @Param event query string false "limit to a single event tag"
// @Success 200 {string} string "application/zip"
// @Failure 403 {string} Forbidden
// @Failure 404 {string} NotFound
// @Router /admin/abstracts.zip [get]
func AdminAbstractsZip(c echo.Context) error {
	only := strings.TrimSpace(c.QueryParam("event"))
	if only != "" {
		// Validated rather than interpolated blindly: this value ends up in the
		// Content-Disposition header.
		if _, err := dao.ToEvent(only); err != nil {
			return utils.BadRequestError(c, "Unknown event.", nil)
		}
	}

	overview, err := dao.GetAdminOverview()
	if err != nil {
		return utils.InternalError(c, "Unable to load admin data", &err)
	}

	// Gather the list before writing anything: response headers have to be set
	// before the body, and a download with nothing in it should be a clear 404
	// rather than a 22 byte zip the browser saves without explanation.
	type entry struct {
		name string
		path string
	}
	entries := make([]entry, 0, len(overview.Teams))
	readme := strings.Builder{}
	readme.WriteString("event\tteam_id\tteam_name\tuploaded_at_ist\n")
	for _, team := range overview.Teams {
		if only != "" && team.EventTag != only {
			continue
		}
		path, found := utils.AbstractPath(team.TeamId, team.EventTag)
		if !found {
			continue
		}
		entries = append(entries, entry{
			name: fmt.Sprintf("%s/%03d_%s.pdf", team.EventTag, team.TeamId, zipSafeName(team.Name, team.TeamId)),
			path: path,
		})
		readme.WriteString(fmt.Sprintf("%s\t%d\t%s\t%s\n",
			team.EventTag,
			team.TeamId,
			strings.NewReplacer("\t", " ", "\n", " ", "\r", " ").Replace(team.Name),
			utils.AbstractUploadedAt(team.TeamId, team.EventTag).In(ist).Format("2 Jan 2006, 3:04 PM")))
	}
	if len(entries) == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "No abstracts have been uploaded yet.", "error": ""})
	}

	name := "codesangam-abstracts.zip"
	if only != "" {
		name = "codesangam-abstracts-" + only + ".zip"
	}
	c.Response().Header().Set(echo.HeaderContentType, "application/zip")
	c.Response().Header().Set(echo.HeaderContentDisposition, `attachment; filename="`+name+`"`)
	// This bundle is every submission in one file; never let a proxy or the
	// browser keep a copy.
	c.Response().Header().Set("Cache-Control", "no-store")
	c.Response().WriteHeader(http.StatusOK)

	archive := zip.NewWriter(c.Response())
	if readmeFile, err := archive.Create("README.txt"); err == nil {
		_, _ = io.WriteString(readmeFile, readme.String())
	}
	included := 0
	for _, e := range entries {
		source, err := os.Open(e.path)
		if err != nil {
			log.Println("ADMIN: skipping unreadable abstract " + e.path + ": " + err.Error())
			continue
		}
		target, err := archive.Create(e.name)
		if err == nil {
			_, err = io.Copy(target, source)
		}
		source.Close()
		if err != nil {
			log.Println("ADMIN: could not add " + e.path + " to the zip: " + err.Error())
			continue
		}
		included++
	}
	if err := archive.Close(); err != nil {
		log.Println("ADMIN: could not finish the abstracts zip: " + err.Error())
	}
	audit(c, "download-abstracts", fmt.Sprintf("%s: %d file(s)", name, included))
	return nil
}
