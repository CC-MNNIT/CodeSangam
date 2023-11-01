package main

import (
	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/docs"
	"github.com/CC-MNNIT/CodeSangam/server/routers"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
)

// @title CodeSangam API
// @description This is the API for CodeSangam
// @version 1
//
// @securityDefinitions.oauth2
// @authorizationUrl /api/auth/login
// @tokenUrl /api/auth/callback
// @scope openid
func main() {
	baseUrl := config.EnvVars.BaseUrl + "/api"
	router := echo.New()
	router.Use(session.Middleware(config.SessionCookieStore))
	router.Use(middleware.CORS())
	router.Static(config.EnvVars.BaseUrl+"/api/static", "web/static")
	config.InitTemplateRenderer(router)

	docs.SwaggerInfo.BasePath = baseUrl

	router.GET(baseUrl+"/swagger/*", echoSwagger.WrapHandler)

	baseRouter := router.Group(baseUrl)
	routers.AuthRouter(baseRouter)
	baseRouter = baseRouter.Group("/v1")

	MergeRouters(baseRouter, routers.Index, routers.ContriHub, routers.CodeSangam)

	router.Logger.Fatal(router.Start(":" + config.EnvVars.Port))
}

func MergeRouters(baseRouter *echo.Group, routers ...func(*echo.Group)) {
	for _, router := range routers {
		router(baseRouter)
	}
}
