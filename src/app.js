const express = require('express') ;
const multer = require('multer')
const authRoutes = require('./routes/auth.routes')
const messageRoutes = require('./routes/message.routes')
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/User.routes')
const cors = require('cors');


const upload = multer({ storage: multer.memoryStorage() });
const app = express()
app.use(express.json()) ;
app.use(cookieParser())



app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))





app.use('/api/auth', authRoutes) ;
app.use('/api/chats', messageRoutes);
app.use('/api/users', usersRoutes);






module.exports = app ;