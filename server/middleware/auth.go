package middleware

import (
	"net/http"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
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
				return utils.InternalError(c, "Unable to get session", &err)
			}

			if sess.Values[utils.UserSessionKey] == nil {
				return c.Redirect(http.StatusTemporaryRedirect, config.EnvVars.BaseUrl+"/api/auth")
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
				return utils.InternalError(c, "Unable to get session", &err)
			}

			if sess.Values[utils.UserSessionKey] == nil {
				return next(c)
			}
			return c.Redirect(http.StatusTemporaryRedirect, config.EnvVars.BaseUrl+"/api/auth/dashboard")
		}
	}
}

// DeadlineMiddleware
//
// This middleware will check if the registration deadline has passed.
func DeadlineMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			if false {
				return utils.BadRequestError(c, "Registration deadline has passed", nil)
			}

			return next(c)
		}
	}
}
