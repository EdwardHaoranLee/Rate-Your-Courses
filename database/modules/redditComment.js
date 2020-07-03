var mongoose = require('mongoose');

var redditCommentSchema = new mongoose.Schema({
    content: String,
    url: String,
    relevant_score: Number,
    funny_score: Number,
    nonrelevant_score: Number,
});


module.exports = mongoose.model("RedditComment", redditCommentSchema);