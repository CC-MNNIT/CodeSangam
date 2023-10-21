package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/CC-MNNIT/CodeSangam/server/middleware"
	"github.com/labstack/echo/v4"
)

func AuthRouter(baseRouter *echo.Group) {
	g := baseRouter.Group("/auth")

	g.GET("", controller.LoginPage, middleware.AuthLoginMiddleware())
	g.GET("/profile", controller.GoogleProfile, middleware.AuthMiddleware())
	g.GET("/login", controller.GoogleLogin)
	g.GET("/logout", controller.GoogleLogout)
	g.GET("/callback", controller.GoogleCallback)
}
