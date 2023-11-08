package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/CC-MNNIT/CodeSangam/server/middleware"
	"github.com/labstack/echo/v4"
)

func CodeSangam(baseRouter *echo.Group) {
	g := baseRouter.Group("/cs")

	g.POST("/user", controller.SaveUser)
	g.GET("/user", controller.GetUserInfo)
	g.GET("/ranking", controller.GetEventRanking)

	g.POST("/register", controller.RegisterTeam, middleware.DeadlineMiddleware())

	g.POST("/abstract", controller.UploadAbstractSubmission, middleware.DeadlineMiddleware())
	g.GET("/abstract", controller.GetAbstractFile)

	g.POST("/allot", controller.AllotTeamsToMentor)
	g.GET("/allot", controller.GetAllotmentCSV)
}
