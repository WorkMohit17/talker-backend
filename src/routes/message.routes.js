const express = require('express') ;
const router = express()
const messageController = require('../controllers/message.controller') ;
const authMiddleware = require('../middleware/auth.middleware')



router.post('/sendMessage/:id' ,authMiddleware.auth, messageController.sendMessage)

router.get('/getMessages/:id' ,authMiddleware.auth, messageController.getMessages)

router.delete('/chat/:id' ,authMiddleware.auth, messageController.deleteChat) ;

router.delete('/chat/message/:id' ,authMiddleware.auth, messageController.deleteMessage) ;



module.exports = router ;