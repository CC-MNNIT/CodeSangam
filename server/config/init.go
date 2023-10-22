package initialize

import (
	"log"
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
)

// Env is a struct that contains all the environment variables.
type Env struct {
	BaseUrl      string
	Port         string
	dbUrl        string
	contriDbUrl  string
	clientId     string
	clientSecret string
	redirectUrl  string
}

var EnvVars *Env
var SessionCookieStore *sessions.CookieStore

// init
//
// This function initializes the environment variables, database and OAuth client.
func init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
		panic(err)
	}

	EnvVars = &Env{
		BaseUrl:      os.Getenv("BASE_URL"),
		Port:         os.Getenv("PORT"),
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
