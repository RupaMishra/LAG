const jwt = require("jsonwebtoken");
const user  = require("../model/userSchema");

const authenticate = async (req, res, next) => {

    try{

        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await user.findOne({_id:verifyToken._id,"tokens:token": token });

        if(!rootUser){ throw new Error("user not Found")}

        req.token = token ;
        req.rootUser = rootUser;
        req.userId = rootUser._id;
        

    }catch(err){
        res.status(401).send("required login");
        console.log(err);
    }

}