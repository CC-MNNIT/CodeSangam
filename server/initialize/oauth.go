package initialize

import (
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var GoogleOAuthConfig *oauth2.Config

func SetupOAuthClient() {
	GoogleOAuthConfig = &oauth2.Config{
		ClientID:     os.Getenv("CLIENT_ID"),
		ClientSecret: os.Getenv("CLIENT_SECRET"),
		RedirectURL:  os.Getenv("REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}
