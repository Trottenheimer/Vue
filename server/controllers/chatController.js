const {Chat} = require('../models/models');
const ApiError = require("../error/ApiError");

class chatController {
    async getAll(req, res){
        const getAllChats = await Chat.findAll();
        res.json(getAllChats);
    };
    async createChat(req, res){
        const {name, users} = req.body;
        const createChat = await Chat.create({name: name,users: users});
        res.json(createChat);
    }
}
module.exports = new chatController();