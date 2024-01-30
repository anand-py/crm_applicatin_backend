const constants = require('../utils/constants')

const validateTicketReqBody = async(req,res, next)=>{
    const title = req.body.title
    const description = req.body.description

    if(!title || !description){
        res.status(400).send({
            message : "Failed ! Details are not provided"
        })
        return 
    }
    next()
}

const validateTicketStatus = async(req, res, next) => {

    const status = req.body.status;
    const statusTypes = [
        constants.ticketStatus.open,
        constants.ticketStatus.inprogress,
        constants.ticketStatus.blocked,
        constants.ticketStatus.closed
    ]
    if(status && !statusTypes.includes(status)) {
        res.status(400).send({
            message: "status provided is invalid. Possible values CLOSED | BLOCKED | IN_PROGRESS | OPEN"
        })
    }

    next();
}



module.exports = {validateTicketReqBody, validateTicketReqBody, validateTicketStatus}
