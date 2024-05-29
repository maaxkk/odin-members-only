const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController')
const { isAuth } = require('../middleware/authMiddleware');
const {body} = require('express-validator');

// GET
router.get('/', isAuth, PostController.getAll)
router.get('/:id/delete', isAuth, PostController.delete)

// POST
router.post('/', // create post
    body('title')
        .trim()
        .isLength({min: 2, max: 30})
        .escape()
        .withMessage('⛔ *Title required with min length 3 and max length 30'),
    body('description')
        .trim()
        .escape()
        .isLength({min: 2, max: 250})
        .withMessage('⛔ *Description required with min length 3 and max length 250'),
    isAuth, PostController.create)

module.exports = router;

