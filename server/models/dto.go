package models

type UserDto struct {
	RegNo  string `json:"reg_no"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Avatar string `json:"avatar"`
}

type OAuthUser struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Picture       string `json:"picture"`
	Locale        string `json:"locale"`
	Hd            string `json:"hd"`
}

type DashboardUserDto struct {
	User              *User          `json:"user"`
	DroidRushTeam     *DashboardTeam `json:"droid_team"`
	WebsterTeam       *DashboardTeam `json:"webster_team"`
	SoftablitzTeam    *DashboardTeam `json:"soft_team"`
	LogicalRhythmTeam *DashboardTeam `json:"logical_team"`
}

type DashboardTeam struct {
	TeamId  int        `json:"team_id"`
	Name    string     `json:"name"`
	Size    int        `json:"size"`
	Leader  *UserDto   `json:"leader"`
	Members []*UserDto `json:"members"`
}

type RegisterTeamDto struct {
	Event           string   `json:"event"`
	TeamName        string   `json:"team_name"`
	MemberRegNoList []string `json:"member_reg_list"`
}
