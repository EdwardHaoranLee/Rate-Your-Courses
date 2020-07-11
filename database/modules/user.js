var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    googleId:String,
    username: String,
	displayName: String,
    password: String,
    posted_reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseReview",
        }
    ],
    voted_reddit: [
        {
            is_relevant: Boolean,
            vote_comment:        
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "RedditComment",
                }
            
        }
    ]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);