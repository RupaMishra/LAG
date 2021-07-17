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
            console.log(token);

            res.cookie("jwtoken", token, {
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });

            if(!isMatch){

                res.json({message:"please check your credentials pass"});

            }else{
                
                res.json({message:"successfully logged in"});

            }

        }else{
            res.json({message:"please check your credentials"});
        }


    }catch(err){
        console.log(err);
    }

});

module.exports = router;
