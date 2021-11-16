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

//setting up handlebars
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/NewScraper", { useNewUrlParser: true });

//this create the object for articles that gets pass to handlebars
async function showArticles(req, res) {
    let result = await db.Article.find({}).sort({_id: -1}).lean();
    const hbsObject = {
        articles: result
    }
    res.render("index", hbsObject);
};

//this create the object for notes that gets pass to handlebars
async function showNotes(req, res) {
    let notesResult = await db.Note.find({article: req.params.id}).sort({article: -1}).lean();
    const notesHbSobject = {
        articleId: req.params.id,
        notes: notesResult
    }
    res.render("notes", notesHbSobject)
};

//serving the handlebar
app.get("/" , function(req, res){
    showArticles(req, res);
});

// Route for grabbing a specific Article by id, displaying the notes associated with that article
app.get("/articles/:id", function(req, res) {
    showNotes(req, res);    
});

//A Get Route for scraping the reddit news website
app.get("/scrape", function(req, res){
//first, we grab the body of the HTML with axios.
    axios.get('https://old.reddit.com/r/worldnews/new').then(function(resp){
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(resp.data);
        console.log($);
        $("p.title").each(function(i, element){
            // Add the text and href of every link, and save them as properties of the result object

            let title = $(element).text();
            let link = $(element).children().attr("href");

            if(title && link){
                let objectResult= {
                    title: title,
                    link: link
                }
                console.log('objectResult:')
                console.log(objectResult)
                console.log('~~~~~~~~~~~~~')
                //send the result to the frintend
                // // Create a new Article using the `objectResult` object built from scraping
                db.Article.create(objectResult)
                    .then(function(dbArticle) {
                    // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function(err) {
                    // If an error occurred, log it
                        console.log(err);
                    });
            }
        });
        res.status(200).json({ "success": true });
    });
});

// Route for adding an Article's associated Note
app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    db.Note.insertMany({title: req.body.title, body: req.body.body, article: req.params.id})
        .then(function(result){
            res.json(result);
        });
});

// Route for deleting a notes from the article
app.delete("/notes/:id", function(req, res){
    db.Note.deleteOne({_id: req.params.id})
        .then(function(result){
            res.json(result)
        })
})

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
    });
    