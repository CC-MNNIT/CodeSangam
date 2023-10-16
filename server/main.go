package main

import (
	"log"
	"os"

	_ "github.com/CC-MNNIT/CodeSangam/server/docs"
	"github.com/CC-MNNIT/CodeSangam/server/initialize"
	"github.com/CC-MNNIT/CodeSangam/server/routers"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func init() {
	initialize.LoadEnv()
	initialize.ConnectDB()
}

// @title CodeSangam API
// @description This is the API for CodeSangam
func main() {
	router := gin.Default()
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	MergeRouters(router, routers.Index)

	log.Print("Starting backend server at port ", os.Getenv("PORT"))
	router.Run()
}

func MergeRouters(rootRouter *gin.Engine, routers ...func(*gin.Engine)) {
	for _, router := range routers {
		router(rootRouter)
	}
}
