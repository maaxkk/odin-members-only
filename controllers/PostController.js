const PostService = require('../service/PostService');
const { validationResult } = require('express-validator');

class PostController {
    async create(req, res, next) {
        try {
            if (req.user === undefined) {
                const posts = await PostService.getAll();
                res.render('main_page', {
                    errors: [{ msg: '⛔ *Please authorize to make post' }],
                    posts: posts,
                    mockSections: req.sections,
                    isMember: req.member,
                    isAdmin: req.admin,
                });
                return;
            }
            const { title, description } = req.body;
            const errors = validationResult(req);
            const newPost = await PostService.create(title, description, req.user);
            if (!errors.isEmpty()) {
                const posts = await PostService.getAll();
                res.render('main_page', {
                    errors: errors.array(),
                    posts: posts,
                    title: newPost.title,
                    description: newPost.description,
                    mockSections: req.sections,
                    isMember: req.member,
                    isAdmin: req.admin,
                });
            } else {
                await newPost.save();
                res.redirect('/post');
            }
        } catch (e) {
            return next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const posts = await PostService.getAll();
            res.render('main_page', { posts: posts, mockSections: req.sections, isMember: req.member, isAdmin: req.admin });
        } catch (e) {
            return next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const deletedPost = await PostService.delete(req.params.id);
            res.redirect('/');
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new PostController();