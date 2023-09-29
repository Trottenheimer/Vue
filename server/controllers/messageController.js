const {Message} = require('../models/models');
const ApiError = require("../error/ApiError");

class messageController {
    async getAll(req, res){
        const getAllMessages = await Message.findAll();
        res.json(getAllMessages);
    };
    async createMessage(req, res){
        const {user, chat, text} = req.body;
        const newMessage = await Message.create({user_id: user, chat_id: chat, text: text});
        res.json(newMessage);
    }
}
module.exports = new messageController();