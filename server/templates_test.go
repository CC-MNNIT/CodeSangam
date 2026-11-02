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
			"Teams":      []*models.DashboardTeam{nil, team, nil, &models.DashboardTeam{TeamId: 301, Name: "Logical only"}},
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
				if strings.Contains(output.String(), `value="logical" data-team-id="301"`) {
					t.Fatal("Logical Rhythm appeared in the final project form")
				}
			}
		})
	}
}

// Once PROJECT_SUBMISSION_CLOSED is set the dashboard must stay useful: the
// saved links remain readable, but nothing on the page can submit or edit.
func TestDashboardProjectClosed(t *testing.T) {
	e := echo.New()
	config.InitTemplateRenderer(e)
	team := &models.DashboardTeam{TeamId: 101, Name: "Demo Team", Members: []*models.UserDto{{Name: "Demo Leader"}}}
	data := map[string]interface{}{
		"BaseUrl": "", "UserInfo": &models.User{Name: "Demo Leader"},
		"Teams":      []*models.DashboardTeam{nil, team, nil, nil},
		"EventsInfo": models.GetEventsInfo([]bool{false, true, false, false}, []bool{false, false, false, false}),
		"HasAnyTeam": true, "DeadlinePassed": true,
		"ProjectSubmissionClosed": true,
		"Projects": []struct {
			Tag, Name, TeamName, GithubURL, VideoURL, UpdatedAt, UpdatedISO string
			TeamId                                                          int
			Submitted                                                       bool
		}{{
			Tag: "webster", Name: "Webster", TeamName: "Demo Team", TeamId: 101,
			GithubURL: "https://github.com/acme/web",
			VideoURL:  "https://drive.google.com/file/d/1DEMO_VideoId_1234567890/view",
			Submitted: true, UpdatedAt: "30 Oct 2026, 5:00 PM IST",
		}},
	}
	var output bytes.Buffer
	req := httptest.NewRequest("GET", "/", nil)
	if err := e.Renderer.Render(&output, "dashboard.html", data, e.NewContext(req, httptest.NewRecorder())); err != nil {
		t.Fatal(err)
	}
	page := output.String()
	if !strings.Contains(page, "Submissions are closed") {
		t.Fatal("closed dashboard does not explain why the form is gone")
	}
	if !strings.Contains(page, `id="project-form"`) || !strings.Contains(page, `class="mt-6 max-w-3xl hidden"`) {
		t.Fatal("closed dashboard must still render the form node, hidden")
	}
	if strings.Contains(page, `data-project-edit`) {
		t.Fatal("closed dashboard still offers Add/Edit links")
	}
	if strings.Contains(page, "Link submissions stay open") {
		t.Fatal("closed dashboard still promises open submissions")
	}
	if !strings.Contains(page, "https://github.com/acme/web") || !strings.Contains(page, "Open repository") {
		t.Fatal("closed dashboard hid a saved link the team cannot restore")
	}
}
