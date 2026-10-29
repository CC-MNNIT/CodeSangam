package middleware

import (
	"mime"
	"net/http"

	"github.com/labstack/echo/v4"
)

const ProjectHeader = "X-CS-Project"

// JSON plus a custom header prevents a third-party form from submitting links
// with the user's session. This is the same CSRF pattern as the admin API;
// session and team ownership are still checked by the handler.
func ProjectRequestMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			mediaType, _, err := mime.ParseMediaType(c.Request().Header.Get(echo.HeaderContentType))
			if err != nil || mediaType != echo.MIMEApplicationJSON || c.Request().Header.Get(ProjectHeader) != "1" {
				return c.JSON(http.StatusBadRequest, map[string]string{
					"message": "Submit both links using the final submission form.",
					"error":   "",
				})
			}
			return next(c)
		}
	}
}
