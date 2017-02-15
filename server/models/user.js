const {db, pgp} = require('../db/postgres.js');
const sql = require('../sql/sql.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');




const addUser = (user) => {
    return new Promise((resolve, reject) => {
        if(validator.isEmail(user.email)){
            db.tx(t => {
                return t.batch([
                    t.query(sql.createUsersTable),
                    t.query(sql.newUser, {email: user.email, password: user.password})
                        .then(user => {
                            pgp.end();
                            user = user[0];
                            user = generateAuthToken(user);
                            resolve(user);
                        })
                ]);
            }).catch(e => reject(e));
        } else {
            reject(`${user.email} is not a valid Email`);
        }
    })
}

const generateAuthToken = function (user) {
    if(!user.tokens){
        user.tokens = [];
    }
    var access = 'auth';
    var token = jwt.sign({id: user.id, access}, 'abc123').toString();
    user.tokens.push({access, token});
    return user;
};

module.exports = {
    addUser,
}