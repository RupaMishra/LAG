const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../SECRET_KEY')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next) => {
    if(req.user.role !== 'user'){
        return res.status(400).json({message : 'User access denied'})
    }
    next();
}