package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/labstack/echo/v4"
)

func ContriHub(router *echo.Echo) {
	g := router.Group("/api/v1/contrihub")

	g.GET("/rankings", controller.GetContriHubRankings)
}
