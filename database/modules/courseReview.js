var mongoose = require('mongoose');

var courseReviewSchema = new mongoose.Schema({
    // author:{
    //     id:{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref:"User"
    //     },
    //     username: String,
    // },
    author: String,
    course: String,
    date: String,
    title: String,
    content: String,
    useful_score: Number,
    difficulty_score: Number,
    for_br: Boolean,
    upvote: Number,
    downvote: Number,
});


module.exports = mongoose.model("CourseReview", courseReviewSchema);