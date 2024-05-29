module.exports.isAuth = function(req, res, next) {
    if (req.isAuthenticated()) {
        req.sections = ['Message board', 'Home', 'Logout', 'Become member']
        req.member = req.user.member;
        req.admin = req.user.admin;
    } else {
        req.sections = ['Message board', 'Home', 'Register', 'Login']
        req.member = false;
        req.admin = false;
    }
    next();
}

module.exports.canBecomeMember = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/')
    } else {
        next();
    }
}

module.exports.alreadyLoggenIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('login_form', {isAuth: true})
    } else {
        next();
    }
}

module.exports.alreadyRegistered = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('register_form', {isAuth: true})
    } else {
        next();
    }
}
