package models

import "time"

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
	Members []*UserDto `json:"members"`
	Mentor  *MentorDto `json:"mentor"`
	// AbstractOnDisk is true when this team's abstract PDF is actually on the
	// server. It is not the same as "an abstract row exists": the row is
	// written on upload, while the file can be gone. Filled in by the
	// controller, because the filesystem lives in utils and utils imports dao.
	AbstractOnDisk bool `json:"abstract_on_disk"`
	// Final submission links. Both are empty until the team submits, and are
	// replaced together, so a half-filled row never reaches a template.
	GithubURL      string    `json:"github_url"`
	VideoURL       string    `json:"video_url"`
	LinksUpdatedAt time.Time `json:"links_updated_at"`
}

type MentorDto struct {
	Name   string `json:"name"`
	RegNo  string `json:"reg_no"`
	Email  string `json:"email"`
	Phone  string `json:"phone"`
	Avatar string `json:"avatar"`
}

type RegisterTeamDto struct {
	Event           string   `json:"event"`
	TeamName        string   `json:"team_name"`
	MemberRegNoList []string `json:"member_reg_list"`
}

// The team id is deliberately absent: the server resolves the user's own
// registered team from their session and the selected event.
type ProjectLinksDto struct {
	Event     string `json:"event"`
	GithubURL string `json:"github_url"`
	VideoURL  string `json:"video_url"`
}

type ProjectLinksResponse struct {
	Message string   `json:"message"`
	Project *Project `json:"project"`
}

type MentorTeam struct {
	EventTag string           `json:"event_tag"`
	Event    string           `json:"event"`
	Teams    []*DashboardTeam `json:"teams"`
	Quota    int              `json:"quota"`
}

type EventInfo struct {
	Tag               string
	Name              string
	Tagline           string
	Description       string
	TeamSize          string
	Tech              string
	Rules             string
	Registered        bool
	AbstractSubmitted bool
	// Template is the abstract template for this event, or "" when the event
	// has no abstract round. It lives here rather than in dashboard.js so the
	// links are rendered by the server: they then work with JavaScript off, and
	// a student can reach them without having a team yet.
	Template string
}

// abstractTemplates holds the Google Docs template for each event that has an
// abstract round. Logical Rhythm has none - it has no abstract submission - so it
// is deliberately absent and renders no link.
var abstractTemplates = map[string]string{
	"droidrush":  "https://docs.google.com/document/d/1UDBqp1AKES0qTzU3CLRo_3qDwsTGrOOS/edit?usp=sharing",
	"webster":    "https://docs.google.com/document/d/1p8ntP8WbgF3mVmOa2UMqkoRkb48D9IoW/edit?usp=sharing",
	"softablitz": "https://docs.google.com/document/d/1JXEfaRnMH5v2pe7Yl7JXiGRWmEX8TX7R/edit?usp=sharing",
}

func GetEventsInfo(registered []bool, abstractSubmitted []bool) []EventInfo {
	return []EventInfo{
		{

			Tag:               "droidrush",
			Name:              "Droid Rush",
			Tagline:           "The Android App Development Contest",
			Description:       "Droidrush is an event centered around Android development, where participants can delve into the world of Android app development. This event offers hands-on experience in building Android applications, exploring the Android ecosystem, and understanding mobile app design principles.",
			TeamSize:          "1-3",
			Tech:              "AndroidX, Jetpack Compose, Firebase, Kotlin, MVVM, Retrofit, Room, etc.",
			Rules:             "Make sure team name is creative and unique. Team name should not contain any offensive words, if found so, the team will be disqualified.",
			Template:          abstractTemplates["droidrush"],
			Registered:        registered[0],
			AbstractSubmitted: abstractSubmitted[0],
		},
		{
			Template:          abstractTemplates["webster"],
			Tag:               "webster",
			Name:              "Webster",
			Tagline:           "The Web Development Contest",
			Description:       "Webster is a web development-focused event, emphasizing the enhancement of participants' skills in creating web applications. It provides opportunities for individuals to learn about web technologies, frameworks, and best practices in the field.",
			TeamSize:          "1-3",
			Tech:              "HTML, CSS, JS, React, Next, Node, Express, MongoDB, etc.",
			Rules:             "Make sure team name is creative and unique. Team name should not contain any offensive words, if found so, the team will be disqualified.",
			Registered:        registered[1],
			AbstractSubmitted: abstractSubmitted[1],
		},
		{

			Tag:               "softablitz",
			Name:              "Softablitz",
			Tagline:           "The Software Development Contest",
			Description:       "Softablitz is a software development event open to every tech stack, where participants build an application in whichever language and framework suits their idea best. It offers hands-on experience in designing, developing and shipping a complete, working piece of software with the tools of their choice.",
			TeamSize:          "1-3",
			Tech:              "Any language or framework — C, C++, Java, Kotlin, Python, JavaScript, Go, Rust, etc.",
			Rules:             "Make sure team name is creative and unique. Team name should not contain any offensive words, if found so, the team will be disqualified.",
			Template:          abstractTemplates["softablitz"],
			Registered:        registered[2],
			AbstractSubmitted: abstractSubmitted[2],
		},
		{
			Tag:               "logical",
			Name:              "Logical Rhythm",
			Tagline:           "The Competitive Coding Contest",
			Description:       "Logical Rythm is a machine learning event that empowers participants with essential knowledge and skills in data analysis, algorithm development, and model training. This event equips attendees with a strong foundation in artificial intelligence and data science, preparing them for exciting opportunities in these fields.",
			TeamSize:          "1-3",
			Tech:              "Jupyter Notebook, Kaggle, Google Colab, Python, Tensorflow, Keras, Scikitlearn, Pandas, Matplotlib, etc.",
			Rules:             "Make sure team name is creative and unique. Team name should not contain any offensive words, if found so, the team will be disqualified.",
			Registered:        registered[3],
			AbstractSubmitted: abstractSubmitted[3],
		},
	}
}
