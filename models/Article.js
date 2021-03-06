const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
let ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true,
        unique: true
    },
    // `link` is required and of type String
    link: {
        type: String,
        required: true,
        unique: true
    },

});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
