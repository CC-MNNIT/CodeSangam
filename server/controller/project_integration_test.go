package controller

import (
	"encoding/csv"
	"encoding/json"
	"html/template"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/dao"
	csMiddleware "github.com/CC-MNNIT/CodeSangam/server/middleware"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
	mysqlDriver "github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type integrationRenderer struct{ templates *template.Template }

func (r integrationRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return r.templates.ExecuteTemplate(w, name, data)
}

// Integration tests are opt-in and refuse any database without this explicit
// disposable name. They never read the running server's .env file.
func projectIntegrationDB(t *testing.T) *gorm.DB {
	t.Helper()
	dsn := os.Getenv("CODESANGAM_TEST_DB_URL")
	if dsn == "" {
		t.Skip("set CODESANGAM_TEST_DB_URL to a disposable codesangam_test_* database")
	}
	parsed, err := mysqlDriver.ParseDSN(dsn)
	if err != nil || !strings.HasPrefix(parsed.DBName, "codesangam_test_") {
		t.Fatal("integration tests require a disposable codesangam_test_* database")
	}
	parsed.MultiStatements = true
	parsed.ParseTime = true
	db, err := gorm.Open(mysql.Open(parsed.FormatDSN()), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})
	if err != nil {
		t.Fatal(err)
	}
	sqlDB, err := db.DB()
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { sqlDB.Close() })
	schema, err := os.ReadFile("../testdata/project-schema.sql")
	if err != nil {
		t.Fatal(err)
	}
	if err := db.Exec(string(schema)).Error; err != nil {
		t.Fatal(err)
	}
	oldDB, oldEnv, oldStore := config.Db, config.EnvVars, config.SessionCookieStore
	config.Db = db
	config.EnvVars = &config.Env{RegistrationDeadline: 1, DeclareResult: true}
	config.SessionCookieStore = sessions.NewCookieStore([]byte("codesangam-project-integration-only-32-bytes"))
	t.Cleanup(func() { config.Db, config.EnvVars, config.SessionCookieStore = oldDB, oldEnv, oldStore })
	if err := dao.EnsureAdmins(); err != nil {
		t.Fatal(err)
	}
	if err := dao.EnsureProjects(); err != nil {
		t.Fatal(err)
	}
	// Re-running migration must be safe and must not delete stored rows.
	if err := dao.EnsureProjects(); err != nil {
		t.Fatal(err)
	}
	tx := db.Begin()
	if tx.Error != nil {
		t.Fatal(tx.Error)
	}
	config.Db = tx
	t.Cleanup(func() { tx.Rollback() })
	seed, err := os.ReadFile("../testdata/project-seed.sql")
	if err != nil {
		t.Fatal(err)
	}
	if err := tx.Exec(string(seed)).Error; err != nil {
		t.Fatal(err)
	}
	return tx
}

