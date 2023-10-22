package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/labstack/echo/v4"
)

func Index(baseRouter *echo.Group) {
	g := baseRouter

	g.GET("/go", controller.HelloGO)
}
