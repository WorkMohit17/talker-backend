const { Server } = require('socket.io');

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    const onlineUsers = new Map(); // userId -> socket.id

    io.on('connection', (socket) => {
        console.log('User Connected:', socket.id);

        socket.on('join', (userId) => {
            onlineUsers.set(userId, socket.id);
        });

        socket.on('sendMessage', (message) => {
            const receiverSocketId = onlineUsers.get(message.receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receiveMessage', message);
            }
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected:', socket.id);
            for (const [userId, sId] of onlineUsers.entries()) {
                if (sId === socket.id) onlineUsers.delete(userId);
            }
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

module.exports = {
    initSocket,
    getIO
};