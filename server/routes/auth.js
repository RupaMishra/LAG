const { request, json } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const hbs = require("hbs");
const app = express();
require("../db/conn");
const static_path = path.join(__dirname,"../public");
const templatPath = path.join(__dirname,"../server/templates/views");
const partialPath = path.join(__dirname,"../server/templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));



const User = require("../model/userSchema");


router.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",templatPath);
hbs.registerPartials(partialPath);
//home page code here
router.get("/",(req , res) =>{
    res.render("index");
});

router.get("/signin",(req , res) =>{
    res.render("signin");
});

//registration page code here
router.post("/register",async (req,res) => {

    //create variables for feilds
    const {firstName,lastName,email,password} = req.body

    //check empty credentials
    if(!firstName || !email || !password){
        res.status(422).json({error: "please fill all the field"})
    }

    try{

        const userExist = await User.findOne({email:email})     //check if user exist
        
        if(userExist){
            return res.status(422).json({error:"user already exists with that email"})
        }
        else{
            const user = new User({firstName,lastName,email,password});     //create current user

            await user.save();

            res.status(201).json({message:"user registerd successfully"});

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
