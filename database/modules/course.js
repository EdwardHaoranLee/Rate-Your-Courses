var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
    code: String,
    name: String,
    description: String,
    br_category: Number,
    score: String,
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

courseSchema.methods.getUsefulness = function(){
    var sumScore = 0;

    var totalNumber = this.course_reviews.length;
 
    if(totalNumber == 0){return "n/a"};
    this.course_reviews.forEach( review => {
        sumScore += review.useful_score;
    })
    return (sumScore / totalNumber).toFixed(1);
  };

  courseSchema.methods.getDifficulty = function(){
    var sumScore = 0;

    var totalNumber = this.course_reviews.length;

    if(totalNumber == 0){return "n/a"};
    this.course_reviews.forEach( review => {
        sumScore += review.difficulty_score;
    })
    return (sumScore / totalNumber).toFixed(1);
  };

  courseSchema.methods.getInteresting = function(){
    var sumScore = 0;

    var totalNumber = this.course_reviews.length;
  
    if(totalNumber == 0){return "n/a"};
    this.course_reviews.forEach( review => {
        sumScore += review.interesting_score;
    })
    return (sumScore / totalNumber).toFixed(1);
  };

module.exports = mongoose.model("Course", courseSchema);