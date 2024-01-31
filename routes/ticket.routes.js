
const ticketController = require('../controllers/ticket.controller')
const express = require("express");
const router = express.Router();
const authJwt = require('../middlewares/authJwt')
const verifyTicketReqBody = require('../middlewares/verifyTicketReqBody')


router.post('/crm/api/v1/tickets',
    authJwt.verifyToken,
    verifyTicketReqBody.validateTicketReqBody,
    ticketController.createTicket)

router.put("/crm/api/v1/tickets/:id", authJwt.verifyToken, verifyTicketReqBody.validateTicketStatus, ticketController.updateTicket)
router.get("/crm/api/v1/tickets", authJwt.verifyToken, ticketController.getAllTickets);
router.get("/crm/api/v1/tickets/:id", authJwt.verifyToken, ticketController.getOneTicket);

module.exports = router
