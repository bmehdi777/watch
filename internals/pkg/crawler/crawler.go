package crawler

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"watch/internals/pkg/models"

	"gorm.io/gorm"
)

func scrap(db *gorm.DB) {
	log.Println("Begining scrapping RSS...")
	var sources []models.SourceModel

	tx := db.Find(&sources, "enabled = ?", 1)
	if tx.Error != nil {
		log.Fatalln("An error occured while getting enabled sources : ", tx.Error.Error())
		return
	}

	feeds := make([]*RSSFeed, 0)
	for _, src := range sources {
		content, err := fetchSource(src.RSSUrl)
		if err != nil {
			log.Printf("Skipping %s : an error occured while fetching rss : %s", src.RSSUrl, err.Error())
			return
		}

		feed, err := parseRSS(content)
		if err != nil {
			log.Printf("Skipping %s : an error occured while parsing rss : %s", src.RSSUrl, err.Error())
		}

		feeds = append(feeds, feed)
	}

	for _, feed := range feeds {
		for _, item := range feed.Channel.Items {
			err := createArticle(db, item)
			if err != nil {
				log.Printf("Skipping following article %s : an error occured while creating article in database : %s", item.Title, err.Error())
			}
		}
	}

	log.Println("Ending scrapping rss")
}

func fetchSource(srcUrl string) ([]byte, error) {
	resp, err := http.Get(srcUrl)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	return body, nil
}

func createArticle(db *gorm.DB, item RSSItem) error {
	article := models.ArticleModel{
		Title:         item.Title,
		Link:          item.Link,
		Content:       item.Content,
		Description:   item.Description,
		PublishedDate: item.PublishedDate,
		Guid:          item.Guid,
	}

	fmt.Println("content", item.Content)

	tx := db.Where(models.ArticleModel{Guid: item.Guid}).FirstOrCreate(&article)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}
