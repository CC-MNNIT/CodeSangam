package middleware

import (
	"errors"
	"log"
	"net/http"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
	"github.com/labstack/echo/v4"
)

// AdminEmailKey holds the signed-in admin's email on the request context.
const AdminEmailKey = "adminEmail"

// AdminHeader must be sent with every admin API call. Browsers cannot add a
// custom header to a cross-site request without a CORS preflight, which this
// server does not grant with credentials, so it blocks cross-site forgery.
const AdminHeader = "X-CS-Admin"

func sessionEmail(c echo.Context) (string, bool) {
	sess, err := utils.GetSession(c)
	if err != nil {
		return "", false
	}
	id, ok := sess.Values[utils.UserSessionKey].(int)
	if !ok {
		return "", false
	}
	user, err := dao.GetUser(id)
	if err != nil {
		return "", false
	}
	return user.Email, true
}

// AdminPageMiddleware lets admins through to the admin page. Visitors who are
// not signed in go to the login page; signed-in non-admins see a 403 page.
func AdminPageMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			email, ok := sessionEmail(c)
			if !ok {
				return c.Redirect(http.StatusTemporaryRedirect, config.EnvVars.BaseUrl+"/api/auth")
			}
			if !dao.IsAdmin(email) {
				return c.Render(http.StatusForbidden, "admin.html", map[string]interface{}{
					"BaseUrl": config.EnvVars.BaseUrl,
					"Denied":  true,
					"Email":   email,
				})
			}
			c.Set(AdminEmailKey, email)
			return next(c)
		}
	}
}

// AdminAPIMiddleware guards the JSON admin endpoints.
func AdminAPIMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if c.Request().Header.Get(AdminHeader) != "1" {
				err := errors.New("missing " + AdminHeader + " header")
				return utils.BadRequestError(c, "Invalid admin request", &err)
			}
			email, ok := sessionEmail(c)
			if !ok {
				return utils.UnauthorizedError(c, "Sign in first", nil)
			}
			if !dao.IsAdmin(email) {
				log.Println("ADMIN: denied " + email + " " + c.Request().Method + " " + c.Path())
				return c.JSON(http.StatusForbidden, map[string]string{"message": "Admins only", "error": ""})
			}
			c.Set(AdminEmailKey, email)
			return next(c)
		}
	}
}
