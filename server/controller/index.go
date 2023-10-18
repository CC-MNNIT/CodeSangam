package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// HelloGO
//
// @Summary GO ping
// @Schemes
// @Description Do ping
// @Tags Index
// @Accept json
// @Produce json
// @Success 200 {object} map[string]string
// @Router /go [get]
func HelloGO(c echo.Context) error {
	type pong struct {
		Message string `json:"message"`
	}
	return c.JSON(http.StatusOK, &pong{Message: "Let's GO"})
}
