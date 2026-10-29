package dao

import (
	"errors"
	"net/mail"
	"sort"
	"strings"
	"time"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"gorm.io/gorm"
)

const adminTable Event = "admin"

// FoundingAdmins always have access and can never be removed from the panel,
// so the site can't be locked out of its own admin page.
var FoundingAdmins = []string{
	"ayush.20234046@mnnit.ac.in",
	"shanu.20238024@mnnit.ac.in",
}

// AdminEvents is the order events are shown in on the admin page.
var AdminEvents = []Event{droidTable, websterTable, softTable, logicalTable}

// ---------------------------------------------------------------- admins

func normaliseEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

// IsFoundingAdmin reports whether email is one of the permanent admins.
func IsFoundingAdmin(email string) bool {
	email = normaliseEmail(email)
	for _, a := range FoundingAdmins {
		if a == email {
			return true
		}
	}
	return false
}

// EnsureAdmins creates the admin table if it is missing and seeds the
// founding admins. Safe to run on every start.
func EnsureAdmins() error {
	if err := config.Db.Table(adminTable.String()).AutoMigrate(&models.Admin{}); err != nil {
		return err
	}
	for _, email := range FoundingAdmins {
		admin := models.Admin{Email: email, AddedBy: "founding", CreatedAt: time.Now()}
		err := config.Db.Table(adminTable.String()).
			Where("email = ?", email).
			FirstOrCreate(&admin).Error
		if err != nil {
			return err
		}
	}
	return nil
}

func IsAdmin(email string) bool {
	email = normaliseEmail(email)
	if email == "" {
		return false
	}
	if IsFoundingAdmin(email) {
		return true
	}
	var count int64
	err := config.Db.Table(adminTable.String()).Where("email = ?", email).Count(&count).Error
	return err == nil && count > 0
}

func ListAdmins() ([]models.Admin, error) {
	var admins []models.Admin
	err := config.Db.Table(adminTable.String()).Order("created_at asc").Find(&admins).Error
	return admins, err
}

func AddAdmin(email string, addedBy string) error {
	email = normaliseEmail(email)
	addr, err := mail.ParseAddress(email)
	if err != nil || addr.Address != email {
		return errors.New("enter a valid email address")
	}
	if IsAdmin(email) {
		return errors.New(email + " is already an admin")
	}
	return config.Db.Table(adminTable.String()).Create(&models.Admin{
		Email:     email,
		AddedBy:   normaliseEmail(addedBy),
		CreatedAt: time.Now(),
	}).Error
}

