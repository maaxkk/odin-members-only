const express = require('express');
const UserController = require('../controllers/userController.js');
const passport = require('passport');
const router = express.Router();
const { body } = require('express-validator');
const { canBecomeMember, alreadyLoggenIn, alreadyRegistered } = require('../middleware/authMiddleware');


// GET
router.get('/login', alreadyLoggenIn ,UserController.loginGET);
router.get('/becomeMember', canBecomeMember, UserController.becomeMember);
router.get('/register',  alreadyRegistered, UserController.registerGET);
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// POST
router.post('/login',
    body('username')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('⛔ *Username should be at least 3 characters'),
    body('password')
        .trim()
        .isLength({ min: 4 })
        .escape()
        .withMessage('⛔ *Password is required, and must be at least 4 characters'),
    UserController.loginPOST, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/user/login' }));
router.post('/register', body('username')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('⛔ *Username should be at least 3 characters'),
    body('email')
        .isEmail()
        .withMessage('⛔ *Email is required'),
    body('password')
        .trim()
        .isLength({ min: 4 })
        .escape()
        .withMessage('⛔ *Password is required, and must be at least 4 characters'),
    UserController.registerPOST);
router.post('/becomeMember',
    body('secret')
        .exists()
        .isLength({max: 4, min: 4})
        .escape()
        .withMessage('Secret code is 0123 🔥'),
    UserController.becomeMemberPOST);

module.exports = router;
