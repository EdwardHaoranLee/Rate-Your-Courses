var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var data = require('./database/data.json');
var seedDB = require('./database/seed');

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

// ===== INITIALIZING DATABASE =====



// ======== ROUTING ========
seedDB();

app.get("/", function(req, res){
    res.render("index");
});
app.get("/courses", function(req, res){
    res.render("allCourses");
});
app.get("/search", function(req, res){
    var courseCode = req.query.enteredCourse.toUpperCase();
    if (courseCode){
        res.redirect("/course/" + courseCode);
    }
});



app.get("/course/:courseCode", function(req, res){
    var courseCode = req.params.courseCode;
    var thisCourse = data[courseCode];
    if(!thisCourse){
		console.log("this is not a uoft course, please try again");
		res.redirect("/");
    } else {
        console.log(thisCourse);
        res.render("showCourse", {thisCourse:thisCourse, courseCode:courseCode});
    };
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("SERVER STARTED!!! ");
});