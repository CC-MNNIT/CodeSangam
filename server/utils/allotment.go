package utils

import (
	"errors"
	"os"
	"strconv"

	"github.com/CC-MNNIT/CodeSangam/server/dao"
)

const (
	csvPath = "files/csv/"
)

func GetAllotmentCSV(userId int, event string) (string, error) {
	mentorTeam, err := dao.GetTeamsForMentorEvent(userId, event)
	if err != nil {
		return "", err
	}

	strUserId := strconv.Itoa(userId)

	data := "Team ID,Team Name,Leader Name,Leader RegNo,Team Abstract,Score\n"
	for _, team := range mentorTeam.Teams {
		teamId := strconv.Itoa(team.TeamId)
		data += teamId + "," + team.Name + "," + team.Members[0].Name + "," + team.Members[0].RegNo + ",\"=HYPERLINK(\"\"https://sac.mnnit.ac.in/codesangam/api/v1/cs/abstract?id=" + teamId + "\"\",\"\"Abstract Link - PDF [" + teamId + "]\"\")\",0\n"
	}

	path := csvPath + event
	err = os.MkdirAll(path, os.ModePerm)
	if err != nil {
		return "", errors.New("unable to create directory")
	}

	dst, err := os.Create(path + "/" + strUserId + ".csv")
	if err != nil {
		return "", errors.New("unable to create file")
	}
	defer dst.Close()

	dst.WriteString(data)
	dst.Sync()

	return path + "/" + strUserId + ".csv", nil
}
