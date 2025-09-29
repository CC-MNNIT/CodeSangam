package utils

import (
	"errors"
	"io"
	"log"
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
		log.Printf("Failed to copy abstract file for team %d, event %s: %v", teamId, event.String(), err)
		return errors.New("unable to copy file")
	}
	
	log.Printf("Abstract successfully saved for team %d, event %s, file: %s", teamId, event.String(), dst.Name())
	return nil		
}

func AbstractExists(team *models.DashboardTeam, event string) bool {
	if team == nil {
		return false
	}

	_, exists := exists(team.TeamId, event)
	return exists
}

func exists(teamId int, event string) (string, bool) {
	filePath := abstractPath + event + "/" + strconv.Itoa(teamId) + ".pdf"
	_, err := os.Stat(filePath)
	return filePath, err == nil
}

func GetAbstractFile(strTeamId string) (string, error) {
	teamId, err := strconv.Atoi(strTeamId)
	if err != nil {
		return "", errors.New("invalid team id")
	}

	if path, exists := exists(teamId, "droidrush"); exists {
		return path, nil
	}
	if path, exists := exists(teamId, "webster"); exists {
		return path, nil
	}
	if path, exists := exists(teamId, "softablitz"); exists {
		return path, nil
	}
	return "", errors.New("abstract for team Id [" + strTeamId + "] does not exist")
}
