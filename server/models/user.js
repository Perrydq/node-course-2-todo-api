const {db, pgp} = require('../db/postgres.js');
const sql = require('../sql/sql.js');

const addUser = (email) => {
    db.tx( t => {
        return t.batch([
            t.query(sql.createUsersTable),
            t.query(sql.newUser, {email}).then(data => {
                    console.log(`Account Created: ${data[0].email}`);
                    pgp.end();
                })
        ]);
    }).catch(e => console.log('Unable to Create Users Table!', e));
}

module.exports = {
    addUser
}