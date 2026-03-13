const socketio = require('socket.io');

let io;

const init = (server) => {
    io = socketio(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Socket Disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

// Helper for controllers to emit events
const emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};

module.exports = {
    init,
    getIO,
    emitEvent
};
