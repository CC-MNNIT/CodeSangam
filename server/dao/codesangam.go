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

	// Get Teams
	droidTeam, err := GetTeam(droidTable, id)
	if err != nil {
		return nil, err
	}
	websterTeam, err := GetTeam(websterTable, id)
	if err != nil {
		return nil, err
	}
	softTeam, err := GetTeam(softTable, id)
	if err != nil {
		return nil, err
	}
	logicTeam, err := GetTeam(logicalTable, id)
	if err != nil {
		return nil, err
	}

	userInfo := models.DashboardUserDto{
		User: user,
	}

	// Get DashboardTeam
	if droidTeam != nil {
		dDroidTeam, err := GetDashboardTeam(droidTeam)
		if err != nil {
			return nil, err
		}
		userInfo.DroidRushTeam = dDroidTeam
	}

	if websterTeam != nil {
		dWebsterTeam, err := GetDashboardTeam(websterTeam)
		if err != nil {
			return nil, err
		}
		userInfo.WebsterTeam = dWebsterTeam
	}

	if softTeam != nil {
		dSoftTeam, err := GetDashboardTeam(softTeam)
		if err != nil {
			return nil, err
		}
		userInfo.SoftablitzTeam = dSoftTeam
	}

	if logicTeam != nil {
		dLogicTeam, err := GetDashboardTeam(logicTeam)
		if err != nil {
			return nil, err
		}
		userInfo.LogicalRhythmTeam = dLogicTeam
	}
	return &userInfo, nil
}

func GetTeam(event string, userId int) (*models.Team, error) {
	var team models.Team
	err := config.Db.
		Raw(`SELECT * FROM `+event+` d INNER JOIN `+teamTable+` t ON t.id = d.team_id WHERE leader_id = ? OR m_id1 = ? OR m_id2 = ? OR m_id3 = ?`, userId, userId, userId, userId).
		Find(&team).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	if team.TeamId == 0 {
		return nil, nil
	}
	return &team, nil
}

func GetDashboardTeam(team *models.Team) (*models.DashboardTeam, error) {
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

	if team.MemberId_3 != -1 {
		member, err := GetUser(team.MemberId_3)
		if err != nil {
			return nil, err
		}
		size++
		dashboardTeam.Members = append(dashboardTeam.Members, GetTeamMember(member))
	}
	dashboardTeam.Size = size

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
