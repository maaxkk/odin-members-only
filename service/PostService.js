const Post = require('../models/post');

class PostService {
    async create(title, description, user) {
        try {
            return new Post({ title: title, description: description, author: user.id, createdAt: Date.now() });
        } catch (e) {
            throw new Error(e);
        }
    }

    async getAll() {
        try {
            return await Post.find().populate('author').sort({createdAt: -1}).exec();
        } catch (e) {
            throw new Error(e);
        }
    }
    async delete(id) {
        try {
            return await Post.findByIdAndDelete(id);
        } catch (e) {

        }
    }
}

module.exports = new PostService();