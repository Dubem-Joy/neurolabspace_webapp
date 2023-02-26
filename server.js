// !Imports
// #express
const express = require('express');
// #projects and users
const { projects, usersData } = require('./data/data');
// #dotenv
const dotenv = require('dotenv');
// #connectDB
const connectDB = require('./config/db')
// #colors
const colors = require('colors');
// #userroutes containg all user-related api calls
const userRoutes = require("./routes/userRoutes")
// #projectroutes containg all project-related api calls
const projectRoutes = require("./routes/projectRoutes")
// #meassage routes containg all message-related api calls
const messageRoutes = require("./routes/messageRoutes")
// #middlewares
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require('path')


// !Instances
// #express 
const app = express();
// #dontenv
dotenv.config();
// #connectDB
connectDB();


// !API calls
// #to accept json data
app.use(express.json({ extended: false }));



// #manage users api calls
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/messages', messageRoutes);

// ------------------DEPLOYMENT--------------
if (process.env.NODE_ENV === 'production') {
    //*Set static folder up in production
    app.use(express.static('client/build'));

    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
};
// ------------------DEPLOYMENT--------------

// #error handling middlewares for api calls
app.use(notFound);
app.use(errorHandler); 


const PORT = process.env.PORT || 5000
// #Runs server
const server = app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`.yellow.bold));


// !Socket io
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://neurolab-space.onrender.com",
    }
});

io.on("connection", (socket) => {
    console.log('conneted to socket.io')
    // #connects logged user
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit('connected')
    })

    // #connect to all assigned projects
    socket.on('assign project', (project) => {
        socket.join(project);
    })
    socket.on('new project', (newProject) => {   
        socket.broadcast.emit("project received", newProject);
    });


    // #connect user to chat
    socket.on('join chat', (room) => {
        socket.join(room);
    })
    socket.on('new message', (newMsg) => {
        var project = newMsg.project;

        if (!project.users) return console.log('chat.user is not defined');
        
        project.users.forEach(user => {
            if (user._id === newMsg.sender._id) return;
            socket.in(user._id).emit("message received", newMsg);
        })
    })
    socket.on('typing', (room) => {
        socket.in(room).emit("typing")
    })
    socket.on('stop typing', (room) => {
        socket.in(room).emit("stop typing")
    })

});