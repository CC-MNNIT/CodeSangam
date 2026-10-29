package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo/v4"
)

func TestProjectRequestMiddleware(t *testing.T) {
	for _, tc := range []struct {
		name, contentType, header string
		want                      int
	}{
		{"JSON form", "application/json", "1", http.StatusNoContent},
		{"JSON with charset", "application/json; charset=utf-8", "1", http.StatusNoContent},
		{"missing CSRF header", "application/json", "", http.StatusBadRequest},
		{"wrong CSRF header", "application/json", "yes", http.StatusBadRequest},
		{"cross-site form", "application/x-www-form-urlencoded", "", http.StatusBadRequest},
		{"text is not JSON", "text/plain", "1", http.StatusBadRequest},
	} {
		t.Run(tc.name, func(t *testing.T) {
			e := echo.New()
			e.POST("/project", func(c echo.Context) error { return c.NoContent(http.StatusNoContent) }, ProjectRequestMiddleware())
			req := httptest.NewRequest(http.MethodPost, "/project", strings.NewReader(`{}`))
			req.Header.Set(echo.HeaderContentType, tc.contentType)
			req.Header.Set(ProjectHeader, tc.header)
			rec := httptest.NewRecorder()
			e.ServeHTTP(rec, req)
			if rec.Code != tc.want {
				t.Fatalf("got %d, want %d: %s", rec.Code, tc.want, rec.Body.String())
			}
		})
	}
}
