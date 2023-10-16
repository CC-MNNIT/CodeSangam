package controller

import "github.com/gin-gonic/gin"

// @Summary GO ping
// @Schemes
// @Description Do ping
// @Tags Index
// @Accept json
// @Produce json
// @Success 200 {string} Let's GO
// @Router /go [get]
func HelloGO(g *gin.Context) {
	g.JSON(200, gin.H{
		"message": "Let's GO",
	})
}
