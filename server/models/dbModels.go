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
	TeamId     int    `gorm:"primary_key;autoIncrement:true;column:id" json:"id"`
	Name       string `gorm:"column:name" json:"name"`
	LeaderId   int    `gorm:"column:leader_id" json:"leader_id"`
	MemberId_1 int    `gorm:"column:m_id1" json:"member_id1"`
	MemberId_2 int    `gorm:"column:m_id2" json:"member_id2"`
	MemberId_3 int    `gorm:"column:m_id3" json:"member_id3"`
}

type EventRegistration struct {
	TeamId int  `gorm:"column:team_id" json:"team_id"`
	Score  uint `gorm:"column:score" json:"score"`
}
