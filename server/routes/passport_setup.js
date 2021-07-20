const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const express = require("express");
const router = express.Router();

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
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.CALLBACK_URL,
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {

      // find the user in the database based on their facebook id
      const new_email = profile.email;
      User.findOne({new_email:email }, function(err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
              return done(err);

          // if the user is found, then log them in
          if (user) {
              console.log("user found")
              console.log(user)
              return done(null, user); // user found, return that user
          } else {
              // if there is no user found with that facebook id, create them
              var newUser = new User();

              // set all of the facebook information in our user model                
              newUser.token = token; // we will save the token that facebook provides to the user                    
              newUser.firstName  = profile.name.givenName; // look at the passport user profile to see how names are returned
              newUser.lastname =  profile.name.familyName;
              newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
              //newUser.gender = profile.gender
              //newUser.pic = profile.photos[0].value
              // save our user to the database
              newUser.save(function(err) {
                  if (err)
                      throw err;
                  else{
                      console.log("done");
                  }

                  // if successful, return the new user
                  return done(null, newUser);
              });
          }

      });

  })

  }
));


module.exports = router;
