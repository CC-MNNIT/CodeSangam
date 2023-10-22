package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/labstack/echo/v4"
)

func ContriHub(baseRouter *echo.Group) {
	g := baseRouter.Group("/contrihub")

	g.GET("/rankings", controller.GetContriHubRankings)
}
