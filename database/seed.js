// seed 用于load所有data
var mongoose = require('mongoose');
var Course = require('./modules/course');
var RedditComment = require('./modules/redditComment');
// var data = require('./data.json');

var data = 	{"ACT230":
{
	"cloud_path":"/Wordcloud_image/CSC265.png",
	"name":"Mathematics of Finance for Non-Actuaries",
	"description":"Introduction to financial mathematics, interest measurement, present value calculation, annuity valuation, loan amortization, consumer financing arrangements, bond valuation. The course is aimed at a general audience who will not be continuing in the actuarial science program. Course manuals fee: $30.",
	"br_category":"5",
	"score":"43.64873331889436",
	"heat":"809",
	"top_review":[
		["Math Major Questions","Another math major guy with no interest in math 🙃\\n\\nEdit: my advice: there are lots of interesting branches in math. Choose what you found interesting. If you don’t like math just don’t do math","https://redd.it/bkmben"],
		["I heard these are super bird courses, how easy are they?","I loved AST201. Everyone says it's bird but you need to attend the lectures to get marks for the clicker quizzes and some of the concepts can be tricky to grasp unless you put some thought into it.\\n\\nAST251, HPS200, CLA201 ","https://redd.it/6t6e0y"],
		["Math Major Questions","Just a heads up, there ain't no easy courses in math anymore. Judging by how they changed 344, they will up the difficulty of other similar \"bird\" courses to weed out those who don't have an interest in math.","https://redd.it/bkmben"],
		["Math Major Questions","I loved 309 it's very interesting and not too hard to get a good grade if you pay attention.","https://redd.it/bkmben"],
		["Choosing between courses in MAT and HMB","MAT332 is a pure graph theory course while 344 is half graph theory half combinatorics. I liked both, but if you can only take one I'd recommend 344 because I think you'd be missing out on a lot if you never learned *any* combinatorics. For me it's one of the most interesting/fun fields of math and has applications to any problem where you have to count literally anything. Also I found it easier but YMMV.","https://redd.it/8ypqp9"],
		["Going into 4th year. Need to take 5 courses per semester. Please suggest courses that are easy depending on workload. Here is the breakdown:","oh wow. GG i am screwed then. ","https://redd.it/64yuno"],
		["Math Major Questions","1. MAT315 is way eaiser than MAT309, but MAT309 is way more interesting.\\n2. MAT337 is easy provided you did well in MAT137/MAT237. If not, MAT335 is, I believe, eaiser.\\n3. APM346 is very easy if you're not in Ivrii's section.","https://redd.it/bkmben"],
		["Going into 4th year. Need to take 5 courses per semester. Please suggest courses that are easy depending on workload. Here is the breakdown:","401 isn't easy. It's really interesting, but a lot of work, even compared to 411","https://redd.it/64yuno"],
		["I heard these are super bird courses, how easy are they?","Thank you!","https://redd.it/6t6e0y"],
		["ECO305 or ACT230","looks like 305 was taken off the calendar this year, the professor who taught it last year is leaving","https://redd.it/c2mqyh"],
		["ACT230 - Difficult? Hard Questions.","I took it last year with a different prof. It was definitely a challenging course. I recommend doing the same question multiple times. ","https://redd.it/70rs7j"],
		["ACT230 - Difficult? Hard Questions.","The textbook is primarily for the students in 240 so the questions will be much tougher than what you might expect","https://redd.it/70rs7j"],
		["ACT230 - Difficult? Hard Questions.","Yea but the midterms will be new questions right? Like the prof won't put the same/similar questions from the textbook on the midterm right?","https://redd.it/70rs7j"],
		["ACT230 - Difficult? Hard Questions.","Actually the professor I had used quite similar questions from the Broverman textbook. Even if you don't understand the problem completely, try to do the question repeatedly so that you develop a \"feel\" for how the question can be solved. Similar questions nontheless quite challenging.","https://redd.it/70rs7j"],
		["ACT230 - Difficult? Hard Questions.","Who was your prof?","https://redd.it/70rs7j"],
		["ACT230 - Difficult? Hard Questions.","Professor Dameng Tang","https://redd.it/70rs7j"],
		["Thoughts on ACT230?","Don't underestimate it, it's just as difficult as 240. Took it in the fall and the class avg was a C- or D+ if I recall  ","https://redd.it/6a6eqx"],
		["Thoughts on ACT230?","Sorry can you please elaborate? I don't know what 240 is I am a cs student and that's why I wanted to take 230 because it was for non-actuarial science students.","https://redd.it/6a6eqx"],
		["Thoughts on ACT230?","###ACT230 - Mathematics of Finance for Non-Actuaries :\\n\\nIntroduction to financial mathematics, interest measurement, present value calculation, annuity valuation, loan amortization, consumer financing arrangements, bond valuation. The course is aimed at a general audience who will not be continuing in the actuarial science program.\\n\\n[**Source Code**](https://github.com/zuhayrx/coursebot)","https://redd.it/6a6eqx"],
		["Thoughts on ACT230?","If you're familiar with mathematical finance already, you might not have as much of a problem. Personally I underestimated the course and didn't put enough time as I should've to really understand even the most basic concepts, and I think others in the class felt the same. Hopefully you don't end up with Badescu, he's a hard tester.","https://redd.it/6a6eqx"]]
}}



async function seedDB(){
    // 清空全部course 
    await RedditComment.deleteMany({});
    console.log("All comments removed from Database!");
    await Course.deleteMany({});
    console.log("All courses removed from Database!");


    
    for (var courseKey in data){
        let course = await Course.create(

            {
                code: courseKey,
                name: data[courseKey].name,
                description:data[courseKey].description,
                br_category: data[courseKey].br_category,
                score: data[courseKey].score,
                heat:data[courseKey].heat,
                word_cloud: data[courseKey].cloud_path,
                monthly_visit: 0,
                is_offered_now: true,
                reddit_comments:[],
                course_reviews: []
            }
        );
        console.log("course:【" + course.code + "】loadeded!");
        for(var comment of data[courseKey].top_review ){

            let commentCreated = await RedditComment.create(
                {   
                    title:comment[0],
                    content:comment[1],
                    url:comment[2],
                    relevant_score:0,
                    funny_score:0,
                    nonrelevant_score:0
                });
            course.reddit_comments.push(commentCreated);
 
        };

        course.save();


    };
}

module.exports = seedDB;