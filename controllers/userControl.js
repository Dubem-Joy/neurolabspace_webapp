// !imports
// #asynchandler
const asyncHandler = require('express-async-handler');
// #usermodel
const User = require('../models/userModel')
const AuthEmail  = require('../models/emailauthModel');
// #jwt token
const generateToken = require('../config/generateToken');
var nodemailer = require('nodemailer');

// #dotenv
const dotenv = require('dotenv');
dotenv.config();

// !controllers
// #email auth
const authEmail = asyncHandler(async (req, res) => {
    const { email, emailAdmin, name } = req.body

    // *check if any inputs is undefined
    if (!email) {
        res.status(400);
        return res.send('Please enter all the fields');
    }
    const emailExists = await AuthEmail.findOne({ email });
    if (emailExists) {
        res.status(400);
        return res.send('Email is already autheticated');
    }

    try {
        const { data } = await AuthEmail.create({
            email: email,
            admin: emailAdmin,
    
        });
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
            },
            
            tls: {
                rejectUnauthorized: false
            }
        });


    
        let mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: `${email}`,
            subject: 'Your email has been autheticated',
            html: `
            <h3 style="font-weight:300">Hello ${name},<h3>

            <h3 style="font-weight:300">Your email has been authenticated on the Neuro-Lab space. <a a href='https://neurolab-space.onrender.com/' >set up your account</a> using ${email.toString()}.</h3>
            
            </br>
            </br>
            </br>
            </br>
            <h3 style="font-weight:300">Regards,<h3>
            <h3 style="font-weight:300">The Neuro-Lab Team</h3>
            `
        };
    
        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log("Error " + err);
            } else {
                console.log("Email sent successfully");
            }
        });

        return res.send(data);
    } catch (error) {
        return res.send('Email authentication failed, please try again')
    }

    // *check if email exists in database 
    // const emailExists = await AuthEmail.findOne({ email });
    // if (emailExists) {
    //     res.status(400);
    //     throw new Error('Email is already authenticated');
    // }
    // await sendAuthEmail({ email: email, admin: userAdmin });
    
    // const newAuth = await AuthEmail.create({
    //     email,
    //     userAdmin,
    // });
    // res.send(newAuth);
});

// #getUsers
const getUser = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (users) {     
        res.send(users);
    } else {
        res.status(400);
        throw new Error('No users');
    }
});
// #Reister users
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body

    // *check if any inputs is undefined
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please enter all the fields');
    }

    // *check if user in exists in database and either throw error/create user
    const userExists = await User.findOne({ email });
    const emailExists = await AuthEmail.findOne({ email });
    if (userExists) {
        res.status(400);
        return res.send('Email is already taken');
    }
    if (!emailExists) {
        res.status(400);
        return res.send('Email is not authenticated: contact labspace.neurolab@gmail.com');
    }
    // create user
    const user = await User.create({
        name,
        email,
        admin: emailExists.admin,
        role,
        password,
    });

    // send user to client
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            role: user.role,
            pic: user.pic,
            token: generateToken(user._id)
        });
        return;
    } else {
        res.status(400);
        throw new Error('Error loggin in: please try again.');
    }
});

// #Authenticate users
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // *check if any inputs is undefined
    if ( !email || !password) {
        res.status(400);
        throw new Error('Please enter all the fields');
    }

    // *check if user in exists in database and either throw error/log user into app
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            role: user.role,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid email or password');
    }
});

// #Change User Profile
const editUser = asyncHandler(async (req, res) => {
    const { userId, name, role, admin } = req.body;

    // const updatedUser = await User.findByIdAndUpdate(
    //     userId,
    //     { name, email, role, pic },
    //     { new: true, }
    // );

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, role, admin},
        { new: true, }
    );

    if (updatedUser) {
        res.status(201).json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            admin: updatedUser.admin,
            role: updatedUser.role,
            pic: updatedUser.pic,
            token: generateToken(updatedUser._id)
        });

         return;
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

module.exports = { authEmail, registerUser, authUser, editUser, getUser };