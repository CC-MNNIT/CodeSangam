package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/labstack/echo/v4"
)

func ContriHub(router *echo.Echo, baseUrl *string) {
	g := router.Group(*baseUrl).Group("/contrihub")

	g.GET("/rankings", controller.GetContriHubRankings)
}
