package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/labstack/echo/v4"
)

func CodeSangam(router *echo.Echo, baseUrl *string) {
	g := router.Group(*baseUrl).Group("/cs")

	g.POST("/user", controller.SaveUser)
}
