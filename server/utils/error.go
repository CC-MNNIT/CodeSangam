package utils

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

func InternalError(c echo.Context, msg string, err *error) error {
	return produceErr(c, http.StatusInternalServerError, msg, err)
}

func UnauthorizedError(c echo.Context, msg string, err *error) error {
	return produceErr(c, http.StatusInternalServerError, msg, err)
}

func BadRequestError(c echo.Context, msg string, err *error) error {
	return produceErr(c, http.StatusBadRequest, msg, err)
}

func produceErr(c echo.Context, code int, msg string, err *error) error {
	var errMsg = ""
	if err != nil {
		errMsg = (*err).Error()
	}
	log.Println("ERR: " + msg + " -- " + errMsg)
	return c.String(code, msg+" -- "+errMsg)
}
