package controller

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"regexp"
	"strings"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
	"github.com/labstack/echo/v4"
)

// UserDashboard
//
// @Summary Get user profile
// @Schemes
// @Description Get user profile
// @Tags Auth
// @Security OAuth2
// @Accept json
// @Produce html
// @Failure 401 {string} Unauthorized
// @Router /auth/dashboard [get]
func UserDashboard(c echo.Context) error {
	sess, err := utils.GetSession(c)
	if err != nil {
		return utils.InternalError(c, "Unable to get session", &err)
	}

	userBytes := sess.Values[utils.UserSessionKey]
	if userBytes == nil {
		return utils.InternalError(c, "Unauthorized", nil)
	}

	user, err := dao.GetUserInfo(userBytes.(int))
	if err != nil {
		return utils.InternalError(c, "Unable to unmarshal user info", &err)
	}
	teams := make([]*models.DashboardTeam, 0)
	teams = append(teams, user.DroidRushTeam)
	teams = append(teams, user.WebsterTeam)
	teams = append(teams, user.SoftablitzTeam)
	teams = append(teams, user.LogicalRhythmTeam)

	return c.Render(http.StatusOK, "dashboard.html", map[string]interface{}{
		"UserInfo":   user.User,
		"Teams":      teams,
		"EventsInfo": models.EventsInfo,
		"BaseUrl":    config.EnvVars.BaseUrl,
	})
}

// LoginPage
//
// @Summary Login page
// @Schemes
// @Description Login page
// @Tags Auth
// @Accept json
// @Produce html
// @Success 200 {object} map[string]string
// @Router /auth [get]
func LoginPage(c echo.Context) error {
	return c.Render(http.StatusOK, "login.html", map[string]interface{}{
		"BaseUrl": config.EnvVars.BaseUrl,
	})
}

// GoogleLogout
//
// @Summary Logout
// @Schemes
// @Description Logout
// @Tags Auth
// @Security OAuth2
// @Accept json
// @Produce html
// @Success 302 {object} map[string]string
// @Failure 401 {string} Unauthorized
// @Router /auth/logout [get]
func GoogleLogout(c echo.Context) error {
	err := utils.InvalidateSession(c)
	if err != nil {
		return utils.InternalError(c, "Unable to logout", &err)
	}
	return c.Redirect(http.StatusTemporaryRedirect, config.EnvVars.BaseUrl+"/")
}

// GoogleLogin
//
// @Summary Login
// @Schemes
// @Description Login
// @Tags Auth
// @Accept json
// @Produce html
// @Success 302 {object} map[string]string
// @Failure 401 {string} Unauthorized
// @Router /auth/login [get]
func GoogleLogin(c echo.Context) error {
	randState, err := generateRandomState()
	if err != nil {
		return utils.InternalError(c, "Unable to generate random state", &err)
	}

	err = utils.SetSession(c, utils.SessionTempAge, &map[utils.Key]interface{}{
		utils.StateSessionKey: randState,
	})
	if err != nil {
		return utils.InternalError(c, "Unable to save session", &err)
	}

	url := config.GoogleOAuthConfig.AuthCodeURL(randState)
	return c.Redirect(http.StatusTemporaryRedirect, url)
}

// GoogleCallback
//
// @Summary Callback
// @Schemes
// @Description Callback
// @Tags Auth
// @Accept json
// @Produce html
// @Success 302 {object} map[string]string
// @Failure 401 {string} Unauthorized
// @Router /auth/callback [get]
func GoogleCallback(c echo.Context) error {
	// Get session
	sess, err := utils.GetSession(c)
	if err != nil {
		return utils.InternalError(c, "Unable to get session", &err)
	}

	// Check state is valid
	if sess.Values[utils.StateSessionKey] != c.QueryParam("state") {
		return utils.UnauthorizedError(c, "Invalid session state", nil)
	}

	// Exchange code for token
	code := c.QueryParam("code")
	token, err := config.GoogleOAuthConfig.Exchange(c.Request().Context(), code)
	if err != nil {
		return utils.UnauthorizedError(c, "Unable to exchange code for token", &err)
	}

	// Check token is valid
	if !token.Valid() {
		return utils.UnauthorizedError(c, "Invalid token", nil)
	}

	// Get user info bytes
	client := config.GoogleOAuthConfig.Client(c.Request().Context(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return utils.UnauthorizedError(c, "Unable to get user info", &err)
	}

	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return utils.UnauthorizedError(c, "Unable to read user info", &err)
	}

	// User info to struct
	var user models.OAuthUser
	err = json.Unmarshal(data, &user)
	if err != nil {
		return utils.UnauthorizedError(c, "Unable to unmarshal user info", &err)
	}

	r, err := regexp.Compile(`\.(.*?)@`)
	if err != nil {
		return utils.InternalError(c, "Unable to compile regex", &err)
	}

	// Save user info in database
	dbUser, err := dao.SaveUser(&models.UserDto{
		RegNo:  strings.ReplaceAll(strings.ReplaceAll(r.FindString(user.Email), ".", ""), "@", ""),
		Email:  user.Email,
		Name:   user.Name,
		Avatar: user.Picture,
	})
	if err != nil {
		return utils.InternalError(c, "Unable to save/get user info", &err)
	}

	// Save user info in session
	err = utils.SetSessionWith(sess, c, utils.SessionMaxAge, &map[utils.Key]interface{}{
		utils.StateSessionKey: nil,
		utils.UserSessionKey:  dbUser.UserId,
		utils.TokenSessionKey: token.AccessToken,
	})
	if err != nil {
		return utils.InternalError(c, "Unable to save session", &err)
	}

	// Response
	return c.Redirect(http.StatusTemporaryRedirect, config.EnvVars.BaseUrl+"/api/auth/dashboard")
}

func generateRandomState() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	str := base64.StdEncoding.EncodeToString(b)
	return str, nil
}
