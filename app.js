var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var seedDB = require('./database/seed');
var Course = require('./database/modules/course');
var RedditComment = require('./database/modules/redditComment');
var CourseReviewComment = require('./database/modules/courseReview');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));




// ===== CONNECT TO MONGO DB =====

// var url = "mongodb://localhost/rateyourcourses"
var url = "mongodb+srv://admin:admin@cluster0.1cbyy.mongodb.net/ratemycourses?retryWrites=true&w=majority";


mongoose.connect(url, {
        useNewUrlParser: true,
		useUnifiedTopology: true,});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("Database connected!")});


// =======  DANGEROUS ZONE  ==========
// seedDB();
// =======  DANGEROUS ZONE  ==========


// ======== ROUTING ========


app.get("/", function(req, res){
    res.render("index");
});
app.get("/courses", function(req, res){
	Course.find().sort('code').exec((err,courseList) => {
		if(err){
			console.log(err);
		} else{
			res.render("allCourses",{courseList: courseList});
		}
	})
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/search", function(req, res){
    var courseCode = req.query.enteredCourse.toUpperCase();
    if (courseCode){
        res.redirect("/course/" + courseCode);
    }else {
		res.redirect("/");
	}
});

app.get("/course/:courseCode", function(req, res){
    var courseCode = req.params.courseCode;
	// var thisCourse = data[courseCode];
	Course.findOne({ code: courseCode })
	.populate("reddit_comments")
	.populate("course_reviews")
	.exec(function (err, thisCourse) {
		if(err){
			console.log("this is not a uoft course, please try again");
			res.redirect("/");
		} else {
			res.render("showCourse", {course:thisCourse});
		};
	});

});


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("SERVER STARTED!!! ");
});