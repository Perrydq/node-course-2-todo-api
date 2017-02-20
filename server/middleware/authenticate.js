const _user = require('./../models/user.js');

var authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    _user.findByAuthToken(token).then((user) => {
        if (!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch(e => {
        res.status(401).send();
    });
};

module.exports = {
    authenticate
};