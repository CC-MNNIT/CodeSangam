package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/CC-MNNIT/CodeSangam/server/middleware"
	"github.com/labstack/echo/v4"
)

// AdminRouter mounts the admin page at /api/admin and its JSON actions under
// /api/admin/... . Every route requires a signed-in admin.
func AdminRouter(baseRouter *echo.Group) {
	baseRouter.GET("/admin", controller.AdminPage, middleware.AdminPageMiddleware())

	g := baseRouter.Group("/admin", middleware.AdminAPIMiddleware())
	g.POST("/team/rename", controller.AdminRenameTeam)
	g.POST("/team/member/add", controller.AdminAddMember)
	g.POST("/team/member/remove", controller.AdminRemoveMember)
	g.POST("/team/revoke", controller.AdminRevokeTeam)
	g.POST("/user/update", controller.AdminUpdateUser)
	g.POST("/user/delete", controller.AdminDeleteUser)
	g.POST("/admins/add", controller.AdminAddAdmin)
	g.POST("/admins/remove", controller.AdminRemoveAdmin)
}
