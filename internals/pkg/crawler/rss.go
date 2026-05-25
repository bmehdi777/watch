package crawler

import (
	"encoding/xml"
)

type RSSFeed struct {
	Name    xml.Name   `xml:"rss"`
	Version string     `xml:"version,attr"`
	Channel RSSChannel `xml:"channel"`
}

type RSSChannel struct {
	Title         string    `xml:"title"`
	Link          string    `xml:"link"`
	Description   string    `xml:"description"`
	Language      string    `xml:"language"`
	LastBuildDate string    `xml:"pubDate"`
	Items         []RSSItem `xml:"item"`
}

type RSSItem struct {
	Title         string `xml:"title"`
	Link          string `xml:"link"`
	Description   string `xml:"description"`
	Content       string `xml:"encoded"`
	PublishedDate string `xml:"pubDate"`
	Guid          string `xml:"guid"`
}

func parseRSS(content []byte) (*RSSFeed, error) {
	var feed RSSFeed
	if err := xml.Unmarshal(content, &feed); err != nil {
		return nil, err
	}

	return &feed, nil
}
