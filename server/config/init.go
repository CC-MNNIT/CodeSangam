package initialize

import (
	"log"
	"os"
	"strconv"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
)

// Env is a struct that contains all the environment variables.
type Env struct {
	BaseUrl string
	Port    string
	// Empty in production; staging can bind only to a Tailnet or loopback IP.
	ListenHost           string
	RegistrationDeadline int64
	// Development period, shown to participants and mentors. 0 means "not
	// configured" and hides the line entirely; nothing enforces it, it is
	// there so the dates on screen are the dates the club announced.
	DevelopmentStart int64
	DevelopmentEnd   int64
	DeclareResult    bool
	dbUrl            string
	contriDbUrl      string
	clientId         string
	clientSecret     string
	redirectUrl      string
}

var EnvVars *Env
var SessionCookieStore *sessions.CookieStore

// parseTimestamp reads a unix timestamp from the environment. An empty or
// unparseable value is 0, which every caller treats as "not configured" - but
// an unparseable value is logged, because a typo in a date that nothing
// enforces is otherwise invisible.
func parseTimestamp(key string) int64 {
	v := os.Getenv(key)
	if v == "" {
		return 0
	}
	i, err := strconv.ParseInt(v, 10, 64)
	if err != nil {
		log.Printf("%s=%q is not a unix timestamp; it will be treated as not set", key, v)
		return 0
	}
	return i
}

// Init initializes the running server, not every package that imports config.
// Keeping startup explicit lets validators and template tests run without
// loading production secrets or opening a database connection.
func Init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
		panic(err)
	}

	EnvVars = &Env{
		BaseUrl:    os.Getenv("BASE_URL"),
		Port:       os.Getenv("PORT"),
		ListenHost: os.Getenv("LISTEN_HOST"),
		RegistrationDeadline: func() int64 {
			v := os.Getenv("REGISTRATION_DEADLINE")
			i, er := strconv.ParseInt(v, 10, 64)
			if er != nil {
				// 0 means "no deadline", so a typo here would leave
				// registration open for ever without saying so. Log it.
				if v != "" {
					log.Printf("REGISTRATION_DEADLINE=%q is not a unix timestamp; registration will never close", v)
				}
				return 0
			}
			return i
		}(),
		DevelopmentStart: parseTimestamp("DEVELOPMENT_START"),
		DevelopmentEnd:   parseTimestamp("DEVELOPMENT_END"),
		DeclareResult: func() bool {
			b, er := strconv.ParseBool(os.Getenv("DECLARE_RESULT"))
			if er != nil {
				return false
			}
			return b
		}(),
		dbUrl:        os.Getenv("DB_URL"),
		contriDbUrl:  os.Getenv("CONTRI_DB_URL"),
		clientId:     os.Getenv("CLIENT_ID"),
		clientSecret: os.Getenv("CLIENT_SECRET"),
		redirectUrl:  os.Getenv("REDIRECT_URL"),
	}
	log.Println("Loaded .env")

	connectDB()
	setupOAuthClient()
	SessionCookieStore = sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET")))
}
