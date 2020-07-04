// seed 用于load所有data
var mongoose = require('mongoose');
var Course = require('./modules/course');
var RedditComment = require('./modules/redditComment');
var data = require('./data.json');

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
                name: "Data Structures and Analysis",
                description:"Algorithm analysis: worst-case, average-case, and amortized complexity. Expected worst-case complexity, randomized quicksort and selection.",
                br_category: 5,
                score: data[courseKey].score,
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
                    content:comment[0],
                    url:comment[1],
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