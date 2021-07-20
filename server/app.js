const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
dotenv.config({ path: "./config.env" });


require("./db/conn");   //connection to db

const PORT = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public");
const templatPath = path.join(__dirname,"../server/templates/views");
const partialPath = path.join(__dirname,"../server/templates/partials");



app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",templatPath);
hbs.registerPartials(partialPath)

//home page code here
app.get("/",(req , res) =>{
    res.render("index");
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));  
app.use(require('./routes/auth'));
const user = require("./model/userSchema"); //connection to user




//middleware
const middleware = (req , res , next)=>{
    console.log("my middleware");
    next();
}


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
app.get("/signin",(req , res) =>{
    res.send("sign App.js");
});

//Signup code here
app.get("/signup",(req , res) =>{
    res.send("hey this is register herecls");
});
//app.use(require('./routes/orderRouts'));
//console output
app.listen(PORT , ()=>{
    console.log("server running "+PORT);
});