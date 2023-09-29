const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    online:{type: DataTypes.BOOLEAN, defaultValue: false},
    status: {type: DataTypes.STRING, defaultValue: 'user'}
});
const Message = sequelize.define('message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.INTEGER},
    chat_id: {type: DataTypes.INTEGER},
    text: {type: DataTypes.STRING},
});
const Chat = sequelize.define('chat', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    users: {type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false},
});
module.exports = {
    User, Message, Chat
}