// seed 用于load所有data
var mongoose = require('mongoose');
var Course = require('./modules/course');
var RedditComment = require('./modules/redditComment');
var data = require('./database(3).json');

async function seedDB(){
    // 清空全部course 
    // await RedditComment.deleteMany({});
    // console.log("All comments removed from Database!");
    // await Course.deleteMany({});
    // console.log("All courses removed from Database!");


    
    for (var courseKey in data){
        var thisCourse = await Course.findOne({ code: courseKey });
        if (!thisCourse){

            try{
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
                // console.log("course:【" + course.code + "】loadeded!");
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

            }catch(e){
                console.log("Fail to load course: " + courseKey );
            }
        
        }



    };
}

module.exports = seedDB;