const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../database/modules/user');

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "749281041176-lk4mg3p4d298u7olu6j3cuj3ao6mbd8q.apps.googleusercontent.com",
    clientSecret: "_ZkW3HLR_o3cEobBHFytoIwx",
    callbackURL: "http://localhost:3000/login/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    
    User.findOne({googleId: profile.id}).then((currentUser)=>{
      if(currentUser){
        console.log("existing user");
        
        //if we already have a record with the given profile ID
        done(null, currentUser);
      } else{
            console.log("new user");
           User.create({
             googleId:profile.id,
             username: profile.displayName,
             posted_reviews:[] 
           },function (err, user) {
            return done(err, user);
          });

        }
      });
        
    // return done(null, profile);
  }
));