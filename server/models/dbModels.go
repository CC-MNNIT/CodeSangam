package models

type ContriHUBUser struct {
	UserId      uint   `gorm:"column:user_id" json:"user_id"`
	UserName    string `gorm:"column:username" json:"user_name"`
	RegNo       string `gorm:"column:registration_no" json:"reg_no"`
	Year        uint   `gorm:"column:current_year" json:"year"`
	TotalPoints uint   `gorm:"column:total_points" json:"total_points"`
	BonusPoints uint   `gorm:"column:bonus_points" json:"bonus_points"`
}

type User struct {
	UserId int    `gorm:"primary_key;autoIncrement:true;column:uid" json:"uid"`
	RegNo  string `gorm:"uniqueIndex;column:registration_no" json:"reg_no"`
	Name   string `gorm:"column:name" json:"name"`
	Email  string `gorm:"uniqueIndex;column:email" json:"email"`
	Avatar string `gorm:"column:avatar" json:"avatar"`
}

type Team struct {
	TeamId    int    `gorm:"primary_key;autoIncrement:true;column:id" json:"id"`
	Name      string `gorm:"column:name" json:"name"`
	LeaderId  int    `gorm:"column:leader_id" json:"leader_id"`
	MemberId1 int    `gorm:"column:m_id1" json:"member_id1"`
	MemberId2 int    `gorm:"column:m_id2" json:"member_id2"`
}

type EventRegistration struct {
	TeamId int `gorm:"column:team_id" json:"team_id"`
	Score  int `gorm:"column:score" json:"score"`
}

type Abstract struct {
	TeamId int `gorm:"primary_key;column:team_id" json:"team_id"`
}

type Mentor struct {
	RegNo  string `gorm:"primary_key;column:registration_no" json:"reg_no"`
	Email  string `gorm:"uniqueIndex;column:email" json:"email"`
	Phone  string `gorm:"column:phone" json:"phone"`
	Events string `gorm:"uniqueIndex;column:events" json:"events"`
}

type Allotment struct {
	TeamId int `gorm:"primary_key;column:team_id" json:"team_id"`
	UserId int `gorm:"primary_key;column:user_id" json:"user_id"`
}
