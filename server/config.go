package main

import (
	"encoding/json"
	"log"
	"os"
)

type Category struct {
	Images int
}

var config map[string]Category

func loadConfig() {
	f, err := os.Open("config/config.json")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	err = json.NewDecoder(f).Decode(&config)
	if err != nil {
		log.Fatal(err)
	}
}
