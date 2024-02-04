var Client = require('node-rest-client').Client;

var client = new Client()

exports.client = client;
exports.sendEmail = (ticketrId, subject, content, emailIds, requestor)=>{
    var reqBody = {
        subject : subject,
        content : content,
        recipientEmails : emailIds,
        requestor : requestor,
        ticketId : ticketrId
    }
    var args = {
        data : reqBody,
        headers : {"Content-Type" : "application/json"}
    }

    client.post("http://localhost:8030/notifServ/api/v1/notifications", args, (data,response)=>{
        console.log("Request Sent")
        console.log(data)
    })
}