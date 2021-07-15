const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min: 3
    },
    lastName:{
        type:String,
        require:true,
        min:3
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true
        
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    contactNumber: { type:String},
    profilePicture:{ type:String},
    tokens: [
        {
            token: {
                type:String,
                required:true
            }
        }
    ],
})


userSchema.pre('save' ,async function(next){
    if(this.isModified("password")){
        this.password =await bcrypt.hash(this.password,12);
    }
    next();
});

userSchema.methods.generateAuthToken = async function(){
    try{

        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;

    }catch(err){
        console.log(err);
    }
}

const User = mongoose .model("User",userSchema);
module.exports = User;