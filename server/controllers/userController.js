const {User} = require('../models/models');
const ApiError = require("../error/ApiError");

class UserController {
    async getAll(req, res){
        const allUser = await User.findAll();
        res.json(allUser);
    };
    async getUser(req, res, next){
        const id = req.params.id;
        if (!id){
            return next(ApiError.badRequest('Не задан ID'));
        }
        const getUser = await User.findOne({where: {id: id}});
        res.json(getUser);
    }
    async login(req, res){
        const {login, password} = req.body;
        const authUser = await User.findOne({where: {"login": login, "password": password}});
        res.json(authUser ? true : false);
    };
    async createUser(req, res){
        const {login, password} = req.body;
        const newUser = await User.create({login: login, password: password});
        res.json(newUser);
    }
}
module.exports = new UserController();