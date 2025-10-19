package main

import (
	"embed"
	"html/template"
	"log"
	"sort"
	"strings"

	"github.com/labstack/echo/v4"
)

//go:embed templates/*.html
var templateRoot embed.FS

var tpl *template.Template

func initTemplates() {
	var err error
	tpl, err = template.ParseFS(templateRoot, "templates/*.html")
	if err != nil {
		log.Fatal(err)
	}
}

func printResults(c echo.Context) error {
	tokenStr := c.QueryParam("token")
	var t Token
	if err := db.First(&t, "token = ?", tokenStr).Error; err != nil {
		return echo.NewHTTPError(403, "token not found")
	}
	if !t.ResultAllowed {
		return echo.NewHTTPError(403, "not allowed to see results")
	}
	var tplParams struct {
		Categories []string
		Lines      map[string][][]int
		TokenCount int64
		TokensUsed int64
	}
	tplParams.Lines = map[string][][]int{}
	for cat := range config {
		var votes []Vote
		db.Select("image, sum(score) as score").Where("category = ?", cat).Group("image").Find(&votes)
		sort.Slice(votes, func(i, j int) bool { return votes[i].Score > votes[j].Score })
		tplParams.Categories = append(tplParams.Categories, cat)
		for _, v := range votes {
			tplParams.Lines[cat] = append(tplParams.Lines[cat], []int{v.Image, v.Score})
		}
	}
	sort.Slice(tplParams.Categories, func(i, j int) bool { return strings.Compare(tplParams.Categories[i], tplParams.Categories[j]) > 0 })
	db.Model(&Token{}).Where("vote_timestamp IS NOT NULL AND vote_allowed = 1").Count(&tplParams.TokensUsed)
	db.Model(&Token{}).Where("vote_allowed = 1").Count(&tplParams.TokenCount)
	err := tpl.Execute(c.Response(), tplParams)
	if err != nil {
		log.Print(err)
	}
	return nil
}
