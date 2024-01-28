// Import the auth controller and express module
const authController = require('../controllers/auth.controller');
const express = require("express");
const verifyUserReqBody = require('../middlewares/verifyUserReqBody');
const router = express.Router();

// Define the route for user signup
router.post('/crm/api/v1/auth/signup', verifyUserReqBody.validateUserReqBody, authController.signup);

// Define the route for user Signin
router.post('/crm/api/v1/auth/signin', authController.signin);

// Export the router
module.exports = router;