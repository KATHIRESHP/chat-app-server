const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoute');
const socket = require('socket.io');

require('dotenv').config();

const app = express()
app.use(express.json({limit: "3mb"}))
app.use(cors())

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true
})
    .then((data) => {
        console.log("DB connected");
    })
    .catch((e) => {
        console.log("Error in establising connection"+ e.message);
    })

const server =  app.listen(process.env.PORT, () => {
    console.log(`Server listening at ${process.env.PORT}`);
})

const io = socket(server, {
    cors:{
        origin: "http://localhost:5000",
        credentials: true
    }
})

global.onlineUsers = new Map()


io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket)
        {
            socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
    })
})