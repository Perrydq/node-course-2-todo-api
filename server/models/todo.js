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

const insertArrayofToDo = (todos) => {
    return new Promise((resolve,reject) => {
        db.tx((t) => {
            let batch = [];
            todos.forEach((todo) => {
                batch.push(t.query(sql.newToDo, {todoText: todo.todo}))
            });
            return t.batch(batch);
        }).then((data => {
            pgp.end();
            let newtodos = [];
            data[1].forEach(todo => {
                newtodos.push({
                    id: todo.id,
                    todo: todo.todo,
                    completed: todo.completed,
                    completedat: todo.completedat
                });
            });
            resolve({newtodos});
        }))
        .catch(e => {
            pgp.end();
            reject(e);
        });
    });
}

const getAllToDos = () => {
    return new Promise((resolve, reject) => {
        db.manyOrNone(sql.getAllToDos)
        .then(todos => {
            pgp.end();
            resolve(todos); //array of ToDo objects
        })
        .catch(err => {
            pgp.end();
            reject(err);
        });
    });
};

const getToDoById = (toDoId) => {
    return new Promise((resolve, reject) => {
        db.oneOrNone(sql.getToDoById, {toDoId})
        .then(todo => {
            pgp.end();
            resolve(todo);
        })
        .catch(err => {
            pgp.end();
            reject(err);
        });
    });
};

const deleteAllToDos = () => {
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

const deleteToDo = (toDoId) => {
    return new Promise((resolve, reject) => {
        db.oneOrNone(sql.deleteToDo, {toDoId})
        .then((data) => {
            pgp.end();
            resolve(data);
        })
        .catch((e) => {
            pgp.end();
            reject(e);
        });
    });
}

const completeToDo = (toDoId) => {
    return new Promise((resolve, reject) => {
        db.oneOrNone(sql.completeToDo, {toDoId})
        .then((todo) => {
            pgp.end();
            resolve(todo);
        })
        .catch((e) => {
            pgp.end();
            reject(e);
        })
    });
}

const updateToDo = (todo) => {
    return new Promise((resolve, reject) => {
        db.query(sql.updateToDo, todo)
        .then((todo) => {
            pgp.end();
            resolve(todo[0]);
        })
        .catch(e => {
            pgp.end();
            console.log(e);
            reject(e);
        })
    });
}

module.exports = {
    newToDo,
    getAllToDos,
    getToDoById,
    deleteAllToDos,
    insertArrayofToDo,
    deleteToDo, 
    completeToDo,
    updateToDo
}