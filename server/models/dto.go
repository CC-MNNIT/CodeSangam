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
	Members []*UserDto `json:"members"`
	Score   int        `json:"score"`
}

type RegisterTeamDto struct {
	Event           string   `json:"event"`
	TeamName        string   `json:"team_name"`
	MemberRegNoList []string `json:"member_reg_list"`
}

type EventInfo struct {
	Tag         string
	Name        string
	Tagline     string
	Description string
	TeamSize    string
	Tech        string
	Rules       string
	Registered  bool
}

var eventsInfo []EventInfo = nil

func GetEventsInfo(registered []bool) []EventInfo {
	if eventsInfo == nil {
		eventsInfo = []EventInfo{
			{
				Tag:         "droidrush",
				Name:        "Droid Rush",
				Tagline:     "The Android App Development Contest",
				Description: "Droidrush is an event centered around Android development, where participants can delve into the world of Android app development. This event offers hands-on experience in building Android applications, exploring the Android ecosystem, and understanding mobile app design principles.",
				TeamSize:    "1-3",
				Tech:        "AndroidX, Jetpack Compose, Firebase, Kotlin, MVVM, Retrofit, Room, etc.",
				Rules:       "Make sure team name is creative and unique. Team name should not contain any offensive words, if found so, the team will be disqualified.",
				Registered:  registered[0],
			},
			{
				Tag:         "webster",
				Name:        "Webster",
				Tagline:     "The Web Development Contest",
				Description: "Webster is a web development-focused event, emphasizing the enhancement of participants' skills in creating web applications. It provides opportunities for individuals to learn about web technologies, frameworks, and best practices in the field.",
				TeamSize:    "1-3",
				Tech:        "HTML, CSS, JS, React, Next, Node, Express, MongoDB, etc.",
				Rules:       "Make sure team name is creative and unique. Team name should not contain any offensive words, if found so, the team will be disqualified.",
				Registered:  registered[1],
			},
			{
				Tag:         "softablitz",
				Name:        "Softablitz",
				Tagline:     "The Software Development Contest",
				Description: "Softablitz is a Java Desktop Development event that immerses participants in the world of desktop application creation using the Java programming language. It provides hands-on experience, helping participants refine their Java skills while designing and developing powerful desktop software.",
				TeamSize:    "1-3",
				Tech:        "JavaFX, Java, Swing, Desktop Compose, Kotlin, etc.",
				Rules:       "Make sure team name is creative and unique. Team name should not contain any offensive words, if found so, the team will be disqualified.",
				Registered:  registered[2],
			},
			{
				Tag:         "logical",
				Name:        "Logical Rhythm",
				Tagline:     "The Competitive Coding Contest",
				Description: "Logical Rythm is a machine learning event that empowers participants with essential knowledge and skills in data analysis, algorithm development, and model training. This event equips attendees with a strong foundation in artificial intelligence and data science, preparing them for exciting opportunities in these fields.",
				TeamSize:    "1-3",
				Tech:        "Jupyter Notebook, Kaggle, Google Colab, Python, Tensorflow, Keras, Scikitlearn, Pandas, Matplotlib, etc.",
				Rules:       "Make sure team name is creative and unique. Team name should not contain any offensive words, if found so, the team will be disqualified.",
				Registered:  registered[3],
			},
		}
	}
	return eventsInfo
}
