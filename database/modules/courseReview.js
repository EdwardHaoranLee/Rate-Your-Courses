var mongoose = require('mongoose');

var courseReviewSchema = new mongoose.Schema({
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String,
    },
    date: Date,
    content: String,
    score1: Number,
    upvote: Number,
    downvote: Number,
});


module.exports = mongoose.model("CourseReview", courseReviewSchema);