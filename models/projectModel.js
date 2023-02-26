const mongoose = require('mongoose');

const projectModel = mongoose.Schema(
    {
        projectName: { type: String, trim: true },
        projectCost: { type: Number, required: true, default: 0 },
        paidCost: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
        isTodo: { type: Boolean, default: true },
        isInProgress: { type: Boolean, default: false },
        isCompleted: { type: Boolean, default: false },
        isCheckedOut: { type: Boolean, default: false },
        TissueProcessing: {
            checked: { type: Boolean, default: false },
            added: { type: Boolean, default: true }
        },
        Immunohistochemistry: {
            checked: { type: Boolean, default: false },
            added: { type: Boolean, default: false }
        },
        Photomicrography: {
            checked: { type: Boolean, default: false },
            added: { type: Boolean, default: false }
        },
        Quantification: {
            checked: { type: Boolean, default: false },
            added: { type: Boolean, default: false }
        },
        Interpretation: {
            checked: { type: Boolean, default: false },
            added: { type: Boolean, default: false }
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        projectAdmin: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", projectModel)
module.exports = Project;