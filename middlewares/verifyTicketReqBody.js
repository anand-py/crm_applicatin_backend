const constants = require('../middlewares')

const validateTicketReqBody = async(req,res)=>{
    if(!user.body.title || !user.body.description){
        res.status(400).send({
            message : "Failed ! Details are not provided"
        })
        return 
    }
    next()
}


module.exports = validateTicketReqBody
