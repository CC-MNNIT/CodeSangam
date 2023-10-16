package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Pong struct {
	Message string `json:"message"`
}

// @Summary GO ping
// @Schemes
// @Description Do ping
// @Tags Index
// @Accept json
// @Produce json
// @Success 200 {string} Let's GO
// @Router /go [get]
// @Model Pong
func HelloGO(c echo.Context) error {
	return c.JSON(http.StatusOK, &Pong{Message: "Let's GO"})
}
