// !imports
// #asynchandler
const asyncHandler = require('express-async-handler');
// #usermodel
const User = require('../models/userModel');
// #projectmodel
const Project = require('../models/projectModel');


const fetchProjects = asyncHandler(async (req, res) => {

    try {
        Project.find()
            .populate("users", "-password")
            .populate("projectAdmin", "-password")
                .sort({ createdAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email admin"
                });

                res.status(200).send(results);
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createProjects = asyncHandler(async (req, res) => {
     const { name, cost, tp, ihc, photo, quant, inter, paid, bal, todo, inProgress, complete, checkout, user } = req.body

    if (!req.body.name) {
        return res.status(400).send({ message: "Please provide a project name" });
    }

    try {
        const project = await Project.create({
            projectName: name,
            projectCost: cost,
            paidCost: paid,
            balance: bal,
            isTodo: todo,
            isInProgress: inProgress,
            isCompleted: complete,
            isCheckedOut: checkout,
            TissueProcessing: tp,
            Immunohistochemistry: ihc,
            Photomicrography: photo,
            Quantification: quant,
            Interpretation: inter,
            projectAdmin: user,
        });

        const fullProject = await Project.findOne({ _id: project._id })
            .populate("users", "-password")
            .populate("projectAdmin", "-password");

        res.status(200).json(fullProject);

         return;
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const editProjects = asyncHandler(async (req, res) => {
    const { projectId, name, cost, tp, ihc, photo, quant, inter, bal } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            projectName: name,
            projectCost: cost,
            TissueProcessing: tp,
            Immunohistochemistry: ihc,
            Photomicrography: photo,
            Quantification: quant,
            Interpretation: inter,
            balance: bal,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
            .populate("projectAdmin", "-password");

    if (!updatedProject) {
        res.status(404);
        throw new Error("Project not found");
    } else {
        res.json(updatedProject);
    }
     return;
});

const deleteProjects = asyncHandler(async (req, res) => {
    const { projectId } = req.body;
    
    const updatedProject = await Project.findByIdAndDelete(
        projectId
    );

    if (!updatedProject) {
        res.status(404);
        throw new Error("Project not found");
    } else {
        res.sendStatus(200);
    }
});

const updateProjects = asyncHandler(async (req, res) => {
    const { projectId, tp, ihc, photo, quant, inter, todo, inProgress, complete, checkout  } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            isTodo: todo,
            isInProgress: inProgress,
            isCompleted: complete,
            isCheckedOut: checkout,
            TissueProcessing: tp,
            Immunohistochemistry: ihc,
            Photomicrography: photo,
            Quantification: quant,
            Interpretation: inter,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
            .populate("projectAdmin", "-password");

    if (!updatedProject) {
        res.status(404);
        throw new Error("Project not found");
    } else {
        res.json(updatedProject);
    }
})

const updatePayment = asyncHandler(async (req, res) => {
    const { projectId, paidCost, balance  } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            paidCost: paidCost,
            balance: balance,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
            .populate("projectAdmin", "-password");

    if (!updatedProject) {
        res.status(404);
        throw new Error("Project not found");
    } else {
        res.json(updatedProject);
    }
})

const checkProjectOut = asyncHandler(async (req, res) => {
    const { projectId, checkOut, completed } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            isCheckedOut: checkOut,
            isCompleted: completed,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("projectAdmin", "-password");

    if (!updatedProject) {
        res.status(404);
        throw new Error("Project not found");
    } else {
        res.json(updatedProject);
    }
});

const addUser = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.body;

    const addedUser = await Project.findByIdAndUpdate(
        projectId,
        { $push: { users: userId } },
        { new: true },
    )
        .populate("users", "-password")
        .populate("projectAdmin", "-password");
    
    if (!addedUser) {
        res.status(404);
        throw new Error("Project not found");
    } else {
        res.json(addedUser);
    }
});

const removeUser = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.body;

    const removedUser = await Project.findByIdAndUpdate(
        projectId,
        { $pull: { users: userId } },
        { new: true },
    )
        .populate("users", "-password")
        .populate("projectAdmin", "-password");
    
    if (!removedUser) {
        res.status(404);
        throw new Error("Project not found");
    } else {
        res.json(removedUser);
    }
});


module.exports = { fetchProjects, createProjects, editProjects, updateProjects, deleteProjects, addUser, removeUser, updatePayment, checkProjectOut };