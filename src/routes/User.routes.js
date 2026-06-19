const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware.auth, usersController.getAllUsers);
router.get('/recent-chats', authMiddleware.auth, usersController.getRecentChats);

module.exports = router;