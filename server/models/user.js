const {db, pgp} = require('../db/postgres.js');
const sql = require('../sql/sql.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

class UserSchema {

    constructor(user){
            //this = user
                this.email = user.email;
                this.password = user.password;
                this.tokens = [];
            }

    save() { //save new user to database returning full user object
        //this = user
        return new Promise((resolve, reject) => {
            //validate email
            if(!validator.isEmail(this.email)){
                reject('invalid email');
            }
            //validate password
            if(!true){
                reject('invalid password');
            }         
            db.tx(t => {
                    return t.query(sql.newUser, {email: this.email, password: this.password})
                            .then((newUser) => {
                                this.id = newUser[0].id;
                                t.query(sql.newUserAuthToken, {tokens: this.generateAuthToken(), id: this.id})
                                    .then((newUser) => {
                                        pgp.end();
                                        this.tokens = newUser[0].tokens;
                                        resolve(this);
                                    }).catch(e => reject(e));
                            });
                }).catch(e => reject(e));
        });
    }

    generateAuthToken() { //this = user
        var access = 'auth';
        var token = jwt.sign({id: this.id, access}, 'abc123').toString();
        this.tokens.push({access, token});
        return this.tokens;
    };

    toJSON() {
        // this = user
        return _.pick(this, ['id', 'email']);
    }

}

module.exports = {
    UserSchema
}