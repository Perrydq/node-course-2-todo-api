const pgp = require('pg-promise')();

const {connection} = require('./dbconnection');
const db = pgp(connection);

module.exports = {
    db,
    pgp
}