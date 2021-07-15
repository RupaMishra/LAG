const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
dotenv.config({ path: "./config.env" });

require("./db/conn");   //connection to db

const PORT = process.env.PORT || 3000;



 const static_path = path.join(__dirname,"../public");


app.use(express.json());
app.use(require('./routes/auth'));
const user = require("./model/userSchema"); //connection to user




//middleware
const middleware = (req , res , next)=>{
    console.log("my middleware");
    next();
}


app.use(express.static(static_path));
//home page code here
app.get("/",(req , res) =>{
    res.send("hello user app.js");
});

//cart code here
app.get("/cart",(req , res) =>{
    res.send("hey its your cart value");
});

//wishlist code here
app.get("/wishlist",middleware ,(req , res) =>{
    res.send("hey this is wishlist");
});

//Login code here
app.get("/login",(req , res) =>{
    res.send("hey this is login here");
});

//Signup code here
app.get("/signup",(req , res) =>{
    res.send("hey this is register herecls");
});

//console output
app.listen(PORT , ()=>{
    console.log("server running "+PORT);
});