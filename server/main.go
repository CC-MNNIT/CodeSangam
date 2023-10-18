package main

import (
	"os"

	"github.com/CC-MNNIT/CodeSangam/server/docs"
	"github.com/CC-MNNIT/CodeSangam/server/initialize"
	"github.com/CC-MNNIT/CodeSangam/server/routers"
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func init() {
	initialize.LoadEnv()
	initialize.ConnectDB()
}

// @title CodeSangam API
// @description This is the API for CodeSangam
func main() {
	baseUrl := os.Getenv("BASE_URL")
	router := echo.New()

	docs.SwaggerInfo.BasePath = baseUrl

	router.GET(baseUrl+"/swagger/*", echoSwagger.WrapHandler)

	MergeRouters(router, &baseUrl, routers.Index, routers.ContriHub, routers.CodeSangam)

	router.Logger.Fatal(router.Start(":" + os.Getenv("PORT")))
}

func MergeRouters(rootRouter *echo.Echo, baseUrl *string, routers ...func(*echo.Echo, *string)) {
	for _, router := range routers {
		router(rootRouter, baseUrl)
	}
}
