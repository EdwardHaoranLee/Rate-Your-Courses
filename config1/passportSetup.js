const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStrategy = require('passport-local');
var User = require('../database/modules/user');

// passport.use(User.createStrategy());

passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {

    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {

    done(null, user);
});



// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));
// 

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
             displayName: profile.displayName,
             posted_reviews:[] 
           },function (err, user) {
            return done(err, user);
          });

        }
      });
        
    // return done(null, profile);
  }
));