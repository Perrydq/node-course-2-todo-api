const pgp = require('pg-promise')();
const sql = require('../server/sql/sql.js');
const {connection} = require('./dbconnection.js');

const db = pgp(connection);
const id = 466;

db.oneOrNone(sql.deleteToDo, {id})
    .then((todo) => {
        pgp.end();
        console.log(todo);
    }).catch(err => {
        pgp.end();
        console.log(err);
    });