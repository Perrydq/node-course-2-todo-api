const pgp = require('pg-promise')();

const sql = require('./sql.js');
const connection = require('./dbconnection.js');
const toDo = require('./models/todo.js');

const db = pgp(connection);

