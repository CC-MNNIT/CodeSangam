package main

import (
	"os"

	_ "github.com/CC-MNNIT/CodeSangam/server/docs"
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
	router := echo.New()
	router.GET("/swagger/*", echoSwagger.WrapHandler)

	MergeRouters(router, routers.Index, routers.ContriHub)

	router.Logger.Fatal(router.Start(":" + os.Getenv("PORT")))
}

func MergeRouters(rootRouter *echo.Echo, routers ...func(*echo.Echo)) {
	for _, router := range routers {
		router(rootRouter)
	}
}
