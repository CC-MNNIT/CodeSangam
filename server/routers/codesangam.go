package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/labstack/echo/v4"
)

func CodeSangam(baseRouter *echo.Group) {
	g := baseRouter.Group("/cs")

	g.POST("/user", controller.SaveUser)
	g.GET("/user", controller.GetUserInfo)
	g.POST("/register", controller.RegisterTeam)
}
