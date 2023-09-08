const {User} = require('../models/models');
const ApiError = require("../error/ApiError");

class UserController {
    async getAll(req, res){
        res.json('mass users')
    };
    async getUser(req, res, next){
        const {id} = req.params.id;
        if (!id){
            return next(ApiError.badRequest('Не задан ID'));
        }
        res.json(id);
    }
    async login(req, res){
    };
    async createUser(req, res){
        const {name, password} = req.body;
    }
}
module.exports = new UserController();