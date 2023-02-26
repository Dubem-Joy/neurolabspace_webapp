// !Imports
// #express
const express = require('express');
// #userControls
const {authEmail, registerUser, authUser, editUser, getUser} = require('../controllers/userControl')
// #Middleware
const { protect } = require('../middleware/authMiddleware');


// !Instances
// #express 
const router = express.Router();


// !api calls
// #register user by posting info from client side
router.route('/').post(registerUser);
// #log user in by posting login detaials from client side
router.post('/login', authUser);
// #log user in by posting login detaials from client side
router.route('/profile').put(protect, editUser);
// #get user
router.route('/allusers').get(protect, getUser);
// #get user
router.route('/authemail').post(protect, authEmail);


module.exports = router;