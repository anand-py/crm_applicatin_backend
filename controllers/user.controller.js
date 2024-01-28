const User = require('../models/user.model')
const converter = require('../utils/objectConverter')

const findAll = async (req,res)=>{
    let userTypeReq = req.query.userType;
    let userStatusReq = req.query.userStatus;
    let userNameReq = req.query.name;

    var users;
    if(userNameReq){
        try{
            users = await User.find({
                userName : userNameReq
            })
        }catch(err){
            console.err('error while fetching the user for username', userNameReq)
            res.status(500).send({
                message : "Some internal error occured"
            })
        }
    }else if(userTypeReq && userStatusReq){
        try{
            users = await User.find({
                userType : userTypeReq,
                userStatus : userStatusReq
            })
        }catch(err){
            console.err(`error while fetching the user for userType [${userTypeReq}] 
            and [${userStatusReq}]`)
            res.status(500).send({
                message : "Some internal error occured"
            })
    }
    } else if(userTypeReq){
         try{
            users = await User.find({
                userType : userTypeReq
            })
        }catch(err){
            console.err(`error while fetching the user for userType [${userTypeReq}]`)
            res.status(500).send({
                message : "Some internal error occured"
            })
    }
}else if(userStatusReq){
    try{
       users = await User.find({
           userStatus : userStatusReq
       })
   }catch(err){
       console.err(`error while fetching the user for userType [${userStatusReq}]`)
       res.status(500).send({
           message : "Some internal error occured"
       })
}
}else {
    try{
        users = await User.find()
    }catch(err){
        console.err(`error while fetching the users`)
        res.status(500).send({
            message : "Some internal error occured"
        })
}
} 

return res.status(200).send(converter.userResponse(users))
}

module.exports = {
    findAll
}