package utils

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type errorPayload struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}

func InternalError(c echo.Context, msg string, err *error) error {
	return produceErr(c, http.StatusInternalServerError, msg, err)
}

func UnauthorizedError(c echo.Context, msg string, err *error) error {
	return produceErr(c, http.StatusUnauthorized, msg, err)
}

func BadRequestError(c echo.Context, msg string, err *error) error {
	return produceErr(c, http.StatusBadRequest, msg, err)
}

// ForbiddenError is for a signed-in person asking for something the server
// deliberately refuses - a closed submission window, for example. It is not a
// client mistake, so it must not read as a 400.
func ForbiddenError(c echo.Context, msg string, err *error) error {
	return produceErr(c, http.StatusForbidden, msg, err)
}

func produceErr(c echo.Context, code int, msg string, err *error) error {
	var errMsg = ""
	if err != nil {
		errMsg = (*err).Error()
	}
	log.Println("ERR: " + msg + " -- " + errMsg)
	return c.JSON(code, &errorPayload{
		Message: msg,
		Error:   errMsg,
	})
}
