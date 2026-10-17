package main

import (
	"log"

	config "github.com/CC-MNNIT/CodeSangam/server/config"
	"github.com/CC-MNNIT/CodeSangam/server/dao"
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
	if err := dao.EnsureAdmins(); err != nil {
		log.Fatalln("Unable to prepare the admin table: " + err.Error())
	}

	baseUrl := config.EnvVars.BaseUrl + "/api"
	router := echo.New()
	router.Use(session.Middleware(config.SessionCookieStore))
	// Hard ceiling on request bodies. nginx already caps uploads with
	// client_max_body_size (4m) and the app's own limit is 3 MB, so this is
	// deliberately *above* nginx's: nginx then rejects oversized uploads
	// cleanly instead of us closing the connection mid-upload, which nginx
	// would surface to the user as a 502. Note "M" here is decimal (5,000,000
	// bytes) while nginx's "m" is binary (4,194,304 bytes).
	router.Use(middleware.BodyLimit("5M"))
	router.Use(middleware.CORS())
	router.Static(config.EnvVars.BaseUrl+"/api/static", "web/static")
	config.InitTemplateRenderer(router)

	docs.SwaggerInfo.BasePath = baseUrl

	router.GET(baseUrl+"/swagger/*", echoSwagger.WrapHandler)

	baseRouter := router.Group(baseUrl)
	routers.AuthRouter(baseRouter)
	routers.AdminRouter(baseRouter)
	baseRouter = baseRouter.Group("/v1")

	MergeRouters(baseRouter, routers.Index, routers.ContriHub, routers.CodeSangam)

	router.Logger.Fatal(router.Start(":" + config.EnvVars.Port))
}

func MergeRouters(baseRouter *echo.Group, routers ...func(*echo.Group)) {
	for _, router := range routers {
		router(baseRouter)
	}
}
