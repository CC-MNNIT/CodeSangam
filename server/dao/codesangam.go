package dao

import (
	"errors"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"gorm.io/gorm"
)

const (
	// Table name
	userTable    = "user"
	teamTable    = "team"
	droidTable   = "droidrush"
	softTable    = "softablitz"
	logicalTable = "logical"
	websterTable = "webster"
)

func SaveUser(dto *models.UserDto) (*models.User, error) {
	if pUser := exists(&dto.Email); pUser != nil {
		return pUser, nil
	}

	var user models.User

	result := config.Db.Table(userTable).Create(&models.User{
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

func exists(email *string) *models.User {
	var user models.User
	result := config.Db.Table(userTable).Where("email = ?", *email).First(&user)
	if result.Error != nil {
		return nil
	}
	return &user
}

func GetUser(id int) (*models.User, error) {
	if id == 0 {
		return nil, nil
	}

	var user models.User
	result := config.Db.Table(userTable).Where("uid = ?", id).First(&user)
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

func GetTeam(event string, userId int) (*models.Team, error) {
	var team models.Team
	err := config.Db.
		Raw(`SELECT * FROM `+event+` d INNER JOIN `+teamTable+` t ON t.id = d.team_id WHERE leader_id = ? OR m_id1 = ? OR m_id2 = ?`, userId, userId, userId).
		First(&team).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &team, nil
}

func GetDashboardTeam(event string, userId int) (*models.DashboardTeam, error) {
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
	if team.LeaderId != -1 {
		member, err := GetUser(team.LeaderId)
		if err != nil {
			return nil, err
		}
		size++
		dashboardTeam.Leader = GetTeamMember(member)
	}

	if team.MemberId_1 != -1 {
		member, err := GetUser(team.MemberId_1)
		if err != nil {
			return nil, err
		}
		size++
		dashboardTeam.Members = append(dashboardTeam.Members, GetTeamMember(member))
	}

	if team.MemberId_2 != -1 {
		member, err := GetUser(team.MemberId_2)
		if err != nil {
			return nil, err
		}
		size++
		dashboardTeam.Members = append(dashboardTeam.Members, GetTeamMember(member))
	}

	return &dashboardTeam, nil
}

func GetTeamMember(user *models.User) *models.UserDto {
	return &models.UserDto{
		RegNo:  user.RegNo,
		Name:   user.Name,
		Email:  user.Email,
		Avatar: user.Avatar,
	}
}
