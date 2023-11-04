package utils

import (
	"errors"
	"io"
	"mime/multipart"
	"os"
	"strconv"

	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/models"
)

const (
	abstractPath = "files/abstracts/"
)

func SaveAbstract(file *multipart.FileHeader, event dao.Event, teamId int) error {
	src, err := file.Open()
	if err != nil {
		return errors.New("unable to open file")
	}
	defer src.Close()

	path := abstractPath + event.String()
	err = os.MkdirAll(path, os.ModePerm)
	if err != nil {
		return errors.New("unable to create directory")
	}

	dst, err := os.Create(path + "/" + strconv.Itoa(teamId) + ".pdf")
	if err != nil {
		return errors.New("unable to create file")
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return errors.New("unable to copy file")
	}
	return nil
}

func AbstractExists(team *models.DashboardTeam, event string) bool {
	if team == nil {
		return false
	}

	filePath := abstractPath + event + "/" + strconv.Itoa(team.TeamId) + ".pdf"
	_, err := os.Stat(filePath)
	return err == nil
}
