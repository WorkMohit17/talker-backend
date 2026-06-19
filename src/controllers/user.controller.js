const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const messageModel = require('../models/messages.model');

// GET /api/users
// Returns every user except the one currently logged in - used for the
// "find people to talk to" list in the frontend.
async function getAllUsers(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const users = await userModel
            .find({ _id: { $ne: decoded.id } })
            .select('username email propic');

        res.status(200).json({ users });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET /api/users/recent-chats
// Returns the list of people the current user has exchanged messages with,
// most recently active first, each with a lastMessage preview.
async function getRecentChats(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const messages = await messageModel
            .find({ $or: [{ sender: userId }, { receiver: userId }] })
            .sort({ createdAt: -1 });

        // Walk messages newest-first, keep the first (= most recent) message per other-user.
        const seen = new Map();
        for (const msg of messages) {
            const otherId = msg.sender === userId ? msg.receiver : msg.sender;
            if (!seen.has(otherId)) {
                seen.set(otherId, msg.text);
            }
        }

        const otherIds = [...seen.keys()];
        const users = await userModel
            .find({ _id: { $in: otherIds } })
            .select('username email propic');

        const chats = users.map((u) => ({
            ...u.toObject(),
            lastMessage: seen.get(u._id.toString()),
        }));

        // Preserve recency order (users.find doesn't guarantee it).
        chats.sort((a, b) => otherIds.indexOf(a._id.toString()) - otherIds.indexOf(b._id.toString()));

        res.status(200).json({ chats });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllUsers, getRecentChats };