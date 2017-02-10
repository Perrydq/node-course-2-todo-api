const {db, pgp} = require('../db/postgres.js');
const sql = require('../sql/sql.js');

const newToDo = (todo) => {
    return new Promise((resolve, reject) => {
        db.tx((t) => {
        return t.batch([
            t.query(sql.createToDoTable),
            t.query(sql.newToDo, {todoText: todo})
        ]);
    }).then(data => {
        pgp.end();
        resolve({
            id: data[1][0].id,
            todo: data[1][0].todo,
            completed: data[1][0].completed,
            completedat: data[1][0].completedat
        });
    })
    .catch((e) => {
        pgp.end();
        reject(e) 
    });
});
};

const getAllToDos = () => {
    return new Promise((resolve, reject) => {
        db.manyOrNone(sql.getAllToDos)
        .then(data => {
            pgp.end();
            resolve(data); //array of ToDo objects
        })
        .catch(err => {
            pgp.end();
            reject(err);
        });
    });
};

const deleteToDos = () => {
    return new Promise((resolve, reject) => {
        db.none(sql.deleteToDos)
        .then(() => {
            pgp.end();
            resolve('ToDos Deleted');
        })
        .catch((e) => {
            pgp.end();
            reject(e);
        });
    });
};

module.exports = {
    newToDo,
    getAllToDos,
    deleteToDos
}