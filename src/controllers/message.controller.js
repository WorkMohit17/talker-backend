const jwt = require('jsonwebtoken') ;
const messageModel = require('../models/messages.model') ;


async function sendMessage(req,res){

    const token = req.cookies.token ;


    try{
        
        const { text } = req.body;
        const receiver = req.params.id ;
        const decoded =jwt.verify(token, process.env.JWT_SECRET) ;

        const message = await messageModel.create({
            sender: decoded.id,
            receiver,
            text,
        })

        res.status(201).json({
            "message": "Message sent successfully",
            message
        })

    }catch{

        res.json({"meaasge":"Message not Send"})
        
    }


    

}


async function getMessages(req, res) {

    const token = req.cookies.token;

    try {

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const sender = decoded.id;
        const receiver = req.params.id;

        const messages = await messageModel.find({
            $or: [
                {
                    sender: sender,
                    receiver: receiver
                },
                {
                    sender: receiver,
                    receiver: sender
                }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({
            messages
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to fetch messages"
        });
    }
}


async function deleteChat(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id;
        const otherUserId = req.params.id;

        const result = await messageModel.deleteMany({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        });

        console.log(result);

        return res.status(200).json({
            message: "Chat deleted successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
}

async function deleteMessage(req, res) {
    try {
        const { id } = req.params;

        const message = await messageModel.findById(id);

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        await messageModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Message deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {sendMessage,getMessages, deleteChat, deleteMessage}