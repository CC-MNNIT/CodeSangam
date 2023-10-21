package initialize

import (
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Db *gorm.DB
var ContriHubDB *gorm.DB

func connectDB() {
	log.Println("Connecting DBs")
	csDB()
	contriDB()
}

func csDB() {
	var err error

	dsn := EnvVars.dbUrl
	Db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalln("Error connecting to root database")
	}
}

func contriDB() {
	var err error

	dsn := EnvVars.contriDbUrl
	ContriHubDB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalln("Error connecting to ContriHUB database")
	}
}
