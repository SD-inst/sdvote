package main

import (
	"crypto/rand"
	"embed"
	"fmt"
	"io/fs"
	"log"
	"math/big"
	"strings"
	"time"

	"github.com/jessevdk/go-flags"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

//go:embed webroot
var webroot embed.FS

var db *gorm.DB

var params struct {
	AddToken       bool `short:"a" description:"add token"`
	AddResultToken bool `short:"r" description:"add token with result access rights"`
}

func submitHandler(c echo.Context) error {
	var v ClientVote
	c.Bind(&v)
	err := db.Transaction(func(tx *gorm.DB) error {
		var t Token
		if err := tx.First(&t, "token = ?", v.Token).Error; err != nil {
			return echo.NewHTTPError(400, "token not found")
		}
		if t.VoteTimestamp != nil {
			return echo.NewHTTPError(400, "token already used")
		}
		if !t.VoteAllowed {
			return echo.NewHTTPError(400, "token is not allowed to vote")
		}
		for categoryName, category := range config.Categories {
			votes := v.Votes[categoryName]
			if len(votes) == 0 {
				return echo.NewHTTPError(400, "empty vote category: "+categoryName)
			}
			if len(votes) != category.Images {
				return echo.NewHTTPError(400, fmt.Sprintf("invalid number of votes in category %s: expected %d got %d", categoryName, category.Images, len(votes)))
			}
			set := map[int]struct{}{}
			for score, img := range votes {
				if img < 1 || img > category.Images {
					return echo.NewHTTPError(400, fmt.Sprintf("invalid vote %d for image %d in category %s", score+1, img, categoryName))
				}
				if _, ok := set[img]; ok {
					return echo.NewHTTPError(400, fmt.Sprintf("duplicate vote for image %d in category %s", img, categoryName))
				}
				set[img] = struct{}{}
				v := &Vote{TokenID: t.ID, Category: categoryName, Image: img, Score: category.Images - score}
				if err := tx.Save(v).Error; err != nil {
					msg := fmt.Sprintf("Error saving vote %+v: %s", v, err)
					log.Print(msg)
					return echo.NewHTTPError(500, msg)
				}
			}
			now := time.Now()
			t.VoteTimestamp = &now
			if err := tx.Save(&t).Error; err != nil {
				msg := fmt.Sprintf("Error saving token %+v: %s", t, err)
				log.Print(msg)
				return echo.NewHTTPError(500, msg)
			}
		}
		return nil
	})
	if err != nil {
		return err
	}
	return c.JSON(200, map[string]string{"message": "success"})
}

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func generateSecurePassword(length int) (string, error) {
	password := make([]byte, length)
	charsetLength := big.NewInt(int64(len(charset)))
	for i := range password {
		index, err := rand.Int(rand.Reader, charsetLength)
		if err != nil {
			return "", fmt.Errorf("error generating random index: %v", err)
		}
		password[i] = charset[index.Int64()]
	}

	return string(password), nil
}

func main() {
	var err error
	loadConfig()
	db, err = gorm.Open(sqlite.Open("data/database.db"))
	if err != nil {
		log.Fatal(err)
	}
	if _, err := flags.Parse(&params); err != nil {
		if err.(*flags.Error).Type != flags.ErrHelp {
			log.Fatal(err)
		}
		return
	}
	db.Migrator().AutoMigrate(&Token{}, &Vote{})
	if params.AddToken || params.AddResultToken {
		passwd, err := generateSecurePassword(16)
		if err != nil {
			log.Fatal(err)
		}
		t := &Token{Token: passwd}
		if params.AddResultToken {
			t.ResultAllowed = true
		} else {
			t.VoteAllowed = true
		}
		if err := db.Save(t).Error; err != nil {
			log.Fatal(err)
		}
		link := ""
		if config.URL != "" {
			if params.AddResultToken {
				link = fmt.Sprintf("See results at: %s/results?token=%s\n", strings.TrimSuffix(config.URL, "/"), passwd)
			} else {
				link = fmt.Sprintf("Vote at: %s\n", config.URL)
			}
		}
		fmt.Printf("Your token: `%s`\n%s", passwd, link)
		return
	}
	e := echo.New()
	e.Use(middleware.Logger())
	root, err := fs.Sub(webroot, "webroot")
	if err != nil {
		log.Fatal(err)
	}
	e.GET("/*", echo.StaticDirectoryHandler(root, false))
	e.POST("/api/submit", submitHandler)
	e.GET("/results", printResults)
	e.Static("/config", "config")
	e.Static("/images", "images")
	initTemplates()
	err = e.Start("0.0.0.0:8000")
	if err != nil {
		log.Fatal(err)
	}
}
