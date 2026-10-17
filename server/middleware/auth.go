package middleware

import (
	"net/http"
	"time"

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
			deadline := config.EnvVars.RegistrationDeadline
			// 0 means no deadline is configured (REGISTRATION_DEADLINE unset or
			// unparseable). Registration stays open in that case on purpose: a
			// missing value must never lock every team out of the event.
			if deadline > 0 && time.Now().Unix() >= deadline {
				return utils.BadRequestError(c, "Registration and abstract submission are now closed.", nil)
			}

			return next(c)
		}
	}
}
