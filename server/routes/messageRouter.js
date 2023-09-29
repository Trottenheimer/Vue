const Router = require('express');
const router = new Router();
const messageController = require('../controllers/messageController');

router.get('/', messageController.getAll);
router.post('/create', messageController.createMessage);

module.exports = router;