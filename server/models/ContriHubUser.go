package models

type ContriHUBUser struct {
	UserId      uint   `gorm:"column:user_id" json:"user_id"`
	UserName    string `gorm:"column:username" json:"user_name"`
	RegNo       string `gorm:"column:registration_no" json:"reg_no"`
	Year        uint   `gorm:"column:current_year" json:"year"`
	TotalPoints uint   `gorm:"column:total_points" json:"total_points"`
	BonusPoints uint   `gorm:"column:bonus_points" json:"bonus_points"`
}
