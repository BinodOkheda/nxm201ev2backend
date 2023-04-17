const express = require("express");
const { authUser } = require("../middleware/auth");
const {checkAccess} = require("../middleware/checkaccess")
const { Blogs } = require("../models/blogs.model");
const app = express();
app.use(express.json());
const blogRouter = express.Router();
require("dotenv").config()


// An authenticated user should be able to create a blog
blogRouter.post("/",authUser,async (req,res)=>{

    try {
        const {blogName, caption } = req.body;
        const token = headers.Authorisation.split(" ")[1];
        const decoded = jwt.verify(token,process.env.accesstoken)

        const blog = new Blogs({blogName,caption,userID:decoded.userID})
        await blog.save()

        res.send({msg:"blog has been posted..."})


    } catch (error) {
        res.send({msg:error.message})
    }

})


// All authenticated users should be able to read all blogs
blogRouter.get("/",authUser,async (req,res)=>{
    try {
        
        const blogs = await Blogs.find();
        res.send(blogs)

    } catch (error) {
        res.send({msg:error.message})
    }

})

// Establish relationship so that an authenticated user should be able to update or delete only their blog
blogRouter.patch("/:id",authUser,async (req,res)=>{
    try {
        const {id}= req.params
        const token = headers.Authorisation.split(" ")[1];
        const decoded = jwt.verify(token,process.env.accesstoken)

        const blog = await Blogs.findOne({_id:id})

        if(blog.userID!==decoded.userID){
            return res.status(404).send({msg:"you are not authorized...."})
        }else{
            await Blogs.findOneAndUpdate({_id:id},req.body);

            res.send({msg:"blog has been updated......"})
        }


    } catch (error) {
        res.send({msg:error.message})
    }


})



blogRouter.delete("/:id",authUser,async (req,res)=>{
    try {
        const {id}= req.params
        const token = headers.Authorisation.split(" ")[1];
        const decoded = jwt.verify(token,process.env.accesstoken)

        const blog = await Blogs.findOne({_id:id})

        if(blog.userID!==decoded.userID){
            return res.status(404).send({msg:"you are not authorized...."})
        }else{
            await Blogs.findOneAndDelete({_id:id});

            res.send({msg:"blog has been deleted....."})
        }


    } catch (error) {
        res.send({msg:error.message})
    }
})



// An authenticated moderator should be able to remove/delete any blog.
// Moderator should be able to delete any blog (you can have a separate endpoint for this)

blogRouter.delete("/moderator/:id",authUser,checkAccess(["moderator"]),async ( req,res)=>{
  
    try {
        const {id}= req.params
        await Blogs.findOneAndDelete({_id:id});

            res.send({msg:"blog has been deleted....."})
    } catch (error) {
        res.send({msg:error.message})
    }

})


module.exports={

    blogRouter

}