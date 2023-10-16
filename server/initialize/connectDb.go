package initialize

import (
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func ConnectDB() {
	var err error

	// DB_URL=username:pass@tcp(127.0.0.1:port)/dbname?charset=utf8mb4&parseTime=True&loc=Local
	dsn := os.Getenv("DB_URL")
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Error connecting to database")
		panic(err)
	}
}
