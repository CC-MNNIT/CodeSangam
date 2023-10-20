package middleware

import (
	"net/http"
	"os"

	"github.com/CC-MNNIT/CodeSangam/server/utils"
	"github.com/labstack/echo/v4"
)

const (
	AuthHeaderName = "Authorization"
)

// AuthMiddleware
//
// This middleware where will redirect to login page if user is not logged in.
func AuthMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			sess, err := utils.GetSession(c)
			if err != nil {
				return c.String(http.StatusInternalServerError, "Unable to get session")
			}

			if sess.Values[utils.UserSessionKey] == nil {
				return c.Redirect(http.StatusTemporaryRedirect, os.Getenv("BASE_URL")+"/api/auth")
			}
			return next(c)
		}
	}
}

// AuthLoginMiddleware
//
// This middleware will redirect to profile from auth page if user is already logged in
func AuthLoginMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			sess, err := utils.GetSession(c)
			if err != nil {
				return c.String(http.StatusInternalServerError, "Unable to get session")
			}

			if sess.Values[utils.UserSessionKey] == nil {
				return next(c)
			}
			return c.Redirect(http.StatusTemporaryRedirect, os.Getenv("BASE_URL")+"/api/auth/profile")
		}
	}
}
