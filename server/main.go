package main

import (
	"encoding/gob"
	"os"

	"github.com/CC-MNNIT/CodeSangam/server/docs"
	"github.com/CC-MNNIT/CodeSangam/server/initialize"
	"github.com/CC-MNNIT/CodeSangam/server/routers"
	"github.com/CC-MNNIT/CodeSangam/server/utils"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func init() {
	initialize.LoadEnv()
	initialize.ConnectDB()
	initialize.SetupOAuthClient()

	gob.Register(utils.Key(""))
}

// @title CodeSangam API
// @description This is the API for CodeSangam
func main() {
	baseUrl := os.Getenv("BASE_URL") + "/api"
	router := echo.New()
	router.Use(session.Middleware(sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET")))))
	router.Static(os.Getenv("BASE_URL")+"/static", "web/static")
	initialize.InitTemplateRenderer(router)

	docs.SwaggerInfo.BasePath = baseUrl

	router.GET(baseUrl+"/v1/swagger/*", echoSwagger.WrapHandler)

	MergeRouters(router, &baseUrl, routers.AuthRouter, routers.Index, routers.ContriHub, routers.CodeSangam)

	router.Logger.Fatal(router.Start(":" + os.Getenv("PORT")))
}

func MergeRouters(rootRouter *echo.Echo, baseUrl *string, routers ...func(*echo.Echo, *string)) {
	for _, router := range routers {
		router(rootRouter, baseUrl)
	}
}
