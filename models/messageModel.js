const mongoose = require('mongoose');

const messageModel = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        msg: { type: String},
        project: {type: mongoose.Schema.Types.ObjectId, ref: "Project" }
    },
    {
        timestamps: true,
    },
)

const Message = mongoose.model("Message", messageModel)
module.exports = Message;