package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/labstack/echo/v4"
)

func Index(router *echo.Echo, baseUrl *string) {
	g := router.Group(*baseUrl).Group("/v1")
	g.GET("/go", controller.HelloGO)
}
