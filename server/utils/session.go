package utils

import (
	"encoding/gob"
	"errors"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

type Key string
type Age int

const (
	UserSessionKey  Key = "u"
	TokenSessionKey Key = "at"
	StateSessionKey Key = "state"
	SessionTempAge  Age = 60 * 15   // 15 minutes
	SessionMaxAge   Age = 86400 * 2 // 2 days
	sessionName         = "session"
)

func init() {
	gob.Register(Key(""))
	gob.Register(Age(0))
}

func GetSession(c echo.Context) (*sessions.Session, error) {
	return session.Get(sessionName, c)
}

func SetSessionWith(sess *sessions.Session, c echo.Context, maxAge Age, values *map[Key]interface{}) error {
	for key, value := range *values {
		sess.Values[key] = value
	}
	sess.Options = getSessionOptions(maxAge)
	return saveSession(sess, c)
}

func SetSession(c echo.Context, maxAge Age, values *map[Key]interface{}) error {
	sess, err := GetSession(c)
	if err != nil {
		return errors.New("unable to get session")
	}
	return SetSessionWith(sess, c, maxAge, values)
}

func InvalidateSession(c echo.Context) error {
	return SetSession(c, -1, &map[Key]interface{}{
		UserSessionKey:  nil,
		TokenSessionKey: nil,
		StateSessionKey: nil,
	})
}

func saveSession(sess *sessions.Session, c echo.Context) error {
	return sess.Save(c.Request(), c.Response())
}

func getSessionOptions(maxAge Age) *sessions.Options {
	return &sessions.Options{
		Path:     "/",
		MaxAge:   int(maxAge),
		HttpOnly: true,
		Secure:   true,
	}
}
