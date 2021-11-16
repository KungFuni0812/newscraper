const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
let NoteSchema = new Schema({
  // `title` is of type String
    title: String,
  // `body` is of type String
    body: {
      type: String,
      required: true
    },
  //article is an object that stores an article id, the ref property links the object
  //ID to the Article Model
  //this allows us to pull notes that are associated with an article
    article: {
      type: String,
      required: true
    }
});

// This creates our model from the above schema, using mongoose's model method
const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;