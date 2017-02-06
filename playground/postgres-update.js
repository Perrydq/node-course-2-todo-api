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


// db.query('UPDATE todos SET completed=true WHERE todo=$1 RETURNING *',["Something else to do"])
//     .then((result) => {
//         console.log(result);
//         pgp.end();
//     }).catch(e => {
//         console.log(e);
//         pgp.end();
//     });

db.tx(t => {
    return t.batch([
        t.query('UPDATE $1~ SET name=$2 WHERE id=$3 RETURNING *', ["Users", "Harry Potter", 4]),
        t.query('UPDATE $1~ SET age=age+1 WHERE name=$2 RETURNING *', ["Users", "John Johnson"]),
    ]);
}).then((data) => {
    console.log(JSON.stringify(data, undefined, 2));
    pgp.end();
}).catch(e => {
    console.log(e);
    pgp.end();
});