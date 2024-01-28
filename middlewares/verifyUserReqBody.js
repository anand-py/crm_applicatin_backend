/**
 * Middleware for validating UserId and email
 */

// Import the User model and constants
const User = require('../models/user.model');
const constants = require('../utils/constants');

// Middleware function to validate user request body
const validateUserReqBody = async (req, res, next) => {
  const { name, userId, email, userType } = req.body;

  if (!name || !userId) {
    return res.status(400).send({ message: `Failed! Required fields are mandatory` });
  }

  const existingUser = await User.findOne({ userId });
  if (existingUser) {
    return res.status(400).send({ message: `Failed! UserId already exists` });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).send({ message: `Failed! Email already exists` });
  }

  const userTypes = [
    constants.userTypes.customer,
    constants.userTypes.admin,
    constants.userTypes.engineer
  ];

  // Check if userType exists in the request body and does not include CUSTOMER, ADMIN, or ENGINEER
  if (userType && !userTypes.includes(userType)) {
    return res.status(400).send({ 
        message: "UserType is invalid. Must be CUSTOMER, ADMIN, or ENGINEER" 
    });
  }

  next();
};

const validateUserStatusandUserType = async(req,res,next) =>{
  const userType = req.body.userType
  const userTypes = [
    constants.userTypes.admin,
    constants.userTypes.customer,
    constants.userTypes.engineer
  ]
  if(userType && !userTypes.includes(userType)){
    res.status(400).send({
      message : "User Type Provided is invalid. Possible values are ADMIN | CUSTOMER | ENGINEER"
    })
    return
  }
  const userStatus = req.body.userStatus
  const userStatuses = [
    constants.userStatus.approved,
    constants.userStatus.pending,
    constants.userStatus.rejected
  ]
  if(userStatus && !userStatuses.includes(userStatus)){
    res.status(400).send({
      message : "User Status Provided is invalid. Possible values are APPROVED | PENDING | REJECTED"
    })
    return
  }
  next()
}

module.exports = { 
  validateUserReqBody,
  validateUserStatusandUserType
 };