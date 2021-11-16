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

//routes
async function showArticles(req, res) {
    let result = await db.Article.find({}).sort({_id: -1}).lean();
    const hbsObject = {
        articles: result
    }
    res.render("index", hbsObject);
}

//serving the handlebar
app.get("/" , function(req, res){
    showArticles(req, res);
});

//A Get Route for scraping the reddit news website
app.get("/scrape", function (req, res){
//first, we grab the body of the HTML with axios.
    axios.get('https://old.reddit.com/r/worldnews/new').then(function(resp){
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(resp.data);

        let ObjectResultArray=[]
        $("p.title").each(function(i, element){
            // Add the text and href of every link, and save them as properties of the result object

            let title = $(element).text();
            let link = $(element).children().attr("href");

            if(title && link){
                let objectResult= {
                    title: title,
                    link: link
                }
                
                ObjectResultArray.push(objectResult)
                //send the result to the frontend
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
        res.json(ObjectResultArray); 
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // TODO
    console.log(req.params.id);
    // ====
    // Finish the route so it finds one article using the req.params.id,
    db.Article.findOne({_id: req.params.id})
    // and run the populate method with "note",
    .populate("note")
    // then responds with the article with the note included
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
    
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    db.Note.insertMany({title: req.body.title, body: req.body.body})
    .then(function(dbNote){
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Article.updateOne({_id: req.params.id}, { $set: { "note": dbNote[0]._id }})
        .then(function(result){
        res.json(result);
        });
    })
    .catch(function(err){
    res.json(err);
    })

});


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
    });
    