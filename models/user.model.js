const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:"user",
        enum:["user","moderator"]
    }
})

const Users = mongoose.model("user",userSchema)

module.exports={

    Users

}