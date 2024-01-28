// Import required modules and constants
const User = require('../models/user.model')
const {userType} = require('../utils/constants')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const configs = require('../configs/auth.config')
const constants = require('../utils/constants');

// Define the signup function
const signup = async (req, res) => {
    let userStatus = req.body.userStatus;
    if (!req.body.userStatus) {
      if (!req.body.userType || req.body.userType == constants.userTypes.customer) {
        userStatus = constants.userStatus.approved;
      } else {
        userStatus = constants.userStatus.pending;
      }
    }

    const userObj = {
        name : req.body.name,
        userId : req.body.userId,
        email : req.body.email,
        userType : req.body.userType,
        password : bcrypt.hashSync(req.body.password, 8),
        userStatus : userStatus
    };
    try{ 
        const userCreated = await User.create(userObj)
        const postResponse = {
            name : userCreated.name,
            userId : userCreated.userId,
            email : userCreated.email,
            userType : userCreated.userType,
            userStatus : userCreated.userStatus, 
            createdAt : userCreated.createdAt,
            updatedAt : userCreated.updatedAt
           
        } 
        res.status(201).send(postResponse)

    }catch(err){
        console.log("Some error while saving the use in db", err.message);
        res.status(500).send({message : "Some internal error while insterting the element"})
    }
}  



// Define the signup function
const signin = async (req,res)=>{
    const user = await User.findOne({
        userId : req.body.userId
    })
    if(!user){
        res.status(400).send({
            message : "Failed ! User doesn't exist"
        })
        return;
    }
    if(user.userStatus != "APPROVED"){
        res.status(200).send({
            message : `Can't allow to login as the use status is [${user.userStatus}]`
        })
        return;
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if(!passwordIsValid){
        return res.status(401).send({
            accessToken : null,
            message : "Invalid Password"
        })
    }
    const token = jwt.sign({ id: user.userId }, configs.secret, { expiresIn: 120 });
    res.status(200).send({
        name: user.name,
        userId: user.userId,
        accessToken: token,
        userType: user.userType
    });
}


// Export the signup function
module.exports = {
    signup,
    signin
};