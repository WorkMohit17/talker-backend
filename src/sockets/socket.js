const { Server } = require('socket.io');

let io;
const onlineUsers = new Map(); // userId -> socket.id

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('join', (userId) => {
            onlineUsers.set(String(userId), socket.id);
            console.log('JOIN ->', userId, 'as socket', socket.id);
            console.log('Online users now:', [...onlineUsers.entries()]);
        });

        socket.on('sendMessage', (message) => {
            console.log('sendMessage received, target receiver:', message.receiver);
            console.log('Online users at send time:', [...onlineUsers.entries()]);

            const receiverSocketId = onlineUsers.get(String(message.receiver));

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receiveMessage', message);
                console.log('Delivered to socket', receiverSocketId);
            } else {
                console.log('Receiver not online — not delivered live');
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
            for (const [userId, sId] of onlineUsers.entries()) {
                if (sId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log('Removed', userId, 'from online users');
                }
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