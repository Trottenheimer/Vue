const {Message} = require('../models/models');
const ApiError = require("../error/ApiError");

class messageController {
    async getAll(req, res){
        const getAllMessages = await Message.findAll();
        res.json(getAllMessages);
    };
    async getByChat(req, res){
        const id = req.params.id;
        if (!id){
            return next(ApiError.badRequest('Не задан ID'));
        }
        const getMessagesByChat = await Message.findAll({where:{chat_id: id}});
        res.json(getMessagesByChat);
    }
    async createMessage(req, res){
        const {user, chat, text} = req.body;
        const newMessage = await Message.create({user_id: user, chat_id: chat, text: text});
        io.emit('newRecord', result.rows[0]);
        res.status(200).send('New record added');
        res.json(newMessage);
    }
}
module.exports = new messageController();