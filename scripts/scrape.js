const axios = require("axios");
const cheerio = require("cheerio");

const scrape = function() {
  return axios.get("http://www.nytimes.com").then(function(res) {
    const $ = cheerio.load(res.data);
    console.log("Getting articles now...");
    // Empty array to save article data
    const articles = [];

    // Find each element that has the ".assetWrapper" class aand then...
    $(".assetWrapper").each(function(i, element) {

      // Get the headline
      const head = $(this)
        .find("h2")
        .text()
        .trim();

      // Get the URL
      const url = $(this)
        .find("a")
        .attr("href");

      // Get the summary
      const sum = $(this)
        .find("p")
        .text()
        .trim();

      // If all of the data isn't undefined...
      if (head && sum && url) {
        // Use RegEx and trim to remove all blank spaces, tabs, and empty lines
        const headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        const sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        // Make the data object for mongo
        const dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: "https://www.nytimes.com" + url
        };

        // Push new article into articles array
        articles.push(dataToAdd);
      }
    });
    return articles;
  });
};

// Export the function
module.exports = scrape;
