var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// app.set("view engine", "ejs");

var courses = {
    'CSC265': {
        "wordcloud_path":"Wordcloud_image/CSC265.txt", 
        "score": 0.07414503502942925, 
        "top_reviews":["this course is very challanging..."]
    },
    'ECO101': {
        "wordcloud_path":"Wordcloud_image/ECO101.txt", 
        "score": 0.23414503502942925, 
        "top_reviews":["very easy hahahahah"]
    },
};
    
app.get("/", function(req, res){
    res.sendFile(__dirname+'/Jas_web/landing.html');
});

app.get("/result", function(req, res){
    res.sendFile(__dirname+'/Jas_web/result.html');
});





var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("====== SERVER STARTED!!! ======");
});