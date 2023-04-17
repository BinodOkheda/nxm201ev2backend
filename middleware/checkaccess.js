

const checkAccess = (role)=>{
    return (req,res,next)=>{
          if(role.include(req.role)){
            return next()
          }else{
            res.send({msg:"you are not accessed to do this........."})
          }
    }
}


module.exports = {
    checkAccess
}