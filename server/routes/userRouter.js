const Router = require('express');
const router = new Router();
const UserController = require('../controllers/userController');

router.get('/', UserController.getAll);
router.get('/:id', UserController.getUser);
router.post('/', UserController.login);
router.post('/create', UserController.createUser);

module.exports = router;