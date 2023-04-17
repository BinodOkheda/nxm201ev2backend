const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user.route");
const { blogRouter } = require("./routes/blog.route");
require("dotenv").config()
app.use(express.json())


app.use("/user",userRouter)
app.use("/blog",blogRouter)



app.listen(process.env.port,async ()=>{

    try {
        await mongoose.connect(process.env.mongoURL)
        console.log("connected to DB")
    } catch (error) {
        console.log(error.message)
    }

    console.log(`server is running at ${process.env.port}`)
})