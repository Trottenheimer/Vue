const {Chat, Message} = require('../models/models');
const ApiError = require("../error/ApiError");

class chatController {
    async getAll(req, res){
        try {
            let getAllChats = [];
            await Chat.findAll().then(chats => {
                getAllChats = chats;
                const promises = chats.map(chat => {
                    return Message.findOne({
                        where: {chat_id: chat.id},
                        order: [['createdAt', 'DESC']]
                    });
                });
                return Promise.all(promises)
            }).then(messages => {
                getAllChats = getAllChats.map((chat, index) => {
                    return{
                        ...chat.toJSON(),
                        lastMessage: messages[index]
                    };
                });
            })
            console.log('-----------------------------------------');
            console.log(getAllChats);
            res.json(getAllChats);

        } catch (error) {
            res.json(error);
        }
    };
    async createChat(req, res){
        const {name, users} = req.body;
        const createChat = await Chat.create({name: name,users: users});
        res.json(createChat);
    }
}
module.exports = new chatController();