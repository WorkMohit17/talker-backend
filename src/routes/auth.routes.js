const express = require('express');
const router = express.Router();

const authcontroller = require('../controllers/auth.controller');

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
});

router.post('/register', upload.single('propic'), authcontroller.registerUser);

router.post('/login', authcontroller.loginUser);

router.post('/logout', authcontroller.logout);

router.get('/me', authcontroller.getMe)

module.exports = router;