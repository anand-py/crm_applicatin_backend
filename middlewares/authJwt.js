const jwt = require('jsonwebtoken')
const config = require('../configs/auth.config')
const User = require('../models/user.model')
const constants = require('../utils/constants')

const verifyToken = (req,res,next)=>{
    let token = req.headers["x-access-token"];
    if(!token){
        return res.status(403).send({
            message : "No t  oken Provided"
        })
    }
    jwt.verify(token, config.secret, (err,decoded)=>{
        if(err){
            return res.status(401).send({
                message : "Unauthorized"
            })
        }
        req.userId = decoded.id;
    next()
    })
    
}

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            userId: req.userId
        });
        if (user && user.userType === constants.userTypes.admin) {
           
            next();
        } else {
            res.status(403).send({
                message: "Require Admin Role"
            });
        }
    } catch (error) {
        // Handle any potential errors here
        console.error(error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
}



module.exports = { verifyToken, isAdmin }
