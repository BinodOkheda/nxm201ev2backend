const express = require("express");
const { Users } = require("../models/user.model");
const {Blacklist} = require("../models/blacklist.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express();
require("dotenv").config()
app.use(express.json());

const userRouter = express.Router();


userRouter.post("/register",async (req,res)=>{
    try {
        const {name,email,password,role} = req.body

        const isUserExist = await Users.findOne({email});
        if(isUserExist){
            return res.send({msg:"user already exist in the database try with new email"})
        }

        const hash = bcrypt.hashSync(password,8)
        const user = new Users({name,email,password:hash, role})
        await user.save()

      res.send({msg:"user has been registered successfully"})
        
    } catch (error) {
        res.send({msg:error.msg})
    }
})
userRouter.post("/login",async (req,res)=>{

    try {
        const {email,password}= req.body
        const isUserExist = await Users.findOne({email})
        if(!isUserExist){
            return res.status(401).send({msg:"invalid username or password"})
        }
        var result=bcrypt.compareSync(password, isUserExist.password)
        if(!result){
            return res.status(401).send({msg:"invalid username or password"})
        }

        const Accesstoken = jwt.sign({userID:isUserExist._id},process.env.accesstoken,{
            expiresIn:"1m"
        })
        const Refreshtoken = jwt.sign({userID:isUserExist._id},process.env.refreshtoken,{
            expiresIn:"3m"
        })

        res.send({msg:"login successfull",Accesstoken,Refreshtoken})
    } catch (error) {
        res.send({msg:error.msg})
    }



})


userRouter.post("/logout",async (req,res)=>{
// we wil get the accesstoken and refreshtoken in req.headers with the respective name;
    try {
        const accesstoken = headers.Accesstoken
        const blackAccess = new Blacklist({token:accesstoken});
        await blackAccess.save()


        const refreshtoken = headers.Refreshtoken
        const blackRefresh = new Blacklist({token:refreshtoken});
        await blackRefresh.save()

        res.send({msg:"logout successfull....."})

    } catch (error) {
        res.send({msg:error.msg})
    }
})


userRouter.get("/refresh-token",async (req,res)=>{
    try {
        const token = headers.Refreshtoken
        const isBlacklisted = await Blacklist({token})

        if(isBlacklisted){
           return res.status(401).send({msg:"please login......."})
        }

        const decoded = jwt.verify(token,process.env.refreshtoken)
        if(!decoded){
            return res.status(401).send({msg:"please login......."})
        }

        const accesstoken = jwt.sign({userID:decoded._id},process.env.accesstoken)

        res.send({accesstoken})
        
    } catch (error) {
        res.send({msg:error.msg})
    }
})








module.exports={
    userRouter
}