package routers

import (
	"github.com/CC-MNNIT/CodeSangam/server/controller"
	"github.com/gin-gonic/gin"
)

func Index(router *gin.Engine) {
	router.GET("/go", controller.HelloGO)
}
