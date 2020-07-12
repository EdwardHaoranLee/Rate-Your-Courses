var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
// var { google } = require('googleapis');
var cors = require('cors');
var passport = require('passport');

var cookieParser = require('cookie-parser');


var seedDB = require('./database/seed');
var Course = require('./database/modules/course');
var User = require('./database/modules/user');
var RedditComment = require('./database/modules/redditComment');
var CourseReview = require('./database/modules/courseReview');
var OAuth2Data = require('./config1/google_key.json');
require('./config1/passportSetup');



// ===== CONNECT TO MONGO DB =====

// var url = "mongodb://localhost/rateyourcourses"
// var url = "mongodb+srv://admin:admin@cluster0.1cbyy.mongodb.net/ratemycourses?retryWrites=true&w=majority";
var url = "mongodb+srv://admin:admin@cluster0.1cbyy.mongodb.net/rateyourcourses100?retryWrites=true&w=majority";

mongoose.connect(url, {
        useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("Database connected!")});

// ======= utility =========

app.use(cors());
// app.use(cookieParser());
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
// passportSetup();
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//========== state variables ============
app.locals.userLocation = '';
app.locals.br= '';
app.locals.sortby= '';

// =======  DANGEROUS ZONE  ==========
// seedDB();
// =======  DANGEROUS ZONE  ==========


// ======= LOAD USER INFO ===
app.use(function(req, res, next){
	// 全部多pass一个currentUSer的parameter
	res.locals.courseSearchError = '';
	if (req.user){
		res.locals.currentUser = req.user;

		// User.findById(req.user._id).exec(function (err, user){


		// });
		
	} else{



	}

    next();
});


// ======== ROUTING ========


app.get("/", function(req, res){

    res.render("index",{err: ''});
});


app.get("/courses", async function(req, res){
	if(req.query.br){app.locals.br = req.query.br};
	if(req.query.sortby){app.locals.sortby = req.query.sortby};




	var filteredList = await Course
	.find(app.locals.br ? {br_category:app.locals.br} : {} )
	.sort(app.locals.sortby ? 
		(app.locals.sortby == "code"? app.locals.sortby:'-'+app.locals.sortby)
		:
		'heat');

	res.render("allCourses", {courseList: filteredList});

	// res.render("allCourses", {courseList: []});	


});

app.get("/about", function(req, res){
    res.render("about");
    // res.redirect("/");
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
	Course.findOne({ code: courseCode })
	.populate("reddit_comments")
	.populate("course_reviews")
	.exec( async function (err, thisCourse) {
		if(!thisCourse){

			// res.redirect("/", );
		
			res.render("index", {err: "this is not a UofT course, please try again" })
		} else {
			thisCourse.monthly_visit++;
			await thisCourse.save();
			req.app.locals.userLocation = '/course/' + courseCode;

			if (req.user){

				var thisUser = await User.findById(req.user._id).populate({
					path: 'voted_reddit',
					populate: { path: 'vote_comment' }
				});

				var likedList = thisUser.voted_reddit.filter(vote => {
					return thisCourse.reddit_comments.indexOf(vote.vote_comment) != -1;
					// return thisCourse.reddit_comments.include(vote.vote_comment);
				})

				console.log(likedList)

				res.render("showCourse", {course:thisCourse,likedList: likedList});
			// res.render("showCourse", {course:thisCourse});

			} else

			res.render("showCourse", {course:thisCourse});
		};
	});

});

// ====== posting comments =========
app.post("/course/:courseCode/new-review", isLoggedIn,  async function(req, res){
	

	var courseCode = req.params.courseCode;
	
	var response = req.body;
	var today  = new Date();
	var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	
	const currentDate = today.toLocaleDateString("en-US", dateOptions);
	
	var thisCourse = await Course.findOne({ code: courseCode });
	// var isAnonymous = response.isAnonymous

	var reviewCreated = await CourseReview.create(
		{
			author: req.user.username,
			course:courseCode,
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

	thisUser = await User.findById(req.user._id);
	thisUser.posted_reviews.push(reviewCreated);
	await thisUser.save();

	console.log("Thanks I got it");
    res.redirect("/course/" + courseCode);
});


// ======= LIke a reddit post ======
app.post("/:commentId/reddit/report",isLoggedIn, async function (req, res) {

	var thisComment = await RedditComment.findById(req.params.commentId);
	console.log("this comment is " + thisComment);
	var thisUser = await User.findById(req.user._id).populate("voted_reddit");
	await thisUser.voted_reddit.push(thisComment);
	await thisUser.save();

	console.log('what is this???' + req.body.isRelevant);
	if (req.body.isRelevant){
		thisComment.relevant_score ++;
	} else{
		thisComment.nonrelevant_score ++;
	}
	await thisComment.save();


	res.redirect(req.app.locals.userLocation);

//         // check if req.user._id exists in foundCampground.likes
//         var foundUserLike = foundCampground.likes.some(function (like) {
//             return like.equals(req.user._id);
//         });

//         if (foundUserLike) {
//             // user already liked, removing like
//             foundCampground.likes.pull(req.user._id);
//         } else {
//             // adding the new user like
//             foundCampground.likes.push(req.user);
//         }

//         foundCampground.save(function (err) {
//             if (err) {
//                 console.log(err);
//                 return res.redirect("/campgrounds");
//             }
//             return res.redirect("/campgrounds/" + foundCampground._id);
//         });
//     });
});


// ============= AUTHENTICATION ==============

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
	}
	console.log("no you dint");

    res.redirect("/login");
};

app.get("/register", function(req, res){
    res.render("register", {err: ''}); 
 });

app.post("/register", function(req, res){
    // 新user object只装有username
    var newUser = new User({
		username: req.body.username,
		displayName: req.body.displayName,
		posted_reviews: [],
		voted_reddit:[],
	});
	console.log(newUser);
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            res.render("register",{err: err});
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/login/success"); 
        });
    });
});


app.get("/login", function(req,res){
	res.render("login", {err: ""});
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/courses");

});

app.get('/login/failed', (req, res) => {

	res.render("login", {err:"Log in fail, please try again."});
});

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/login/success', isLoggedIn, (req, res) => {

	console.log(req.user);
	res.redirect( req.app.locals.userLocation || '/');

});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/login/success",
        failureRedirect: "/login/failed"
    }), function(req, res){
});



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