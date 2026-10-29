package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/CC-MNNIT/CodeSangam/server/middleware"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

func CodeSangam(baseRouter *echo.Group) {
	g := baseRouter.Group("/cs")

	g.POST("/user", controller.SaveUser)
	g.GET("/user", controller.GetUserInfo)
	g.GET("/ranking", controller.GetEventRanking)
	g.GET("/deadline", controller.GetRegistrationDeadline)

	g.POST("/register", controller.RegisterTeam, middleware.DeadlineMiddleware())

	g.POST("/abstract", controller.UploadAbstractSubmission, middleware.DeadlineMiddleware(), middleware.DrainBody())
	g.GET("/abstract", controller.GetAbstractFile)

	// This form stays open after registration/abstracts close. The team is
	// derived from the session, not a team id supplied by the browser.
	g.POST("/project", controller.SubmitProjectLinks, middleware.ProjectRequestMiddleware(), echoMiddleware.BodyLimit("4K"))
	g.GET("/project/links.csv", controller.ProjectLinksCSV, middleware.AdminDownloadMiddleware())

	g.POST("/allot", controller.AllotTeamsToMentor)
	g.GET("/allot", controller.GetAllotmentCSV)

	g.POST("/midterm", controller.UploadMidTermEval)
}
