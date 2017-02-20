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

    save() { //save new user to database returning full user object
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
                            return t.query(sql.newUser, {email: this.email, password: this.password})
                                    .then((newUser) => {
                                        this.id = newUser[0].id;
                                        this.generateAuthToken();
                                        t.query(sql.newUserAuthToken, {tokens: JSON.stringify(this.tokens), id: this.id})
                                            .then((newUser) => {
                                                pgp.end();
                                                this.tokens = newUser[0].tokens;
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

};



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

module.exports = {
    UserSchema,
    init,
    findByAuthToken
}