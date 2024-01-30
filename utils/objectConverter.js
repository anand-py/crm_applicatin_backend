const userResponse =  (users) =>{
    let userResult = [];
    users.forEach(user => {
        userResult.push({
            name : user.name,
            userId : user.userId,
            email : user.email,
            userType : user.userType,
            userStatus : user.userStatus
        })
    });
    return userResult;
}

const ticketResponse = (ticket) => {
    return {
        title: ticket.title,
        ticketPriority: ticket.ticketPriority,
        description: ticket.description,
        status: ticket.status,
        reporter: ticket.reporter,
        assignee: ticket.assignee,
        id: ticket._id,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
    }
}

const ticketListResponse = (tickets)=>{
    ticketResult = [];
    tickets.forEach(ticket =>{
        ticketResult.push({
            title: ticket.title,
        ticketPriority: ticket.ticketPriority,
        description: ticket.description,
        status: ticket.status,
        reporter: ticket.reporter,
        assignee: ticket.assignee,
        id: ticket._id,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
        })
    });
    return ticketResult;
}

module.exports = {userResponse, ticketResponse, ticketListResponse}