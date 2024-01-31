const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');
const constants = require('../utils/constants');
const converter = require('../utils/objectConverter');

/* 
* Create a Ticket;
* As soon as the ticket is created, It will assigned to an Engineer if present
*/
// const createTicket = async (req, res) => {
//     const ticketObject = {
//         title : req.body.title,
//         ticketPriority : req.body.priority,
//         status : req.body.status,
//         reporter : req.userId,
//         description : req.body.description
//     }

//     /* 
//     * Loginc to find an engineer in approved state 
//     */

//     const engineer = await User.findOne({
//         userType :constants.userTypes.engineer,
//         userStatus : constants.userStatus.approved
//     })
//     ticketObject.assignee = engineer.userId;
//     try{
//         const ticket = await Ticket.create(ticketObject);

//         if(ticket) {

//             const user = await User.findOne({
//                 userId: req.userId
//             });

//             user.ticketsCreated.push(ticket._id);
//             await user.save();

//             engineer.ticketsAssigned.push(ticket._id);
//             await engineer.save();

            
//             res.status(201).send(converter.ticketResponse(ticket))
//         }

//     }catch(err) {
//         console.log("Some error happened while creating the ticket", err.message);
//         res.status(500).send({
//             message: "Some internal server error"
//         })
//     }
// };

const createTicket = async (req, res) => {
    try {
        const { title, ticketPriority, status, description } = req.body;

        if (!title || !description) {
            return res.status(400).send({
                message: "Title and description are required"
            });
        }

        const parsedTicketPriority = parseInt(ticketPriority, 10); // Convert ticketPriority to a number

        const ticketObject = {
            title,
            ticketPriority: isNaN(parsedTicketPriority) ? 1 : parsedTicketPriority, // Default to 1 if not a valid number
            status: status,
            reporter: req.userId,
            description
        }
        
        console.log("Finding engineer...");
        const engineer = await User.findOne({
            userType: constants.userTypes.engineer,
            userStatus: constants.userStatus.approved
        });

        if (!engineer) {
            return res.status(400).send({
                message: "No approved engineer found"
            });
        }
        ticketObject.assignee = engineer.userId;
        console.log("Creating ticket...");
        const ticket = await Ticket.create(ticketObject);

        if (!ticket) {
            return res.status(500).send({
                message: "Failed to create the ticket"
            });
        }

        console.log("Finding user...");
        const user = await User.findOne({
            userId: req.userId
        });

        if (!user) {
            return res.status(500).send({
                message: "Failed to find the user"
            });
        }

        // Assign the ticket to the engineer
       

        // Initialize ticketsCreated if it's undefined
        if (!user.ticketsCreated) {
            user.ticketsCreated = [];
        } 

        // Push the ticket ID to ticketsCreated
        user.ticketsCreated.push(ticket._id);

        // Save the user
        await user.save();

        // Initialize ticketsAssigned if it's undefined
        if (!engineer.ticketsAssigned) {
            engineer.ticketsAssigned = [];
        }

        // Push the ticket ID to ticketsAssigned
        engineer.ticketsAssigned.push(ticket._id);

        // Save the engineer
        await engineer.save();

        res.status(201).send(converter.ticketResponse(ticket));
    } catch (err) {
        console.error("Some error happened while creating the ticket", err.message);
        res.status(500).send({
            message: "Some internal server error",
            error: err.message
        });
    }
};

/**
 * 
 * Only the user who has created the ticket is allowed to update the ticket. 
    Engineer who is the assignee of the ticket is allowed to update the ticket.
    Admin is also allowed to update the ticket. 

    In our case, engineer is updating the ticket, so we will check the assignee of the ticker and compare it with the 
    userid and if both are same, the Engineer will be allowed to update the ticket. 

    We will fetch all the information from the request and update the ticket in the db using save() function. 
 */
const updateTicket = async (req,res)=>{
    let ticket;
    try{
        ticket = await Ticket.findOne({_id : req.params.id})
        if(!ticket){
            res.status(400).send({
                message: "Ticket Id is incorrect"
            })
            return;
        } 
    }catch(err){
        console.log("Sommer error happened while updating the ticker", err.message);
        res.status(500).send({
            message: "Internal server error happened"
        })
        return;
    }
    const savedUser = await User.findOne({
        userId : req.userId
    })
    console.log(ticket)
    if(ticket.reporter == req.userId || ticket.assignee == req.userId || savedUser.userType == constants.userTypes.admin){
        //Allowed to update

        ticket.title = req.body.title  != undefined ? req.body.title: ticket.title,
        ticket.description = req.body.description  != undefined ? req.body.description: ticket.description,
        ticket.ticketPriority = req.body.ticketPriority  != undefined ? req.body.ticketPriority: ticket.ticketPriority,
        ticket.status = req.body.status  != undefined ? req.body.status: ticket.status
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee
        var updatedTicket = await ticket.save();

        const engineer = await User.findOne({
            userId: ticket.assignee

            
        })

        const reporter = await User.findOne({
            userId: ticket.reporter
        });
        

     

        res.status(200).send(converter.ticketResponse(updatedTicket));
    }else{
        console.log('Ticket was being updated by someone who has not created the ticket');
        res.status(400).send({
            message: "Ticket can be updated only by the customer who created it or engineer or admin who has been assigned it"
        })
    }
}

const getAllTickets = async (req,res)=>{
     /**
     * First find the type of user
     * 1. ADMIN should get the list of all tickets in the decreasing order of creation date
     * 2. Customer should be able to see only the tickets created by him/her
     * 3/ Engineer should be able to see all the tickets assigned to him or created by him 
     */

     const queryObj = {};

     if(req.query.status != undefined) {
         queryObj.status = req.query.status;
     }
 
     const savedUser  = await User.findOne({
         userId: req.userId
     })
 
     if(savedUser.userType == constants.userTypes.admin) {
         //do nothing
     }else if(savedUser.userType == constants.userTypes.engineer) {
         queryObj.assignee = req.userId
     }else{
         queryObj.reporter = req.userId
     }
 
     const tickets = await Ticket.find(queryObj);
 
     res.status(200).send(converter.ticketListResponse(tickets));
 }

const getOneTicket = async(req,res)=>{
    const ticket = await Ticket.findOne({
        _id: req.params.id
    })
 
    res.status(200).send(converter.ticketResponse(ticket))
}

module.exports = { createTicket, updateTicket, getAllTickets, getOneTicket }; // Export the createTicket function directly




