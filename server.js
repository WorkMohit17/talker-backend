require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { initSocket } = require('./src/sockets/socket');

connectDB();

const server = http.createServer(app);

initSocket(server);

server.listen(3000, () => {
    console.log('Server Started at port 3000');
});