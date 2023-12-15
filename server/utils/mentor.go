package utils

import (
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"strconv"

	"github.com/CC-MNNIT/CodeSangam/server/dao"
	"github.com/CC-MNNIT/CodeSangam/server/models"
)

const (
	csvPath     = "files/allotment/"
	midTermPath = "files/midterm/"
)

func GetAllotmentCSV(userId int, event string) (string, error) {
	mentorTeam, err := dao.GetTeamsForMentorEvent(userId, event)
	if err != nil {
		return "", err
	}

	strUserId := strconv.Itoa(userId)

	data := "Team ID,Team Name,Leader Name,Leader RegNo,Team Abstract,Abstract Score,MidTerm Score,Total Score\n"
	for _, team := range mentorTeam.Teams {
		teamId := strconv.Itoa(team.TeamId)
		data += teamId + "," + team.Name + "," + team.Members[0].Name + "," + team.Members[0].RegNo + ",\"=HYPERLINK(\"\"https://sac.mnnit.ac.in/codesangam/api/v1/cs/abstract?id=" + teamId + "\"\",\"\"Abstract Link - PDF [" + teamId + "]\"\")\",0,0,0\n"
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

func SaveMidTermCSV(file *multipart.FileHeader, userId int, event string) error {
	_, exists := midTermCSVExists(userId, event)
	if exists {
		return errors.New("mid term eval already submitted")
	}

	src, err := file.Open()
	if err != nil {
		return errors.New("unable to open file")
	}
	defer src.Close()

	path := midTermPath + event
	err = os.MkdirAll(path, os.ModePerm)
	if err != nil {
		return errors.New("unable to create directory")
	}

	dst, err := os.Create(path + "/" + strconv.Itoa(userId) + "_t.csv")
	if err != nil {
		return errors.New("unable to create file")
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return errors.New("unable to copy file")
	}
	return nil
}

func midTermCSVExists(userId int, event string) (string, bool) {
	filePath := midTermPath + event + "/" + strconv.Itoa(userId) + ".csv"
	return fileExists(filePath)
}

func fileExists(filePath string) (string, bool) {
	_, err := os.Stat(filePath)
	return filePath, err == nil
}

func UploadMidTermScores(userId int, event string) error {
	finalPath, exists := midTermCSVExists(userId, event)
	if exists {
		return errors.New("mid term eval already submitted")
	}

	filePath := midTermPath + event + "/" + strconv.Itoa(userId) + "_t.csv"

	_, tempExists := fileExists(filePath)
	if !tempExists {
		return errors.New("mid term eval not submitted")
	}

	records, err := readCSV(filePath)
	if err != nil {
		return err
	}

	teamScores, err := parseCSV(records)
	if err != nil {
		return err
	}

	mentorTeam, err := dao.GetTeamsForMentorEvent(userId, event)
	if err != nil {
		return err
	}

	invalidTeamIds := make([]int, 0)

	teams := mapTeams(mentorTeam)
	for _, teamScore := range teamScores {
		_, ok := teams[teamScore[0]]
		if !ok {
			invalidTeamIds = append(invalidTeamIds, teamScore[0])
			continue
		}
		err := dao.SetTeamScore(event, teamScore[0], teamScore[1])
		if err != nil {
			return err
		}
	}

	if len(invalidTeamIds) > 0 {
		return errors.New("invalid team ids: " + fmt.Sprintf("%v", invalidTeamIds))
	}

	err = os.Rename(filePath, finalPath)
	if err != nil {
		return err
	}

	return nil
}

func mapTeams(mentorTeam *models.MentorTeam) map[int]models.DashboardTeam {
	m := make(map[int]models.DashboardTeam)
	for _, team := range mentorTeam.Teams {
		m[team.TeamId] = *team
	}
	return m
}

func parseCSV(records [][]string) ([][2]int, error) {
	if len(records) == 0 {
		return [][2]int{}, errors.New("records empty")
	}
	if len(records[0]) != 2 {
		return [][2]int{}, errors.New("invalid records")
	}

	var scores [][2]int
	for _, record := range records {
		teamId, err := strconv.Atoi(record[0])
		if err != nil {
			return [][2]int{}, err
		}
		score, err := strconv.Atoi(record[1])
		if err != nil {
			return [][2]int{}, err
		}
		if score > 40 || score < 0 {
			return [][2]int{}, errors.New("invalid score for team: " + record[0])
		}
		scores = append(scores, [2]int{teamId, score})
	}
	return scores, nil
}

func readCSV(filePath string) ([][]string, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return [][]string{}, err
	}
	defer f.Close()

	reader := csv.NewReader(f)
	records, err := reader.ReadAll()
	if err != nil {
		return [][]string{}, err
	}

	if len(records) == 0 {
		return [][]string{}, errors.New("records empty")
	}

	return records[1:], nil
}
