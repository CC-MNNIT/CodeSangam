package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/labstack/echo/v4"
)

func Index(router *echo.Echo) {
	router.GET("/go", controller.HelloGO)
}
