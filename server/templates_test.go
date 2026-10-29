package main

import (
	"bytes"
	"net/http/httptest"
	"strings"
	"testing"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"github.com/labstack/echo/v4"
)

func TestServerTemplates(t *testing.T) {
	e := echo.New()
	config.InitTemplateRenderer(e)
	team := &models.DashboardTeam{TeamId: 101, Name: "Demo Team", Members: []*models.UserDto{{Name: "Demo Leader"}}}
	for _, tc := range []struct {
		name string
		data map[string]interface{}
	}{
		{"dashboard.html", map[string]interface{}{
			"BaseUrl": "/codesangam", "UserInfo": &models.User{Name: "Demo Leader"},
			"Teams":      []*models.DashboardTeam{nil, team, nil, nil},
			"EventsInfo": models.GetEventsInfo([]bool{false, true, false, false}, []bool{false, false, false, false}),
			"HasAnyTeam": true, "DeadlinePassed": true,
			"Projects": []struct {
				Tag, Name, TeamName, GithubURL, VideoURL, UpdatedAt, UpdatedISO string
				TeamId                                                          int
				Submitted                                                       bool
			}{{Tag: "webster", Name: "Webster", TeamName: `<script>alert(1)</script>`, TeamId: 101}},
		}},
		{"admin.html", map[string]interface{}{
			"BaseUrl": "/codesangam", "Email": "admin@example.test", "TeamCount": 1,
			"Teams": []dao.AdminTeam{{EventTag: "webster", EventName: "Webster", TeamId: 101, Name: "Demo Team"}},
		}},
		{"login.html", map[string]interface{}{"BaseUrl": "/codesangam"}},
	} {
		t.Run(tc.name, func(t *testing.T) {
			var output bytes.Buffer
			req := httptest.NewRequest("GET", "/", nil)
			if err := e.Renderer.Render(&output, tc.name, tc.data, e.NewContext(req, httptest.NewRecorder())); err != nil {
				t.Fatal(err)
			}
			if tc.name == "dashboard.html" {
				if !strings.Contains(output.String(), `id="project-form"`) || strings.Contains(output.String(), `<script>alert(1)</script>`) {
					t.Fatal("final form missing or a team name was rendered as executable HTML")
				}
				if !strings.Contains(output.String(), `action="/codesangam/api/v1/cs/project"`) {
					t.Fatal("subdirectory hosting prefix was lost")
				}
			}
		})
	}
}
