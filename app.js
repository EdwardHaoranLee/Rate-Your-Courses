var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var { google } = require('googleapis');
var cors = require('cors');
var passport = require('passport');
var cookieParser = require('cookie-parser');


var seedDB = require('./database/seed');
var Course = require('./database/modules/course');
var RedditComment = require('./database/modules/redditComment');
var CourseReview = require('./database/modules/courseReview');
var OAuth2Data = require('./google_key.json');
require('./passportSetup');

// ======= utility =========

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret:"This is a top level secret!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

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
app.get("/privacy-policy", function(req, res){
    res.render("privacyPolicy");
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
	.exec( async function (err, thisCourse) {
		if(err){
			console.log("this is not a uoft course, please try again");
			res.redirect("/");
		} else {

			thisCourse.monthly_visit++;
			await thisCourse.save();
			res.render("showCourse", {course:thisCourse});
		};
	});

});

// ====== posting comments =========
app.post("/course/:courseCode/new-review",  async function(req, res){
	var courseCode = req.params.courseCode;
	
	var response = req.body;
	var today  = new Date();
	var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	
	const currentDate = today.toLocaleDateString("en-US", dateOptions);
	
	var thisCourse = await Course.findOne({ code: courseCode });

	var reviewCreated = await CourseReview.create(
		{
			// author: req.user.displayName,
			author: "Jasmine",
			title: response.courseReviewTitle,
			content:response.courseReview,
			date: currentDate,
			useful_score: response.usefulness,
			difficulty_score: response.difficulty,
			for_br: response.br,
			upvote:0,
			downvote:0,
		});

	thisCourse.course_reviews.push(reviewCreated);
	await thisCourse.save();

	console.log("Thanks I got it");
	console.log(thisCourse.populate("course_reviews"));
    res.redirect("/course/" + courseCode);
});


// ============= AUTHENTICATION ==============

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
		console.log("yes you logged in!")
        return next();
	}
	console.log("no you dint")
    res.redirect("/login");
};


app.get("/login", function(req,res){
	res.render("login")
});

app.get('/login/failed', (req, res) => {
	res.send('You Failed to log in!')});

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/login/success', isLoggedIn, (req, res) => {
	res.send(`Welcome  ${req.user.displayName}!`)});


app.get("/login/google", passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/login/google/callback', passport.authenticate('google', { failureRedirect: '/login/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/login/success');
  }
);




var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("SERVER STARTED!!! ");
});