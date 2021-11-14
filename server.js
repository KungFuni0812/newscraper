//all the modules we are requiring to use

const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");
// Setting up Port
const PORT = 3000;

// Initialize Express
const app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/NewScrapper", { useNewUrlParser: true });

//routes

//A Get Route for scraping the reddit news website
app.get("/scrape", function (req, res){
//first, we grab the body of the HTML with axios.
    axios.get('https://old.reddit.com/r/webdev').then(function(resp){
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(resp.data);
        // Save an empty result object
        let results =[];
        
        $("p.title").each(function(i, element){
            // Add the text and href of every link, and save them as properties of the result object
            let title = $(element).text();
            let link = $(element).children().attr("href");

            results.push({
                    title: title,
                    link: link
                });

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
            .then(function(dbArticle) {
            // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, log it
                console.log(err);
            });
        });

        console.log(results);
    });
});































// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
    });
    