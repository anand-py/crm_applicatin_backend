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

module.exports = { validateUserReqBody };