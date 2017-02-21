const {db, pgp} = require('../db/postgres.js');
const sql = require('../sql/sql.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


class UserSchema {

    constructor(user){
            //this = user
                this.email = user.email;
                this.password = user.password;
                user.tokens ? this.tokens = user.tokens : this.tokens = [];
                user.id ? this.id = user.id : this.id = undefined;
            };

    saveNew() { //save new user to database returning full user object
        //this = user

        // if password is modified
        //hash the funcion

        return new Promise((resolve, reject) => {
            //validate email
            if(!validator.isEmail(this.email)){
                reject('invalid email');
            }
            //validate password
            if(true){
                this.generatePasswordHash()
                    .then(() => {
                        db.tx(t => {
                            return t.one(sql.newUser, {email: this.email, password: this.password})
                                    .then((newUser) => {
                                        this.id = newUser.id;
                                        this.generateAuthToken();
                                        t.one(sql.newUserAuthToken, {tokens: JSON.stringify(this.tokens), id: this.id})
                                            .then((newUser) => {
                                                pgp.end();
                                                this.tokens = newUser.tokens;
                                                resolve(this);
                                            }).catch(e => reject(e));
                                    });
                        }).catch(e => reject(e));
                    });
            }
        });
    };

    generateAuthToken() { //this = user
        let access = 'auth';
        let token = jwt.sign({id: this.id, access}, 'abc123').toString();
        this.tokens.push({access, token});
        return this.tokens;
    };

    toJSON() {
        // this = user
        return _.pick(this, ['id', 'email']);
    };

    generatePasswordHash() {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if(err) reject('error occured generating secure salt');
                bcrypt.hash(this.password, salt, (err, hash) => {
                    if(err) reject('error occured generating secure hash') ;
                    this.password = hash;
                    resolve(this);
                    });
                });      
        });
  
    };

    getAuthToken() {
        if(this.tokens.length){
            const authToken = this.tokens.find(token => token.access === 'auth');
            return authToken.token;
        }
        return undefined;
    };

    removeToken(token) {
        return new Promise((resolve, reject) => {
            //remove this.tokens where array member value of token === token
            var indexOfToken = this.tokens.indexOf(this.tokens.find(_token => _token.token === token));
            this.tokens.splice(indexOfToken, 1);
            db.one(sql.newUserAuthToken, {tokens: JSON.stringify(this.tokens), id: this.id})
                .then((user) => {
                    pgp.end();
                    return resolve(user);
                }).catch(e => reject(e));
            });
    };

}

const init = () => {
    return new Promise((resolve, reject) => {
        db.query(sql.createUsersTable).then(() => {
            pgp.end();
            resolve('User Table Initialized or already present');
        }).catch(e => {
            reject(e);
        })
    });
}

const findByAuthToken = (token) => {
    return new Promise((resolve, reject) => {
        let decoded;
        try{
            decoded = jwt.verify(token, 'abc123');
        } catch (e){
            reject(e);
        }
        db.oneOrNone(sql.findUserWithAuthToken, {token: token, id: decoded.id})
            .then((user) => {
                pgp.end();
                user ? resolve(new UserSchema(user)) : resolve(null);
            }).catch(e => {
                reject(e);
        });
    })
};

const findByEmail = (loginData) => {
    return new Promise((resolve, reject) => {
        //get password hash from database where email      
            db.oneOrNone(sql.findUserWithEmail, {email: loginData.email})
                .then((user) => {
                    if(!user) return reject('No User Found');
                    //compare password hash to hash from database
                    bcrypt.compare(loginData.password, user.password)
                    .then((match) => {
                        if(!match) return reject('Incorrect Password');
                        user = new UserSchema(user);
                        //check if token exists //if exists resolve
                        if(user.getAuthToken()) {
                            return resolve(user);
                        } else {//if not
                            //create new auth token
                            user.generateAuthToken();
                            //update database
                            db.one(sql.newUserAuthToken, {tokens: JSON.stringify(user.tokens), id: user.id})
                            .then((user) => {
                                pgp.end();
                                return resolve(user);
                            })
                        }
                    })
            })
        }).catch( e => console.log(e));
};

const deleteAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.none(sql.deleteAllUsers).then(() => {
            resolve();
        })
        .catch(e => {
            reject(e);
        });
    });
};

module.exports = {
    UserSchema,
    init,
    findByAuthToken,
    deleteAllUsers,
    findByEmail
}