const jwt = require("jsonwebtoken");
const { Users } = require("../models/user.model");
require("dotenv").config()

const authUser= async (req,res,next)=>{

    try {
        const token = headers.Authorisation.split(" ")[1];

        const isBlacklisted = await Blacklist({token})

        if(isBlacklisted){
           return res.status(401).send({msg:"please login......."})
        }

        const decoded = jwt.verify(token,process.env.accesstoken)

        if(!decoded){
            return res.status(401).send({msg:"please login first....."})
        }
        req.body.userID=decoded.userID;
        const user = await Users.findOne({_id:decoded.userID})
        req.role=user.role
       
        return next();


    } catch (error) {
        res.send({msg:error.message})
    }

}


module.exports={
    authUser
}