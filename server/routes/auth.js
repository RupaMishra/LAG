const { request, json } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const hbs = require("hbs");
const app = express();
const cookieSession = require("cookie-session");
const passport = require("passport");
const facebookStrategy = require('passport-facebook').Strategy


//const requireLogin = require("../middleware/requireLogin");
require("../db/conn");
require('./passport_setup.js'); 

//path for all the views
const static_path = path.join(__dirname,"../public");
const templatPath = path.join(__dirname,"../server/templates/views");
const partialPath = path.join(__dirname,"../server/templates/partials");

const User = require("../model/userSchema");

router.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",templatPath);
hbs.registerPartials(partialPath);

//UI Code here
//home page code here
router.get("/",(req , res) =>{
    res.render("index");
});

router.get("/signin",(req , res) =>{
    res.render("signin");
});

router.get("/register",(req , res) =>{
    res.render("register");
});


//google login here
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }));

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

app.get('/failed', (req, res) => res.send('You Failed to log in!'))

app.get('/good', isLoggedIn, (req, res) =>{
    res.render("index");
})

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
//logout here


//facebook login here
app.use(passport.initialize());
    app.use(passport.session()); 

passport.use(new facebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : "603496006962121",
    clientSecret    : "c63a6f6f8189ed75b5958b2c0c0e7341",
    callbackURL     : "http://localhost:5000/facebook/callback",
    profileFields   : ['id','displayName','name','gender','picture.type(large)','email']

},// facebook will send back the token and profile
function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their facebook id
        User.findOne({ "email":email }, function(err, user) {

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

}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    return done(null,user)
});

app.get('/profile',(req,res) => {
    res.send("you are authenticated")
})

app.get("/auth/facebook", passport.authenticate('facebook', { scope : 'email,user_photos' }));

app.get('/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
//save values here
//registration page code here
router.post("/register",async (req,res) => {
    //create variables of feilds
    const {firstName,lastName,email,password} = req.body;

    try{

        const userExist = await User.findOne({email:email})     //check if user exist
        
        if(userExist){
            return res.status(422).json({error:"user already exists with that email"})
        }
        else{
            const user = new User({firstName,lastName,email,password});     //create current user

            const done = await user.save();

            if(done){
                res.render("index");
            }else{
                res.render("signin");
            }

        }

    }catch(err){
        console.log(err);
    }


});


//login page code here
router.post("/signin",async (req,res) => {

    try{

        let token;
        const {email,password} = req.body;

        //check empty feilds
        if(!email || !password){
            res.status(422).json({error: "please fill all the field"})
        }

        const userLogin = await User.findOne({email:email});        //my current user

        if(userLogin){

            const isMatch = await bcrypt.compare(password, userLogin.password);      //authencticating password

            token = await userLogin.generateAuthToken();
            

            res.cookie("jwtoken", token, {
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });

            if(!isMatch){

                res.json({message:"please check your credentials pass"});

            }else{
                
                res.render("index");

            }

        }else{
            res.json({message:"please check your credentials"});
        }


    }catch(err){
        console.log(err);
    }

});


module.exports = router;
