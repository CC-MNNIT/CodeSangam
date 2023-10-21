package dao

import (
	"errors"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"gorm.io/gorm"
)

type Event string

const (
	// Table name
	userTable    Event = "user"
	teamTable    Event = "team"
	droidTable   Event = "droidrush"
	softTable    Event = "softablitz"
	logicalTable Event = "logical"
	websterTable Event = "webster"
)

var toEvent = map[string]Event{
	"user":       userTable,
	"team":       teamTable,
	"droidrush":  droidTable,
	"softablitz": softTable,
	"logical":    logicalTable,
	"webster":    websterTable,
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
	droidTeam, err := GetDashboardTeam(droidTable, id)
	if err != nil {
		return nil, err
	}
	userInfo.DroidRushTeam = droidTeam

	websterTeam, err := GetDashboardTeam(websterTable, id)
	if err != nil {
		return nil, err
	}
	userInfo.WebsterTeam = websterTeam

	softTeam, err := GetDashboardTeam(softTable, id)
	if err != nil {
		return nil, err
	}
	userInfo.SoftablitzTeam = softTeam

	logicTeam, err := GetDashboardTeam(logicalTable, id)
	if err != nil {
		return nil, err
	}
	userInfo.LogicalRhythmTeam = logicTeam
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

	dashboardTeam := models.DashboardTeam{
		TeamId: team.TeamId,
		Name:   team.Name,
	}

	var size = 0
	if team.LeaderId > 0 {
		member, err := GetUser(team.LeaderId)
		if err != nil {
			return nil, err
		}
		size++
		dashboardTeam.Leader = GetUserDto(member)
	}

	if team.MemberId1 > 0 {
		member, err := GetUser(team.MemberId1)
		if err != nil {
			return nil, err
		}
		size++
		dashboardTeam.Members = append(dashboardTeam.Members, GetUserDto(member))
	}

	if team.MemberId2 > 0 {
		member, err := GetUser(team.MemberId2)
		if err != nil {
			return nil, err
		}
		size++
		dashboardTeam.Members = append(dashboardTeam.Members, GetUserDto(member))
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
		return nil, errors.New("invalid team name")
	}

	// Check if all users are registered and any user is not in any other team
	users := make([]*models.User, 0)

	// Check for leader
	leader, err := GetUser(leaderId)
	if err != nil {
		return nil, errors.New("invalid leader id")
	}
	if !userAllowed(event, leader) {
		return nil, errors.New("user [" + leader.RegNo + "] already in other team")
	}
	users = append(users, leader)

	// Check for members
	for _, regNo := range regNoList {
		user, err := GetUserByRegNo(&regNo)
		if err != nil {
			return nil, err
		}
		if !userAllowed(event, user) {
			return nil, errors.New("user [" + user.RegNo + "] already in other team")
		}
		users = append(users, user)
	}

	if len(users) < 1 {
		return nil, errors.New("invalid team size")
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
		Leader:  userDtoList[0],
		Members: userDtoList[1:],
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
