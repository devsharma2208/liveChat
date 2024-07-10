const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib');
const { userModel } = require('../Model/User/user');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.use((socket, next) => {
    const token = socket.handshake.query.token;
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.userId = decoded.userId;
        next();
    });
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    userModel.findByIdAndUpdate(socket.userId, { connected: true }).exec();

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        userModel.findByIdAndUpdate(socket.userId, { connected: false }).exec();
    });

    (async () => {
        const conn = await amqp.connect('amqp://localhost');
        const ch = await conn.createChannel();
        await ch.assertQueue('notifications');
        ch.consume('notifications', (msg) => {
            const notification = JSON.parse(msg.content.toString());
            if (notification.userId === socket.userId) {
                socket.emit('notification', notification);
            }
            ch.ack(msg);
        });
    })();
});

module.exports = {server};
