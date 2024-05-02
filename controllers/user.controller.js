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
            console.log('error while fetching the user for username', userNameReq)
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
            console.log(`error while fetching the user for userType [${userTypeReq}] 
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
            console.log(`error while fetching the user for userType [${userTypeReq}]`)
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
       console.log(`error while fetching the user for userType [${userStatusReq}]`)
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

const findById = async (req, res) => {
    const userReq = req.params.userId;

    const user = await User.find({
        userId: userReq
    });

    if (user.length > 0) { // Check if user array is not empty
        res.status(200).send(converter.userResponse(user)); // Use objectConverter instead of converter
    } else {
        res.status(400).send({
            message: `user with the id [${userReq}] is not present`
        });
    }
}

const update = async (req,res)=>{
    const userReq = req.params.userId;
    try{
        const user = await User.findOneAndUpdate({
            userId : userReq
        },{
            userName : req.body.userName,
            userStatus : req.body.userStatus,
            userType : req.body.userType 
        }).exec()
        res.status(200).send({
            message : "User record has been updated successfully"
        })
    }catch(err){
        console.log("Error while updating the records", err.message)
        res.status(500).send({
            message : "Some Internal Error Occured"
        })
    }
}

module.exports = {
    findAll,
    findById,
    update
}