func TestProjectSubmissionIntegration(t *testing.T) {
	db := projectIntegrationDB(t)
	e := echo.New()
	e.Use(session.Middleware(config.SessionCookieStore))
	tpl, err := template.ParseGlob("../web/templates/*.html")
	if err != nil {
		t.Fatal(err)
	}
	e.Renderer = integrationRenderer{tpl}
	e.POST("/api/v1/cs/project", SubmitProjectLinks, csMiddleware.ProjectRequestMiddleware(), echoMiddleware.BodyLimit("4K"))
	e.POST("/api/admin/team/project", AdminSetProjectLinks, csMiddleware.AdminAPIMiddleware())
	e.GET("/api/v1/cs/project/links.csv", ProjectLinksCSV, csMiddleware.AdminDownloadMiddleware())
	e.GET("/api/auth/dashboard", UserDashboard)
	e.GET("/api/v1/cs/ranking", GetEventRanking)
	request := func(method, path string, userID int, body string, csrf bool) *httptest.ResponseRecorder {
		t.Helper()
		req := httptest.NewRequest(method, path, strings.NewReader(body))
		if method == http.MethodPost {
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			if csrf {
				req.Header.Set(csMiddleware.ProjectHeader, "1")
				req.Header.Set(csMiddleware.AdminHeader, "1")
			}
		}
		if userID != 0 {
			sess := sessions.NewSession(config.SessionCookieStore, "session")
			sess.Values[utils.UserSessionKey] = userID
			sess.Options = &sessions.Options{Path: "/", MaxAge: 3600, HttpOnly: true}
			cookieRec := httptest.NewRecorder()
			if err := sess.Save(req, cookieRec); err != nil {
				t.Fatal(err)
			}
			for _, cookie := range cookieRec.Result().Cookies() {
				req.AddCookie(cookie)
			}
		}
		rec := httptest.NewRecorder()
		e.ServeHTTP(rec, req)
		return rec
	}
	assertStatus := func(rec *httptest.ResponseRecorder, want int) {
		t.Helper()
		if rec.Code != want {
			t.Fatalf("got %d, want %d: %s", rec.Code, want, rec.Body.String())
		}
	}
	video := "https://drive.google.com/file/d/1DEMO_VideoId_1234567890/view"
	payload := `{"event":"webster","github_url":"github.com/acme/web","video_url":"` + video + `"}`
	assertStatus(request("POST", "/api/v1/cs/project", 0, payload, true), 401)
	assertStatus(request("POST", "/api/v1/cs/project", 1, payload, false), 400)
	assertStatus(request("POST", "/api/v1/cs/project", 6, payload, true), 400)
	assertStatus(request("POST", "/api/v1/cs/project", 1, `{"event":"webster","github_url":"github.com/acme/web"}`, true), 400)
	assertStatus(request("POST", "/api/v1/cs/project", 1, strings.Repeat("x", 4100), true), 413)
	logical := `{"event":"logical","github_url":"github.com/acme/logical","video_url":"` + video + `"}`
	assertStatus(request("POST", "/api/v1/cs/project", 3, logical, true), 400)
	var count int64
	db.Table("project").Count(&count)
	if count != 0 {
		t.Fatal("a rejected request created a submission")
	}
	// The registration cutoff is in the past, but final links still save.
	rec := request("POST", "/api/v1/cs/project", 1, payload, true)
	assertStatus(rec, 200)
	var saved models.ProjectLinksResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &saved); err != nil {
		t.Fatal(err)
	}
	if saved.Project == nil || saved.Project.TeamId != 101 || saved.Project.GithubURL != "https://github.com/acme/web" {
		t.Fatalf("wrong team or non-normalized link: %s", rec.Body.String())
	}
	// A teammate may update, but an injected team id never targets another team.
	update := `{"event":"webster","team_id":102,"github_url":"github.com/acme/web-v2","video_url":"` + video + `"}`
	assertStatus(request("POST", "/api/v1/cs/project", 2, update, true), 200)
	web, err := dao.GetProjectLinks(101)
	if err != nil || web == nil || web.GithubURL != "https://github.com/acme/web-v2" {
		t.Fatalf("member edit was not saved: %v %v", web, err)
	}
	other, err := dao.GetProjectLinks(102)
	if err != nil || other != nil {
		t.Fatal("a client-supplied id modified another team's submission")
	}
	assertStatus(request("POST", "/api/v1/cs/project", 2, `{"event":"webster","github_url":"javascript:alert(1)","video_url":"`+video+`"}`, true), 400)
	webAfter, _ := dao.GetProjectLinks(101)
	if webAfter.GithubURL != web.GithubURL || webAfter.VideoURL != web.VideoURL {
		t.Fatal("an invalid edit changed saved links")
	}
	droid := `{"event":"droidrush","team_id":201,"github_url":"github.com/acme/droid","video_url":"` + video + `"}`
	assertStatus(request("POST", "/api/admin/team/project", 2, droid, true), 403)
	assertStatus(request("POST", "/api/admin/team/project", 5, droid, false), 400)
	assertStatus(request("POST", "/api/admin/team/project", 5, droid, true), 200)
	assertStatus(request("POST", "/api/admin/team/project", 5, `{"event":"logical","team_id":301,"github_url":"github.com/acme/logical","video_url":"`+video+`"}`, true), 400)
	assertStatus(request("POST", "/api/admin/team/project", 5, strings.Replace(droid, `"team_id":201`, `"team_id":101`, 1), true), 400)
	db.Table("project").Count(&count)
	if count != 2 {
		t.Fatalf("resubmitting duplicated a row: %d rows", count)
	}
	// Reading a user's data only includes their own event registrations.
	owner, err := dao.GetUserInfo(1)
	if err != nil || owner.WebsterTeam.GithubURL != web.GithubURL || owner.DroidRushTeam != nil {
		t.Fatalf("wrong own-team data: %v", err)
	}
	mentor, err := dao.GetTeamsForMentor(4)
	if err != nil || len((*mentor)[0].Teams) != 1 || (*mentor)[0].Teams[0].GithubURL != web.GithubURL || len((*mentor)[1].Teams) != 0 {
		t.Fatalf("mentor received wrong teams: %v", err)
	}
	mentorPage := request("GET", "/api/auth/dashboard", 4, "", false)
	assertStatus(mentorPage, 200)
	if !strings.Contains(mentorPage.Body.String(), web.GithubURL) || strings.Contains(mentorPage.Body.String(), "https://github.com/acme/droid") {
		t.Fatal("mentor page did not respect allotment")
	}
	logicalOwnerPage := request("GET", "/api/auth/dashboard", 3, "", false)
	assertStatus(logicalOwnerPage, 200)
	if strings.Contains(logicalOwnerPage.Body.String(), `value="logical" data-team-id="301"`) {
		t.Fatal("Logical Rhythm appeared in the member final-project form")
	}
	ranking := request("GET", "/api/v1/cs/ranking?event=webster", 0, "", false)
	assertStatus(ranking, 200)
	if strings.Contains(ranking.Body.String(), "https://github.com/acme/") || strings.Contains(ranking.Body.String(), "drive.google.com") {
		t.Fatal("public rankings exposed project links")
	}
	for userID, want := range map[int]int{0: 401, 1: 403, 4: 403, 6: 403, 5: 200} {
		assertStatus(request("GET", "/api/v1/cs/project/links.csv", userID, "", false), want)
	}
	export := request("GET", "/api/v1/cs/project/links.csv?event=webster", 5, "", false)
	assertStatus(export, 200)
	rows, err := csv.NewReader(strings.NewReader(strings.TrimPrefix(export.Body.String(), "\uFEFF"))).ReadAll()
	if err != nil || len(rows) != 3 {
		t.Fatalf("wrong CSV rows: %v %v", rows, err)
	}
	if !strings.HasPrefix(rows[1][1], "'=") || rows[1][4] != "" || rows[2][4] != web.GithubURL {
		t.Fatalf("CSV did not preserve blanks, escape formulas, and join by id: %v", rows)
	}
	allExport := request("GET", "/api/v1/cs/project/links.csv", 5, "", false)
	assertStatus(allExport, 200)
	if strings.Contains(allExport.Body.String(), "logical") || strings.Contains(allExport.Body.String(), "Demo Logical Team") {
		t.Fatal("all-events final-link CSV included Logical Rhythm")
	}
	assertStatus(request("GET", "/api/v1/cs/project/links.csv?event=logical", 5, "", false), 400)
	assertStatus(request("GET", "/api/v1/cs/project/links.csv?event=unknown", 5, "", false), 400)
	// Revoking a registration must not leave its final links orphaned. This
	// only operates on synthetic fixture rows inside the rollback transaction.
	event, _ := dao.ToEvent("webster")
	if err := dao.RevokeTeam(event, 101); err != nil {
		t.Fatal(err)
	}
	revoked, err := dao.GetProjectLinks(101)
	if err != nil || revoked != nil {
		t.Fatal("revoked team's final links were not removed")
	}
	droidAfter, err := dao.GetProjectLinks(201)
	if err != nil || droidAfter == nil {
		t.Fatal("revoking one team changed another team's links")
	}
}
