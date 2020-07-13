// seed 用于load所有data
var mongoose = require('mongoose');
var Course = require('./modules/course');
var RedditComment = require('./modules/redditComment');
var User = require('./modules/user');
var User = require('./modules/user');
var data = require('./database.json');

async function seedDB(){


    // for (var courseKey in data){
    //     var thisCourse = await Course.findOne({ code: courseKey });
    //     if (!thisCourse){
    //         console.log("Found new course:" + courseKey);
    //         try{
    //             let course = await Course.create(
    //                 {
    //                     code: courseKey,
    //                     name: data[courseKey].name,
    //                     description:data[courseKey].description,
    //                     br_category: data[courseKey].br_category,
    //                     score: data[courseKey].score,
    //                     heat:data[courseKey].heat,
    //                     word_cloud: data[courseKey].cloud_path,
    //                     monthly_visit: 0,
    //                     is_offered_now: true,
    //                     reddit_comments:[],
    //                     course_reviews: []
    //                 }
    //             );
    //             // console.log("course:【" + course.code + "】loadeded!");
    //             for(var comment of data[courseKey].top_review ){
        
    //                 let commentCreated = await RedditComment.create(
    //                     {   
    //                         title:comment[0],
    //                         content:comment[1],
    //                         url:comment[2],
    //                         relevant_score:0,
    //                         funny_score:0,
    //                         nonrelevant_score:0
    //                     });
    //                 course.reddit_comments.push(commentCreated);
         
    //             };
        
    //             course.save();                

    //         }catch(e){
    //             console.log("Fail to load course: " + courseKey );
    //         }
        
    //     }
 ;

   
    // var userAdmin= await User.findById("5f0c03fcec1668079271bdb3").populate("RedditComment");
    // // var oneVote = userJasmine.voted_reddit[0];
    // userAdmin.voted_reddit.forEach( async function(oneVote) {
    //     await RedditComment.findOneAndDelete({_id: oneVote._id}, (err, response)=>{
    //         if(err){
    //             console.log(err);
    //         }else{
    //             console.log("successfully remove this reddit comment:" +  oneVote._id);
    //         };
    //     })
    //     var thisCourse = await Course.updateOne(
    //         { "reddit_comments": oneVote._id },
    //         { "$pull": { "reddit_comments": oneVote._id } }).then(course => {
    //             // console.log("sucessfully delete a comment from: " + course);
                
    //         },err => {
    //             console.log("Fail to delete comment from course:  " + oneVote._id);
    //         })
             

    // });

;



    
}

module.exports = seedDB;