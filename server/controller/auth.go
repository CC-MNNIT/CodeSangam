package controller

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/initialize"
	"github.com/CC-MNNIT/CodeSangam/server/models"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
	"github.com/labstack/echo/v4"
)

func GoogleProfile(c echo.Context) error {
	sess, err := utils.GetSession(c)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to get session")
	}

	userBytes := sess.Values[utils.UserSessionKey]
	if userBytes == nil {
		return c.String(http.StatusUnauthorized, "Unauthorized")
	}

	var user models.User
	err = json.Unmarshal([]byte(userBytes.(string)), &user)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to unmarshal user info")
	}
	return c.JSON(http.StatusOK, &user)
}

func LoginPage(c echo.Context) error {
	return c.Render(http.StatusOK, "login.html", map[string]interface{}{
		"BaseUrl": os.Getenv("BASE_URL"),
	})
}

func GoogleLogout(c echo.Context) error {
	err := utils.InvalidateSession(c)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to logout")
	}
	return c.Redirect(http.StatusTemporaryRedirect, os.Getenv("BASE_URL")+"/")
}

func GoogleLogin(c echo.Context) error {
	randState, err := generateRandomState()
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to generate random state")
	}

	err = utils.SetSession(c, utils.SessionTempAge, &map[utils.Key]interface{}{
		utils.StateSessionKey: randState,
	})
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to save session")
	}

	url := initialize.GoogleOAuthConfig.AuthCodeURL(randState)
	return c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c echo.Context) error {
	// Get session
	sess, err := utils.GetSession(c)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to get session")
	}

	// Check state is valid
	if sess.Values[utils.StateSessionKey] != c.QueryParam("state") {
		return c.String(http.StatusUnauthorized, "Invalid session state")
	}

	// Exchange code for token
	code := c.QueryParam("code")
	token, err := initialize.GoogleOAuthConfig.Exchange(c.Request().Context(), code)
	if err != nil {
		return c.String(http.StatusUnauthorized, "Unable to exchange code for token")
	}

	// Check token is valid
	if !token.Valid() {
		return c.String(http.StatusUnauthorized, "Invalid token")
	}

	// Get user info bytes
	client := initialize.GoogleOAuthConfig.Client(c.Request().Context(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return c.String(http.StatusUnauthorized, "Unable to get user info")
	}

	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.String(http.StatusUnauthorized, "Unable to read user info")
	}

	// User info to struct
	var user models.OAuthUser
	err = json.Unmarshal(data, &user)
	if err != nil {
		return c.String(http.StatusUnauthorized, "Unable to unmarshal user info")
	}

	r, err := regexp.Compile(`\.(.*?)@`)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to compile regex")
	}

	// Save user info in database
	dbUser, err := dao.SaveUser(&models.UserDto{
		RegNo:  strings.ReplaceAll(strings.ReplaceAll(r.FindString(user.Email), ".", ""), "@", ""),
		Email:  user.Email,
		Name:   user.Name,
		Avatar: user.Picture,
	})
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to save/get user info")
	}

	jDbUser, err := json.Marshal(dbUser)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to marshal user info")
	}

	// Save user info in session
	err = utils.SetSessionWith(sess, c, utils.SessionMaxAge, &map[utils.Key]interface{}{
		utils.StateSessionKey: nil,
		utils.UserSessionKey:  string(jDbUser),
		utils.TokenSessionKey: token.AccessToken,
	})
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to save session")
	}

	// Response
	return c.Redirect(http.StatusTemporaryRedirect, os.Getenv("BASE_URL")+"/api/auth/profile")
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
