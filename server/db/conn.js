const mongoose = require("mongoose");
const DB = process.env.DATABASE;

//mongoose here
mongoose.connect(DB,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify : false
}).then(() => {
    console.log("connection done");
}).catch((err) => {
    console.log("connection not setup");
});