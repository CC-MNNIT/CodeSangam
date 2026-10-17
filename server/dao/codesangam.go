package dao

import (
	"errors"
	"math/rand"
	"regexp"
	"strconv"
	"strings"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"gorm.io/gorm"
)

type Event string

const (
	// Table name
	userTable      Event = "user"
	teamTable      Event = "team"
	mentorTable    Event = "mentor"
	allotmentTable Event = "allotment"
	abstractTable  Event = "abstract"

	droidTable   Event = "droidrush"
	softTable    Event = "softablitz"
	logicalTable Event = "logical"
	websterTable Event = "webster"
)

var events = []Event{
	droidTable,
	websterTable,
	softTable,
	logicalTable,
}

var toEvent = map[string]Event{
	"droidrush":  droidTable,
	"softablitz": softTable,
	"logical":    logicalTable,
	"webster":    websterTable,
}

var toEventName = map[Event]string{
	droidTable:   "DroidRush",
	softTable:    "Softablitz",
	logicalTable: "Logical Rhythm",
	websterTable: "Webster",
}

func (e Event) String() string {
	return string(e)
}

func ToEvent(s string) (Event, error) {
	value, ok := toEvent[s]
	if !ok {
		return "", errors.New("invalid event")
	}
	return value, nil
}

func ToEventName(event Event) (string, error) {
	value, ok := toEventName[event]
	if !ok {
		return "", errors.New("invalid event")
	}
	return value, nil
}

