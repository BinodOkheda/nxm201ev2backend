const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    blagName:{
        type:String,
        required:true
    },
    caption:{
        type:String
    },
    userID:{
        type:String,
        required:true
    }
})


const Blogs = mongoose.model("blog",blogSchema);


module.exports = {
    
    Blogs

}