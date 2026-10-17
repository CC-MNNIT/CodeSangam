package controller

import (
	"log"
	"net/http"
	"strconv"

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
		"BaseUrl":    config.EnvVars.BaseUrl,
		"Email":      me,
		"Teams":      overview.Teams,
		"Users":      overview.Users,
		"Events":     overview.Counts,
		"Admins":     rows,
		"TeamCount":  len(overview.Teams),
		"UserCount":  len(overview.Users),
		"AdminCount": len(rows),
	})
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
