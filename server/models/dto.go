package models

type UserDto struct {
	RegNo  string `json:"reg_no"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Avatar string `json:"avatar"`
}
