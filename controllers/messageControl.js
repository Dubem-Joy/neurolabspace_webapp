// !imports
// #asynchandler
const asyncHandler = require('express-async-handler');
// #usermodel
const User = require('../models/userModel');
// #projectmodel
const Project = require('../models/projectModel');
// #message model
const Message = require('../models/messageModel');


const sendMessage = asyncHandler(async (req, res) => {
    const { msg, projectId } = req.body;

    if (!msg || !projectId) {
        console.log('invalid data')
        return res.sendStatus(400);
    }


    var newMessage = {
        sender: req.user._id,
        msg: msg,
        project: projectId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("project");
        message = await User.populate(message, {
            path: "project.users",
            select: "name pic email",
        });

        await Project.findByIdAndUpdate(req.body.projectId, {
            latestMessage: message,
        });
        
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
});


const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ project: req.params.projectId }).populate("sender", "name pic email").populate('project');

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
});

module.exports = { sendMessage, allMessages }; 