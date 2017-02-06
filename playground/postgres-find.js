const pgp = require('pg-promise')();
const sql = require('./sql.js');
const connection = require('./dbconnection.js');

const db = pgp(connection);

var tableParameters = {
    tableName: 'todos',
    columnOneName: 'todo',
    columnTwoName: 'completed',
    columnThreeName: 'id'
};


db.manyOrNone(sql.listToDo, {tableName: 'todos'}).then((data) => {
    console.log(`To Dos Count ${data.length}`);
    console.log(JSON.stringify(data, undefined, 2));
    pgp.end();
}).catch((e) => {
    console.log(e);
    pgp.end();
});