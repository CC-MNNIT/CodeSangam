package initialize

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"os"
)

var Db *gorm.DB
var ContriHubDB *gorm.DB

func ConnectDB() {
	// DB_URL=username:pass@tcp(ip:port)/dbname?charset=utf8mb4&parseTime=True&loc=Local
	csDB()
	contriDB()
}

func csDB() {
	var err error

	dsn := os.Getenv("DB_URL")
	Db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Println("Error connecting to root database")
		panic(err)
	}
}

func contriDB() {
	var err error

	dsn := os.Getenv("CONTRI_DB_URL")
	ContriHubDB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Println("Error connecting to ContriHUB database")
		panic(err)
	}
}