func RemoveAdmin(email string, removedBy string) error {
	email = normaliseEmail(email)
	if IsFoundingAdmin(email) {
		return errors.New("founding admins cannot be removed")
	}
	if email == normaliseEmail(removedBy) {
		return errors.New("you cannot remove yourself")
	}
	result := config.Db.Table(adminTable.String()).Where("email = ?", email).Delete(&models.Admin{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New(email + " is not an admin")
	}
	return nil
}

// ---------------------------------------------------------------- overview

type AdminMember struct {
	UserId int
	Name   string
	RegNo  string
	Email  string
	Avatar string
	Leader bool
}

type AdminTeam struct {
	EventTag  string
	EventName string
	TeamId    int
	Name      string
	Members   []AdminMember
	Abstract  bool
	// AbstractVersion is the abstract file's last-modified time in unix
	// seconds, or 0 when no file is on disk. The panel links to a PDF only
	// when this is set, so a recorded submission whose file went missing can
	// never produce a dead link. AbstractLabel is the same moment, already
	// formatted for display. Both are filled in by the controller, because dao
	// cannot import utils (utils imports dao) and the file path lives there.
	AbstractVersion  int64
	AbstractLabel    string
	HasMentor        bool
	Full             bool
	GithubURL        string
	VideoURL         string
	ProjectUpdatedAt time.Time
	// Formatted in IST by the controller, like AbstractLabel.
	ProjectUpdated string
}

type AdminUser struct {
	UserId int
	Name   string
	RegNo  string
	Email  string
	Avatar string
	// Event names this person is registered in.
	Events []string
}

type AdminEventCount struct {
	Tag   string
	Name  string
	Teams int
}

type AdminOverview struct {
	Teams  []AdminTeam
	Users  []AdminUser
	Counts []AdminEventCount
}

// GetAdminOverview loads every registered team (per event) and every person
// who has signed in, in a handful of queries.
func GetAdminOverview() (*AdminOverview, error) {
	var users []models.User
	if err := config.Db.Table(userTable.String()).Order("name asc").Find(&users).Error; err != nil {
		return nil, err
	}
	byId := make(map[int]models.User, len(users))
	for _, u := range users {
		byId[u.UserId] = u
	}

	abstracts := map[int]bool{}
	var abstractIds []int
	if err := config.Db.Table(abstractTable.String()).Pluck("team_id", &abstractIds).Error; err == nil {
		for _, id := range abstractIds {
			abstracts[id] = true
		}
	}
	mentored := map[int]bool{}
	var allottedIds []int
	if err := config.Db.Table(allotmentTable.String()).Pluck("team_id", &allottedIds).Error; err == nil {
		for _, id := range allottedIds {
			mentored[id] = true
		}
	}
	projects, err := AllProjectLinks()
	if err != nil {
		return nil, err
	}

	overview := &AdminOverview{}
	userEvents := map[int][]string{}

	for _, event := range AdminEvents {
		name, _ := ToEventName(event)
		var teams []models.Team
		err := config.Db.Raw(`SELECT t.* FROM ` + teamTable.String() + ` t INNER JOIN ` + event.String() + ` e ON e.team_id = t.id ORDER BY t.id ASC`).
			Scan(&teams).Error
		if err != nil {
			return nil, err
		}
		overview.Counts = append(overview.Counts, AdminEventCount{Tag: event.String(), Name: name, Teams: len(teams)})

		for _, t := range teams {
			row := AdminTeam{
				EventTag:  event.String(),
				EventName: name,
				TeamId:    t.TeamId,
				Name:      t.Name,
				Abstract:  abstracts[t.TeamId],
				HasMentor: mentored[t.TeamId],
			}
			for i, id := range []int{t.LeaderId, t.MemberId1, t.MemberId2} {
				if id <= 0 {
					continue
				}
				u, ok := byId[id]
				if !ok {
					continue
				}
				row.Members = append(row.Members, AdminMember{
					UserId: u.UserId, Name: u.Name, RegNo: u.RegNo, Email: u.Email, Avatar: u.Avatar, Leader: i == 0,
				})
				userEvents[u.UserId] = append(userEvents[u.UserId], name)
			}
			row.Full = t.MemberId1 > 0 && t.MemberId2 > 0
			if project, ok := projects[t.TeamId]; ok {
				row.GithubURL = project.GithubURL
				row.VideoURL = project.VideoURL
				row.ProjectUpdatedAt = project.UpdatedAt
			}
			overview.Teams = append(overview.Teams, row)
		}
	}

	for _, u := range users {
		evs := userEvents[u.UserId]
		sort.Strings(evs)
		overview.Users = append(overview.Users, AdminUser{
			UserId: u.UserId, Name: u.Name, RegNo: u.RegNo, Email: u.Email, Avatar: u.Avatar, Events: evs,
		})
	}
	return overview, nil
}

// ---------------------------------------------------------------- teams

func getEventTeam(tx *gorm.DB, event Event, teamId int) (*models.Team, error) {
	var count int64
	if err := tx.Table(event.String()).Where("team_id = ?", teamId).Count(&count).Error; err != nil {
		return nil, err
	}
	if count == 0 {
		return nil, errors.New("team is not registered for this event")
	}
	var team models.Team
	if err := tx.Table(teamTable.String()).Where("id = ?", teamId).First(&team).Error; err != nil {
		return nil, errors.New("team not found")
	}
	return &team, nil
}

// SetProjectLinksForTeam lets an admin store a team's final submission when
// the links arrive out of band (WhatsApp, email) instead of through the form.
// Validation happens in the controller; this only checks the team really is
// registered for the event before writing.
func SetProjectLinksForTeam(event Event, teamId int, githubURL string, videoURL string) (*models.Project, error) {
	if _, err := getEventTeam(config.Db, event, teamId); err != nil {
		return nil, err
	}
	return SaveProjectLinks(teamId, githubURL, videoURL)
}

func RenameTeam(event Event, teamId int, name string) error {
	name = strings.TrimSpace(name)
	if l := len(name); l < 1 || l > 255 {
		return errors.New("team name must be 1–255 characters")
	}
	if _, err := getEventTeam(config.Db, event, teamId); err != nil {
		return err
	}
	return config.Db.Table(teamTable.String()).Where("id = ?", teamId).Update("name", name).Error
}

// AddTeamMember puts the person with regNo into the team's first empty slot.
// They must have signed in to the site at least once, and must not already
// be in another team for the same event.
func AddTeamMember(event Event, teamId int, regNo string) error {
	regNo = strings.TrimSpace(regNo)
	if regNo == "" {
		return errors.New("enter a registration number")
	}
	team, err := getEventTeam(config.Db, event, teamId)
	if err != nil {
		return err
	}
	user, err := GetUserByRegNo(&regNo)
	if err != nil {
		return errors.New("no one with reg no " + regNo + " has signed in yet")
	}
	for _, id := range []int{team.LeaderId, team.MemberId1, team.MemberId2} {
		if id == user.UserId {
			return errors.New(user.Name + " is already in this team")
		}
	}
	if !userAllowed(event, user) {
		return errors.New(user.Name + " is already in another team for this event")
	}
	column := ""
	switch {
	case team.MemberId1 <= 0:
		column = "m_id1"
	case team.MemberId2 <= 0:
		column = "m_id2"
	default:
		return errors.New("team is full (3 members)")
	}
	return config.Db.Table(teamTable.String()).Where("id = ?", teamId).Update(column, user.UserId).Error
}

// RemoveTeamMember takes someone out of a team. Removing the leader promotes
// the next member; the last member cannot be removed (revoke the team).
func RemoveTeamMember(event Event, teamId int, userId int) error {
	team, err := getEventTeam(config.Db, event, teamId)
	if err != nil {
		return err
	}
	members := []int{}
	found := false
	for _, id := range []int{team.LeaderId, team.MemberId1, team.MemberId2} {
		if id <= 0 {
			continue
		}
		if id == userId {
			found = true
			continue
		}
		members = append(members, id)
	}
	if !found {
		return errors.New("that person is not in this team")
	}
	if len(members) == 0 {
		return errors.New("they are the only member — revoke the team instead")
	}
	slots := []int{0, 0, 0}
	copy(slots, members)
	return config.Db.Table(teamTable.String()).Where("id = ?", teamId).Updates(map[string]interface{}{
		"leader_id": slots[0],
		"m_id1":     slots[1],
		"m_id2":     slots[2],
	}).Error
}

// RevokeTeam deletes a team's registration for an event together with its
// abstract record, final project links and mentor allotment.
func RevokeTeam(event Event, teamId int) error {
	return config.Db.Transaction(func(tx *gorm.DB) error {
		if _, err := getEventTeam(tx, event, teamId); err != nil {
			return err
		}
		steps := []struct {
			table  Event
			column string
		}{
			{event, "team_id"},
			{allotmentTable, "team_id"},
			{abstractTable, "team_id"},
			{projectTable, "team_id"},
			{teamTable, "id"},
		}
		for _, s := range steps {
			if err := tx.Exec(`DELETE FROM `+s.table.String()+` WHERE `+s.column+` = ?`, teamId).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

// ---------------------------------------------------------------- people

func UpdateUser(userId int, name string, regNo string) error {
	name = strings.TrimSpace(name)
	regNo = strings.TrimSpace(regNo)
	if name == "" || regNo == "" {
		return errors.New("name and reg no are required")
	}
	if _, err := GetUser(userId); err != nil {
		return errors.New("person not found")
	}
	if other, err := GetUserByRegNo(&regNo); err == nil && other.UserId != userId {
		return errors.New("reg no " + regNo + " already belongs to " + other.Name)
	}
	return config.Db.Table(userTable.String()).Where("uid = ?", userId).Updates(map[string]interface{}{
		"name":            name,
		"registration_no": regNo,
	}).Error
}

// DeleteUser removes a person who is not in any team and is not a mentor.
// They will be recreated if they sign in again.
func DeleteUser(userId int) error {
	user, err := GetUser(userId)
	if err != nil {
		return errors.New("person not found")
	}
	for _, event := range AdminEvents {
		team, err := GetTeam(event, userId)
		if err != nil {
			return err
		}
		if team != nil {
			return errors.New(user.Name + " is in a team — remove them from it first")
		}
	}
	var allotted int64
	config.Db.Table(allotmentTable.String()).Where("user_id = ?", userId).Count(&allotted)
	if allotted > 0 {
		return errors.New(user.Name + " is a mentor with allotted teams")
	}
	return config.Db.Table(userTable.String()).Where("uid = ?", userId).Delete(&models.User{}).Error
}
