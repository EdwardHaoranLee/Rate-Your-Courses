var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
    code: String,
    name: String,
    description: String,
    br_category: Number,
    score: Number,
    // score2: Number,
    word_cloud: String,
    monthly_visit: Number,
    heat:Number,
    is_offered_now: Boolean,
    reddit_comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RedditComment",
        }
    ],
    course_reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseReview",
        }
    ]
});


module.exports = mongoose.model("Course", courseSchema);