// Import the auth controller and express module
const userController = require('../controllers/user.controller');
const express = require("express");
const authJwt = require('../middlewares/authJwt')
const verifyUserReqBody = require('../middlewares/verifyUserReqBody')
const router = express.Router();

// Define the route for user signup
router.get('/crm/api/v1/users', authJwt.verifyToken, authJwt.isAdmin, userController.findAll);

router.get('/crm/api/v1/users/:userId', authJwt.verifyToken, authJwt.isAdmin, userController.findById)

router.put('/crm/api/v1/users/:userId', authJwt.verifyToken, authJwt.isAdmin, verifyUserReqBody.validateUserStatusandUserType , userController.update)
                                                                                                           
// Export the router
module.exports = router;    