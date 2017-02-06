const pgp = require('pg-promise')();
const sql = require('./sql.js');
const connection = require('./dbconnection.js');

// console.log(connection);

const db = pgp(connection);

var tableParameters = {
    tableName: 'todos',
    columnOneName: 'todo',
    columnTwoName: 'completed',
    columnThreeName: 'id'
};
// var result = db.query(query, values, qrm);

db.query('SELECT * FROM $1~ WHERE name=$2', ["Users", "Perry Quinn"]).then((data) => {
    console.log(JSON.stringify(data, undefined, 2));
    pgp.end();
}).catch((error) => {
    console.log(error);
    pgp.end();
});





// db.query('CREATE TABLE Todos(todo text NOT NULL,completed boolean default false)').then(message => console.log(message)).catch(error => console.log(error));
//  db.query(sql.createToDoTable, tableParameters).then((message) => {
//         console.log(message);
//      }).then(() => { 
//             db.query('INSERT INTO ${tableName~}(${columnOneName~}, ${columnTwoName~}) VALUES(${thingToDo}, ${completed})', {
//             tableName: 'todos',
//             columnOneName: 'todo',
//             columnTwoName: 'completed',
//             thingToDo: 'Something to do',
//             completed: 'false'
//             }).then((result)=> {
//                 console.log(result);
//                 pgp.end();
//             });
//         }).catch((error) => {
//             console.log(error)
//             pgp.end();
//         });

//insert a new doc into Users collection (name, age, locaiton)

// db.query(sql.createUsersTable).then((message) => {
//     console.log('Users TABLE created', message);
// }).then(() => {
//     db.query(sql.addUser, {
//     tableName: 'Users',
//     columnOneName: 'name',
//     columnTwoName: 'age',
//     columnThreeName: 'location',
//     age: 29,
//     name: 'Perry Quinn',
//     location: 'Portland Oregon'
//     }).then((data) => {
//         console.log(JSON.stringify(data[0], undefined, 2));
//     })
// })
// .catch((e) => {
//     console.log(e);
// });


// db.query('INSERT INTO ${tableName~}(${columnOneName~}, ${columnTwoName~}) VALUES(${thingToDo}, ${completed})', {
//     tableName: 'ToDos',
//     columnOneName: 'todo',
//     columnTwoName: 'completed',
//     thingToDo: 'Something to do',
//     completed: 'false'
// }).then((result)=> {
//     console.log(result);
// }).catch((error) => {
//     console.log(error.error);
// });
