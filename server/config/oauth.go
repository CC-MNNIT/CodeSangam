package initialize

import (
	"log"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var GoogleOAuthConfig *oauth2.Config

func setupOAuthClient() {
	GoogleOAuthConfig = &oauth2.Config{
		ClientID:     EnvVars.clientId,
		ClientSecret: EnvVars.clientSecret,
		RedirectURL:  EnvVars.redirectUrl,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
	log.Println("Loaded OAuth client")
}
