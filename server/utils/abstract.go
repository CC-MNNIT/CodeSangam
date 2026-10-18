package utils

import (
	"errors"
	"io"
	"log"
	"mime/multipart"
	"os"
	"strconv"
	"time"

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

	// Write to a temporary file first and swap it in only once it is fully
	// written, so replacing an abstract never leaves a half-written PDF and
	// the old file is deleted only when the new one is safe.
	final := path + "/" + strconv.Itoa(teamId) + ".pdf"
	tmp := final + ".uploading"
	dst, err := os.Create(tmp)
	if err != nil {
		return errors.New("unable to create file")
	}
	defer os.Remove(tmp)
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		log.Printf("Failed to copy abstract file for team %d, event %s: %v", teamId, event.String(), err)
		return errors.New("unable to copy file")
	}

	if err := dst.Close(); err != nil {
		return errors.New("unable to write file")
	}
	if err := os.Rename(tmp, final); err != nil {
		return errors.New("unable to replace the previous abstract")
	}

	log.Printf("Abstract successfully saved for team %d, event %s, file: %s", teamId, event.String(), final)
	return nil
}

func AbstractExists(team *models.DashboardTeam, event string) bool {
	if team == nil {
		return false
	}

	_, exists := AbstractPath(team.TeamId, event)
	return exists
}

// AbstractPath returns where a team's abstract for an event lives, and whether
// that file actually exists. Anything that links to a PDF must gate on the
// boolean: the abstract table records a submission, but the file can be gone.
func AbstractPath(teamId int, event string) (string, bool) {
	filePath := abstractPath + event + "/" + strconv.Itoa(teamId) + ".pdf"
	_, err := os.Stat(filePath)
	return filePath, err == nil
}

// GetAbstractFile finds a team's abstract file. Only the three events with an
// abstract round are searched; Logical Rhythm has none, so nothing can exist
// under files/abstracts/logical.
func GetAbstractFile(strTeamId string) (string, error) {
	teamId, err := strconv.Atoi(strTeamId)
	if err != nil {
		return "", errors.New("invalid team id")
	}

	if path, exists := AbstractPath(teamId, "droidrush"); exists {
		return path, nil
	}
	if path, exists := AbstractPath(teamId, "webster"); exists {
		return path, nil
	}
	if path, exists := AbstractPath(teamId, "softablitz"); exists {
		return path, nil
	}
	return "", errors.New("abstract for team Id [" + strTeamId + "] does not exist")
}

// IsPDF checks the upload really is a PDF by its first bytes, not its name.
func IsPDF(file *multipart.FileHeader) bool {
	src, err := file.Open()
	if err != nil {
		return false
	}
	defer src.Close()
	head := make([]byte, 5)
	n, _ := io.ReadFull(src, head)
	return n == 5 && string(head) == "%PDF-"
}

// AbstractUploadedAt returns when a team's abstract file was last written,
// or the zero time when there is none.
func AbstractUploadedAt(teamId int, event string) time.Time {
	path, ok := AbstractPath(teamId, event)
	if !ok {
		return time.Time{}
	}
	info, err := os.Stat(path)
	if err != nil {
		return time.Time{}
	}
	return info.ModTime()
}
