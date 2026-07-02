package main

import (
	"log"
	"mimisbrunnr/internal/data"

	//"mimisbrunnr/internal/user"
	"net/http"
)

func main() {
	if err := data.InitDB(); err != nil {
		log.Fatal("Failed to initialized database: ", err)
	}
	defer data.CloseDB()

	db := data.GetDB()

	db.AutoMigrate(&User{})

	srv := http.Server{
		Addr:    ":8000",
		Handler: nil,
	}

	log.Println("Running on :8000")
	srv.ListenAndServe()
}
