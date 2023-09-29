const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const messageRouter = require('./messageRouter');
const chatRouter = require('./chatRouter');

router.use('/user', userRouter);
router.use('/message', messageRouter);
router.use('/chat', chatRouter);


module.exports = router;