var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var data = require('./database/data.json');


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


var data123 = {
	"CSC265":
		{
			"cloud_path":"/Wordcloud_image/CSC265.png",
			"score":"7.41",
			"top_review":[
				["For you, anything that involves human interaction","https://redd.it/985n7o"],
				["why you take all bird courses","https://redd.it/985n7o"],
				["Teach me your ways plz, will watching Ricky and Morty once be enough?","https://redd.it/985n7o"],
				["0/10 shitpost ","https://redd.it/985n7o"],
                ["This guy is legit","https://redd.it/985n7o"],
                ["take csc343 with me \n\nid love to query ur database if u kno what i mean","https://redd.it/69vvpr"],
				["Math courses in general are harder than cs courses, because it requires more abstract thinking as you take upper year math courses. As a cs specialist, I got very good mark in mat137, 223, 235 and 224.. But I decided to not go into further study in mathematics, because most of 300 level mat courses require that you have taken 257/246 or got really good mark in 237.... I would have to say mat257 is harder than any cs courses... yes including csc373...","https://redd.it/7fhhle"],
				[">  what's to stop me from enrolling in 265 (which lists 207 as a corequisite) and dropping down to 263? \n\nKicking you out of 263 again","https://redd.it/d67qnj"]]
		},
	"ABP100":
		{
			"cloud_path":"/Wordcloud_image/ABP100.png",
			"score":"-100.0",
			"top_review":[]
		},
	"MAT235":
		{
			"cloud_path":"/Wordcloud_image/MAT235.png",
			"score":"5.31",
			"top_review":[
				["nope, never felt less prepared for an exam. i havent been to a 235 lecture in months and i havent even started studying yet. also im not in MAT235.","https://redd.it/bclcqv"],
				["yeah this is basically the entire course","https://redd.it/g1b967"],
				["I'm a prof and am pretty strict about stuff but would at least have some sympathy in this situation. Just ask.","https://redd.it/e08i30"],
				["For knowing greens theorem","https://redd.it/bbva1m"],
				["[lol](https://i.imgur.com/fyX3ux2.png)","https://redd.it/8pgnuo"],
				["Welcome to mat235","https://redd.it/9fthc2"],
				["OUF","https://redd.it/ap545i"],
				["In a week PSG and Real Madrid went from being European Power houses to possibly the biggest bottle-jobs in history.\n\nIf they can do that in a week, imagine how much you can learn in that timespan.","https://redd.it/az0xn4"],
				["Prob the worst test I've written in my time at UofT.","https://redd.it/84zmzx"],
				["Lol it's crazy how badly the absolute overachievers on piazza in this course want everyone else to fail.\n\nI'm taking my CR and dabbing on these poindexters who are mad that the course average will be like a B instead of C-","https://redd.it/fqttnm"]]
		},
	"PSY100":
		{
			"cloud_path":"/Wordcloud_image/PSY100.png",
			"score":"9.45",
			"top_review":[
				["guerrilla psychology experiment","https://redd.it/fcfapo"],
				["SOCIAL EXPERIMENT GONE WRONG? LIKE + SUBSCRIBE","https://redd.it/fcfapo"],
				["This is ridiculous. They didn't even tell the profs who teach 1000+ kids there?","https://redd.it/304tl6"],
				["Only legally. Have you met some of us? Adult would be the overstatement of the year.","https://redd.it/304tl6"],
				["This is what Dolderman the PSY100 prof had to say about it from Facebook (he doesn't want people making assumptions): \n\n\nHi everybody,\nI just want to clarify what happened today, from my perspective, because I'm sure that different people would want to frame this morning's class in different ways. So I want to make my own opinion and reasoning clear.\nWhen I showed up at class this morning, there was a picket line outside the doors. There were a lot of undergraduate students gathered about waiting to go to class, and people were uncertain as to what was happening.\nIn the first couple of minutes of arriving, I received a variety of conflicting pieces of information from different people. **I was told that class was canceled and the doors were locked. I was also told that class was my decision, and the picketers would open the picket line for my class if necessary. And I was told variations of those things as well.** I had multiple people talking to me, the picket line leader and another organizing rep, a person from the administration, a police officer, and several students asking questions, and time was passing quickly. Some people were starting to wander away, and I had to make a call as to what was the right thing to do.\nIt seemed that crossing the picket line would be me being forced to make a decision that would be interpreted as an act against CUPE. But not crossing the picket line would be interpreted as a statement against the university. Regardless of my own personal feelings about the strike, and the positions of both negotiating parties, I was in a position of having to make a decision as the course instructor, that had larger implications and could be “spun” for various purposes.\nSo here is my personal reasoning, not about the overall negotiations between CUPE and the university, but about the decision of what to do this morning.\nAs a general principle, I support strikes, and the fact that they are disruptive is the way that they work. It is often necessary to cause disruption in order to change systems of power. These disruptions, however, create negative consequences for people, and these consequences must also be considered. For example, as a society we recognize there are certain “essential services” and we limit striking actions in certain ways so that essential services can be carried out. It is, obviously, always a complex situation in which you are balancing various forms of harm, to various people. So, in making a decision this morning, I had different conflicting consequences in my mind, and **sought the best balance I could find.**\nI reasoned that most of the value of today's class was that we were going to talk about mental health and psychological disorders, and explore specific strategies for helping people manage their own emotions and \"mental health\" issues more effectively. This is valuable information, and I know that many of the students who came to attend today's class were personally connected to this topic and could benefit in deep and meaningful ways from this information. **I felt a responsibility to these students to take the opportunity that we had (i.e., the 3 hours in our schedules that aligned so that we could cover this material), and use it in the best way we could.\nIn general, I feel a responsibility to also support the undergraduate students taking my classes.** I like to believe that the classes that I teach have value; they have personal value for people, and they have value in terms of students’ overall educational experience. I know that the students in my classes have complex lives as well, and it is undesirable for their education to be compromised, obviously. As I said, this situation is complex, and regardless of the position a person may take, it is objectively true that there is “harm” that results from any action that could be taken. Instructors of classes at this university are in the position of having to navigate these “harms” as sensitively as possible, and find the right balance that makes sense to them, personally.\nGiven the logistic difficulties of deciding how to hold class under the circumstances, I decided that the best compromise was to take the time that we had left, and before too many people wandered away and we lost the moment, to hold a voluntary 'teach-in' out on the field outside Con Hall.\n**This was a quick solution, one that we could implement within a few minutes, and it enabled us to have a discussion about mental health and strategies people can use to improve their experience of life.\nI want to make it clear that I reject any attempt to frame what happened today as “prof refuses to cross picket line”, or “prof refuses to cancel class”, or any other similarly simplistic framing of my decision, which then can be used rhetorically to support one ‘side’ of this dispute or another. I also reject the framing of “prof sits on the fence and won’t take a stand.” All of these frames are too simplistic and a misrepresentation of the truth.** And all are false attempts to take an idiosyncratic decision about a specific situation and claim that it represents an overall judgement or “stance” on the complex issues being negotiated between CUPE and the university administration.\nWhat happened was that I made a decision about the best way of balancing the multiple pressures and logistic constraints that were operating in the overall situation this morning. **If this decision is taken to be a political statement one way or the other, I explicitly reject that interpretation.** This decision was an idiosyncratic decision, in the moment, based on what seemed like the best way of navigating that situation for the people who would be affected. For example, there were safety concerns by the University administration about trying to hold class inside; there were time constraints based on the logistic difficulties of trying to communicate with everyone and organize ourselves one way or the other. There was the knowledge that my decision would be taken as a political statement by interested parties. There was my feelings of responsibility to support strikes. And there was my feeling of responsibility to the undergraduate students in my class. I felt that the best way, this morning, of responding to this complex array of circumstances, was to make the decision that I did.\nHaving said all that, I also want to say that, you know, I thought the discussion we had was cool, and hopefully worthwhile to the students who were there. We talked for almost 2 hours in the field, and I stayed for another 45 minutes to answer student questions, and that was, for today, our \"class\". We were able to talk about what \"mental illness\" really is, explore its implications for people's own mental health, and go over strategies and specific skills that people can learn to better regulate their thoughts, feelings, and behaviours, and in short, to help themselves cope more functionally with life.\nObviously, I won’t test the students on material that was exclusively covered in this conversation (i.e., if you missed it, too bad for you, I’m testing you anyway!! ......lol.....). Of course, if it overlaps with material from the textbook or other lectures, then it’s fair game. smile emoticon Before making final decisions about exam content, let’s see what happens with next week’s class, and what material we are able to cover.\nSo, for the students in PSY100, carry on! I will adjust the test questions if necessary, based on our ability to cover the course material, and in the upcoming days, will advise what the best way is for you to approach studying for the final exam.\nI appreciate all those students who stayed, as well as the respect of the people on the picket line and those I have spoken with in the university administration. I feel like we took the circumstances we were presented with, and navigated a respectable compromise for this morning.\nSincerely,\nDan Dolderman","https://redd.it/304tl6"],
				["From what I understand, the university locked the doors because they are cancelling meetings and classes near Simcoe Hall because of the disturbances of picketing. So the Prof (in a show of solidarity) is holding regular class class outside with the TAs. Correct me if I'm wrong guys \n\nedit: the reports about a strike themed class were incorrect. Thanks to /u/pellici for correcting me. It's just regular class but outside!","https://redd.it/304tl6"],
				["I'm not even mad. That's impressive.","https://redd.it/304tl6"],
				["Actually, UofT locked the doors. People are allowed to pass, but there's no point since you can't get in. ","https://redd.it/304tl6"],
				["Oh no, your 4.0 dropped to a 4.0, whatever will you do? /s","https://redd.it/ecf66r"],
				["The lecture is about mental health. Students aren't paying $60+ to stand in the cold and hear about the union/picket. ","https://redd.it/304tl6"]]
		},
};

// ===== CONNECT TO MONGO DB =====

var url = "mongodb://localhost/test"
mongoose.connect(url, {
        useNewUrlParser: true,
		useUnifiedTopology: true,});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("Database connected!")});
console.log(data);

// ======== ROUTING ========


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