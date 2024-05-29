const UserService = require('../service/UserService');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')

class UserController {
    async loginGET(req, res, next) {
        res.render('login_form');
    }

    async loginPOST(req, res, next) {
        try {
            const userExists = await UserService.findByUsername(req.body.username)
            if (!userExists) {
                res.render('login_form', {
                    errors: [{msg: '⛔ *User with this username does not exist!'}]
                });
                return;
            } else {
                const match = await bcrypt.compare(req.body.password, userExists.password);
                if (!match) {
                    res.render('login_form', {
                        errors: [{msg: '⛔ *Password is not correct'}],
                        username: req.body.username
                    });
                    return;
                }
            }
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.render('login_form', {
                    errors: errors.array(),
                    username: req.body.username,
                })
            } else {
                next();
            }
        } catch (e) {
            return next(e)
        }
    }

    async registerGET(req, res, next) {
        res.render('register_form');
    }

    async registerPOST(req, res, next) {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            try {
                const userExists = await UserService.findByUsername(req.body.username)
                if (userExists) {
                    res.render('register_form', {
                        errors: [{msg: '⛔ *User with this username already exists!'}]
                    });
                    return;
                }
                const errors = validationResult(req);
                const { username, email, admin } = req.body;
                const user = await UserService.register(username, email, hashedPassword, admin);
                if (!errors.isEmpty()) {
                    res.render('register_form', {
                        errors: errors.array(),
                        user: user,
                    });
                } else {
                    await user.save();
                    req.login(user, function(err) {
                        if (err) {
                            return next(err);
                        }
                        return res.redirect('/');
                    });
                }
            } catch (e) {
                return next(e);
            }
        });
    }

    async becomeMember(req, res, next) {
        res.render('become_member_form', { member: req.user.member });
    }

    async becomeMemberPOST(req, res, next) {
        try {
            const { secret } = req.body;
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.render('become_member_form', {
                    member: req.user.member,
                    errors: errors.array(),
                });
            } else {
                if (secret === '0123') {
                    const updatedUser = await UserService.makeMember(req.user);
                    res.redirect('/');
                } else {
                    res.render('become_member_form', {
                        member: req.user.member,
                        errors: [{ msg: 'Secret code is 0123 🔥' }],
                    });
                }
            }
        } catch (e) {
            return next(e)
        }

    }
}

module.exports = new UserController();
