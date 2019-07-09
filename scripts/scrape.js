const axios = require("axios");
const cheerio = require("cheerio");

var scrape = function() {
  return axios.get("http://www.nytimes.com").then(function(res) {
    var $ = cheerio.load(res.data);
    var articles = [];
    $("#articles").each(function(i,element) {
      var head = $(this).find("h2").text().trim();
      var URL = $(this).find("a").attr("href");
      var sum = $(this).find("p").text().trim();
      if (head && sum && URL) {
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var dataToAdd = {headline: headNeat, summary: sumNeat, URL: "https://www.nytimes.com" + URL};  
        articles.push(dataToAdd)
      }
      return articles;
    })
  });
}
module.exports = scrape;