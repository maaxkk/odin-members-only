const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/authMiddleware');

const userRouter = require('./userRouter');
const postRouter = require('./postRouter');

router.use('/user', userRouter);
router.use('/post', postRouter);

router.get('/', isAuth, (req, res, next) => {
    res.redirect('/post');
});

module.exports = router;
