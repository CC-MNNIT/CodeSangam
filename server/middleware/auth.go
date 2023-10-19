package middleware

import (
	"net/http"
	"os"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

const (
	AuthHeaderName = "Authorization"
)

func AuthMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			sess, err := session.Get("session", c)
			if err != nil {
				return c.String(http.StatusInternalServerError, "Unable to get session")
			}

			if sess.Values["u"] == nil {
				return redirectAuth(c, sess)
			}
			return next(c)
		}
	}
}

func redirectAuth(c echo.Context, sess *sessions.Session) error {
	sess.Values["red"] = c.Request().URL.String()
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 15,
		HttpOnly: true,
		Secure:   true,
	}
	err := sess.Save(c.Request(), c.Response())
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to save 'red' session")
	}
	return c.Redirect(http.StatusTemporaryRedirect, os.Getenv("BASE_URL")+"/api/v1/auth/login")
}
