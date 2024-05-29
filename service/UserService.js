const User = require('../models/user');

class UserService {
    async register(username, email, password, admin) {
        try {
            admin = admin === 'on';
            const user = new User({
                username: username,
                email: email,
                password: password,
                member: false,
                admin: admin,
            });
            return user
        } catch (e) {
            throw new Error(e);
        }
    }
    async makeMember(user) {
        try {
            const updatedUser = new User({
                username: user.username,
                email: user.email,
                password: user.password,
                member: true,
                admin: user.admin,
                _id: user.id,
            })
            return await User.findByIdAndUpdate(user.id, updatedUser, {})
        } catch (e) {

        }
    }

    async findByUsername(username) {
        try {
            const user = await User.findOne({username: username}).exec();
            return user
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = new UserService();
