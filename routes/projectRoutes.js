// !Imports
// #express
const express = require('express');
// #projectControls
const {fetchProjects, createProjects, editProjects, updateProjects, checkProjectOut, deleteProjects, addUser, removeUser, updatePayment } = require('../controllers/projectControl')
// #Middleware
const { protect } = require('../middleware/authMiddleware');

// !Instances
// #express 
const router = express.Router();


// !api calls
// #get projects
router.route('/').get(protect, fetchProjects);
// #create projects
router.route('/project').post(protect, createProjects);
// #edit projects
router.route('/edit').put(protect, editProjects);
// #update projects
router.route('/update').put(protect, updateProjects);
// #update project payment
router.route('/payment').put(protect, updatePayment);
// #check project out
router.route('/checkout').put(protect, checkProjectOut);
// #delete projects
router.route('/delete').put(protect, deleteProjects);
// #add user to projects
router.route('/adduser').put(protect, addUser);
// #remove user from projects
router.route('/removeuser').put(protect, removeUser);

module.exports = router;