func SaveUser(dto *models.UserDto) (*models.User, error) {
	if pUser, _ := GetUserByEmail(&dto.Email); pUser != nil {
		return pUser, nil
	}

	var user models.User

	result := config.Db.Table(userTable.String()).Create(&models.User{
		RegNo:  dto.RegNo,
		Name:   dto.Name,
		Email:  dto.Email,
		Avatar: dto.Avatar,
	}).Scan(&user)

	if err := result.Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func GetUserByEmail(email *string) (*models.User, error) {
	var user models.User
	result := config.Db.Table(userTable.String()).Where("email = ?", *email).First(&user)
	if err := result.Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func GetUserByRegNo(regNo *string) (*models.User, error) {
	var user models.User
	result := config.Db.Table(userTable.String()).Where("registration_no = ?", *regNo).First(&user)
	if err := result.Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func GetUser(id int) (*models.User, error) {
	if id == 0 {
		return nil, errors.New("invalid user id")
	}

	var user models.User
	result := config.Db.Table(userTable.String()).Where("uid = ?", id).First(&user)
	if err := result.Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func GetUserInfo(id int) (*models.DashboardUserDto, error) {
	user, err := GetUser(id)
	if err != nil {
		return nil, err
	}

	userInfo := models.DashboardUserDto{
		User: user,
	}

	// Get DashboardTeam
	for i, event := range events {
		dashboardTeam, err := GetDashboardTeam(event, id)
		if err != nil {
			return nil, err
		}
		switch i {
		case 0:
			userInfo.DroidRushTeam = dashboardTeam
		case 1:
			userInfo.WebsterTeam = dashboardTeam
		case 2:
			userInfo.SoftablitzTeam = dashboardTeam
		case 3:
			userInfo.LogicalRhythmTeam = dashboardTeam
		}
	}
	return &userInfo, nil
}

func GetTeam(event Event, userId int) (*models.Team, error) {
	var team models.Team
	err := config.Db.
		Raw(`SELECT * FROM `+event.String()+` d INNER JOIN `+teamTable.String()+` t ON t.id = d.team_id WHERE leader_id = ? OR m_id1 = ? OR m_id2 = ?`, userId, userId, userId).
		First(&team).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &team, nil
}

func GetDashboardTeam(event Event, userId int) (*models.DashboardTeam, error) {
	team, err := GetTeam(event, userId)
	if err != nil {
		return nil, err
	}
	if team == nil {
		return nil, nil
	}

	mentor, _ := GetMentorForTeam(team.TeamId)
	var mentorDto *models.MentorDto = nil

	if mentor != nil {
		user, err := GetUserByRegNo(&mentor.RegNo)
		if err != nil {
			return nil, err
		}
		mentorDto = &models.MentorDto{
			Name:   user.Name,
			RegNo:  user.RegNo,
			Email:  user.Email,
			Phone:  mentor.Phone,
			Avatar: user.Avatar,
		}
	}

	dashboardTeam := models.DashboardTeam{
		TeamId: team.TeamId,
		Name:   team.Name,
		Mentor: mentorDto,
	}

	var size = 0
	userIds := []int{team.LeaderId, team.MemberId1, team.MemberId2}
	for _, userId := range userIds {
		if userId <= 0 {
			continue
		}
		user, err := GetUser(userId)
		if err != nil {
			return nil, err
		}
		size++
		dashboardTeam.Members = append(dashboardTeam.Members, GetUserDto(user))
	}
	dashboardTeam.Size = size

	return &dashboardTeam, nil
}

func GetDashboardTeamForTeam(team *models.Team) (*models.DashboardTeam, error) {
	dashboardTeam := models.DashboardTeam{
		TeamId: team.TeamId,
		Name:   team.Name,
		Mentor: nil,
	}

	var size = 0
	userIds := []int{team.LeaderId, team.MemberId1, team.MemberId2}
	for _, userId := range userIds {
		if userId <= 0 {
			continue
		}
		user, err := GetUser(userId)
		if err != nil {
			return nil, err
		}
		size++
		dashboardTeam.Members = append(dashboardTeam.Members, GetUserDto(user))
	}
	dashboardTeam.Size = size

	return &dashboardTeam, nil
}

func GetUserDto(user *models.User) *models.UserDto {
	return &models.UserDto{
		RegNo:  user.RegNo,
		Name:   user.Name,
		Email:  user.Email,
		Avatar: user.Avatar,
	}
}

func RegisterTeam(event Event, teamName string, leaderId int, regNoList []string) (*models.DashboardTeam, error) {
	// Validate team name
	if teamLen := len(teamName); teamLen < 1 || teamLen > 255 {
		return nil, errors.New("Please enter a team name (up to 255 characters).")
	}

	// Check if all users are registered and any user is not in any other team
	users := make([]*models.User, 0)

	// Check for leader
	leader, err := GetUser(leaderId)
	if err != nil {
		return nil, errors.New("We couldn't find your account. Please sign out, sign in again and retry.")
	}
	if !validateRegNo(&leader.RegNo) {
		return nil, errors.New("Your registration number (" + leader.RegNo + ") isn't eligible for CodeSangam events.")
	}
	if !userAllowed(event, leader) {
		return nil, errors.New("You are already in a team for this event.")
	}
	users = append(users, leader)

	// Check for members
	for _, regNo := range regNoList {
		user, err := GetUserByRegNo(&regNo)
		if err != nil {
			return nil, errors.New("No one with registration number " + regNo + " has signed in yet. Ask them to sign in to the CodeSangam site once, then try again.")
		}
		if !validateRegNo(&regNo) {
			return nil, errors.New("Registration number " + regNo + " isn't eligible for CodeSangam events.")
		}
		if !userAllowed(event, user) {
			return nil, errors.New(user.Name + " (" + user.RegNo + ") is already in another team for this event.")
		}
		users = append(users, user)
	}

	if len(users) < 1 {
		return nil, errors.New("A team needs at least one member.")
	}

	var resultTeam models.Team
	team := &models.Team{
		Name:     teamName,
		LeaderId: users[0].UserId,
	}
	if len(users) > 1 {
		team.MemberId1 = users[1].UserId
	}
	if len(users) > 2 {
		team.MemberId2 = users[2].UserId
	}

	// Create team
	err = config.Db.Table(teamTable.String()).Create(&team).Scan(&resultTeam).Error
	if err != nil {
		return nil, err
	}

	// Register team for the event
	err = config.Db.Table(event.String()).Create(&models.EventRegistration{
		TeamId: resultTeam.TeamId,
		Score:  0,
	}).Error
	if err != nil {
		return nil, err
	}

	userDtoList := make([]*models.UserDto, 0)
	for _, user := range users {
		userDtoList = append(userDtoList, GetUserDto(user))
	}

	dashboardTeam := models.DashboardTeam{
		TeamId:  resultTeam.TeamId,
		Name:    resultTeam.Name,
		Size:    len(userDtoList),
		Members: userDtoList,
		Mentor:  nil,
	}

	return &dashboardTeam, nil
}

func userAllowed(event Event, user *models.User) bool {
	team, err := GetTeam(event, user.UserId)
	if err != nil {
		return false
	}
	if team != nil {
		return false
	}
	return true
}

func validateRegNo(regNo *string) bool {
	// Every pattern below is checked as len(match) == len(input), which is
	// trivially true for an empty string - so without this guard an account
	// with no registration number at all would pass validation.
	if regNo == nil || *regNo == "" {
		return false
	}

	r1st, err := regexp.Compile("^2025[0-9]{4}$")
	if err != nil {
		return false
	}

	r3rd, err := regexp.Compile("^2023[0-9]{4}$")
	if err != nil {
		return false
	}

	r2nd, err := regexp.Compile("^2024[0-9]{4}$")
	if err != nil {
		return false
	}

	rMca, err := regexp.Compile("^2024(CA|ca)([0-9]{3}|[0-9]{2})$")
	if err != nil {
		return false
	}

	rMca1st, err := regexp.Compile("^2025(CA|ca)([0-9]{3}|[0-9]{2})$")
	if err != nil {
		return false
	}

	// 1st years, first year of the 2026 batch.
	r1st2026, err := regexp.Compile("^2026[0-9]{4}$")
	if err != nil {
		return false
	}

	rMca2026, err := regexp.Compile("^2026(CA|ca)([0-9]{3}|[0-9]{2})$")
	if err != nil {
		return false
	}

	return len(r1st.FindString(*regNo)) == len(*regNo) ||
		len(r2nd.FindString(*regNo)) == len(*regNo) ||
		len(r3rd.FindString(*regNo)) == len(*regNo) ||
		len(rMca.FindString(*regNo)) == len(*regNo) ||
		len(rMca1st.FindString(*regNo)) == len(*regNo) ||
		len(r1st2026.FindString(*regNo)) == len(*regNo) ||
		len(rMca2026.FindString(*regNo)) == len(*regNo)
}

func ValidSenior(regNo *string) bool {
	r, err := regexp.Compile("^2021[0-9]{4}$")
	if err != nil {
		return false
	}
	rMca, err := regexp.Compile("^2022(CA|ca)([0-9]{3}|[0-9]{2})$")
	if err != nil {
		return false
	}
	return len(r.FindString(*regNo)) == len(*regNo) ||
		len(rMca.FindString(*regNo)) == len(*regNo)
}

func GetEventRanking(event Event) ([]*models.DashboardTeam, error) {
	var registeredTeams []models.EventRegistration
	err := config.Db.Table(event.String()).Order("score desc").Find(&registeredTeams).Error
	if err != nil {
		return nil, err
	}

	var teams []*models.DashboardTeam
	for idx, rTeam := range registeredTeams {
		// Skip teams with score 0
		if rTeam.Score <= 40 {
			continue
		}
		// Max 10 teams
		if idx == 10 {
			break
		}

		var team models.Team
		err := config.Db.Table(teamTable.String()).Where("id = ?", rTeam.TeamId).First(&team).Error
		if err != nil {
			return nil, err
		}

		dTeam, err := GetDashboardTeam(event, team.LeaderId)
		if err != nil {
			return nil, err
		}
		teams = append(teams, dTeam)
	}

	return teams, nil
}

// AddAbstractForTeam records that a team has an abstract. Re-uploading
// (replacing) an abstract keeps the existing record.
func AddAbstractForTeam(teamId int) error {
	abstract := models.Abstract{TeamId: teamId}
	err := config.Db.Table(abstractTable.String()).Where("team_id = ?", teamId).FirstOrCreate(&abstract).Error
	if err != nil {
		return err
	}
	return nil
}

func CheckMentor(userId int) *models.Mentor {
	user, err := GetUser(userId)
	if err != nil {
		return nil
	}

	var mentor models.Mentor
	err = config.Db.Table(mentorTable.String()).Where("registration_no = ?", user.RegNo).First(&mentor).Error
	if err != nil {
		return nil
	}

	return &mentor
}

func GetMentorForTeam(teamId int) (*models.Mentor, error) {
	qTeamId := strconv.Itoa(teamId)
	if len(qTeamId) < 1 {
		return nil, errors.New("invalid team id")
	}

	var mentor models.Mentor
	err := config.Db.Raw(`select * from mentor where registration_no = (select registration_no from user where uid = (select user_id from allotment where team_id = ` + qTeamId + `));`).First(&mentor).Error
	if err != nil {
		return nil, err
	}
	return &mentor, nil
}

func GetTeamsForMentor(userId int) (*[]models.MentorTeam, error) {
	mentor := CheckMentor(userId)
	if mentor == nil {
		return nil, errors.New("not a mentor")
	}

	var mentorTeams []models.MentorTeam

	mentorEvents := strings.Split(mentor.Events, ";")

	for _, mentorEvent := range mentorEvents {
		mentorTeam, err := GetTeamsForMentorEvent(userId, mentorEvent)
		if err != nil {
			return nil, err
		}
		mentorTeams = append(mentorTeams, *mentorTeam)
	}
	return &mentorTeams, nil
}

func GetTeamsForMentorEvent(userId int, mentorEvent string) (*models.MentorTeam, error) {
	event, err := ToEvent(mentorEvent)
	if err != nil {
		return nil, err
	}

	eventName, err := ToEventName(event)
	if err != nil {
		return nil, err
	}

	quota := getQuota(event)

	mentorTeam := models.MentorTeam{
		EventTag: event.String(),
		Event:    eventName,
		Quota:    quota,
	}

	var teams []models.Team
	err = config.Db.Raw(`select t.* from (select team.* from team inner join (select team_id from allotment where user_id = ` + strconv.Itoa(userId) + `) a on team.id = a.team_id) t inner join ` + event.String() + ` e on t.id = e.team_id;`).Find(&teams).Error
	if err != nil {
		return nil, err
	}

	for _, team := range teams {
		dashboardTeam, err := GetDashboardTeamForTeam(&team)
		if err != nil {
			return nil, err
		}
		mentorTeam.Teams = append(mentorTeam.Teams, dashboardTeam)
	}
	return &mentorTeam, nil
}

var allotmentLock = map[Event]bool{
	droidTable:   false,
	softTable:    false,
	logicalTable: false,
	websterTable: false,
}

func Allot(userId int, strEvent string) error {
	event, err := ToEvent(strEvent)
	if err != nil {
		return errors.New("invalid event")
	}

	if allotmentLock[event] {
		return errors.New("Another mentor is being allotted teams for this event right now. Please try again in a few seconds.")
	}
	allotmentLock[event] = true

	teamIds, err := GetTeamIdsWithoutMentor(event)
	if err != nil {
		allotmentLock[event] = false
		return err
	}

	if len(*teamIds) < 1 {
		allotmentLock[event] = false
		return errors.New("There are no teams left to allot for this event.")
	}

	for _, teamId := range *teamIds {
		err := config.Db.Table(allotmentTable.String()).Create(&models.Allotment{
			TeamId: teamId,
			UserId: userId,
		}).Error
		if err != nil {
			allotmentLock[event] = false
			return err
		}
	}
	allotmentLock[event] = false
	return nil
}

func GetTeamIdsWithoutMentor(event Event) (*[]int, error) {
	var teamIds []int
	err := config.Db.Raw(`select t.id from (select t.id from abstract a inner join team t on a.team_id = t.id) t inner join ` + event.String() + ` e on t.id = e.team_id where id not in (select team_id from allotment);`).Find(&teamIds).Error
	if err != nil {
		return nil, err
	}

	quota := getQuota(event)
	rand.Shuffle(len(teamIds), func(i, j int) { teamIds[i], teamIds[j] = teamIds[j], teamIds[i] })
	slice := min(len(teamIds), quota)
	teamIds = teamIds[:slice]

	return &teamIds, nil
}

func getQuota(event Event) int {
	switch event {
	case droidTable:
		return 3
	case softTable:
		return 4
	case websterTable:
		return 8
	default:
		return 0
	}
}

func SetTeamScore(strEvent string, teamId int, score int) error {
	event, err := ToEvent(strEvent)
	if err != nil {
		return err
	}

	err = config.Db.Table(event.String()).Where("team_id = ?", teamId).Update("score", score).Error
	if err != nil {
		return err
	}
	return nil
}

// IsTeamMember reports whether userId is the leader or a member of teamId.
func IsTeamMember(teamId int, userId int) bool {
	var count int64
	config.Db.Table(teamTable.String()).
		Where("id = ? AND (leader_id = ? OR m_id1 = ? OR m_id2 = ?)", teamId, userId, userId, userId).
		Count(&count)
	return count > 0
}

// IsMentorForTeam reports whether the user has been allotted this team, so a
// mentor can read the abstract of the team they are guiding. Allotment only
// ever hands out teams that already submitted an abstract.
func IsMentorForTeam(teamId int, userId int) bool {
	var count int64
	config.Db.Table(allotmentTable.String()).
		Where("team_id = ? AND user_id = ?", teamId, userId).
		Count(&count)
	return count > 0
}
