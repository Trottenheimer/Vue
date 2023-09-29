const Router = require('express');
const router = new Router();
const chatController = require('../controllers/chatController');

router.get('/', chatController.getAll);
router.post('/create', chatController.createChat)

module.exports = router;