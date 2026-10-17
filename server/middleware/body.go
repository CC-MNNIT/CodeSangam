package middleware

import (
	"io"

	"github.com/labstack/echo/v4"
)

// DrainBody reads and discards whatever is left of the request body once the
// handler has returned.
//
// Go's HTTP server closes the connection when a handler answers without
// consuming the whole body, and nginx - which is still streaming an upload to
// us at that moment - reports the truncated connection as a 502. Draining the
// rest first lets the client finish sending, so the real status (for example
// 401 when the session has expired) reaches the browser instead of a blank
// "Bad Gateway".
//
// Attach it innermost, after the handler, on routes that accept large bodies.
func DrainBody() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			err := next(c)
			if body := c.Request().Body; body != nil {
				_, _ = io.Copy(io.Discard, body)
			}
			return err
		}
	}
}
