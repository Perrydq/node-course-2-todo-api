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


// db.result('DELETE FROM $1~ WHERE todo = $2 RETURNING *', ["todos", "Something to do"], r=>r.rows).then((data) => {
//     console.log(JSON.stringify(data, undefined,2));
//     pgp.end();
// }).catch((e) => {
//     console.log(e);
//     pgp.end();
// });