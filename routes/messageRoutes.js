// !Imports
// #express
const express = require('express');
// #messageControls
const { sendMessage, allMessages } = require("../controllers/messageControl");
// #Middleware
const { protect } = require('../middleware/authMiddleware');

// !Instances
// #express 
const router = express.Router();


// !api calls
// #sed message for a project
router.route('/').post(protect, sendMessage)
// #get messages for a specific project
router.route('/:projectId').get(protect, allMessages)


module.exports = router;