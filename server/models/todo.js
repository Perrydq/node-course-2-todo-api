const {db, pgp} = require('../db/postgres.js');
const sql = require('../sql/sql.js');

const newToDo = (todo, user) => {
    return new Promise((resolve, reject) => {
        db.one(sql.newToDo, {todoText: todo, creator: user.id})
        .then(data => {
        pgp.end();
        resolve({
            id: data.id,
            todo: data.todo,
            completed: data.completed,
            completedat: data.completedat,
            creator: data.creator
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
                    completedat: todo.completedat,
                    creator: data.creator
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

const getAllToDos = (user) => {
    return new Promise((resolve, reject) => {
        db.manyOrNone(sql.getAllToDos, {creator: user.id})
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

const getToDoById = (toDoId, user) => {
    return new Promise((resolve, reject) => {
        db.oneOrNone(sql.getToDoById, {toDoId, creator: user.id})
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
        db.none(sql.deleteAllToDos)
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

const deleteToDo = (toDoId, user) => {
    return new Promise((resolve, reject) => {
        db.oneOrNone(sql.deleteToDo, {toDoId, creator: user.id})
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

const completeToDo = (toDoId, user) => {
    return new Promise((resolve, reject) => {
        db.oneOrNone(sql.completeToDo, {toDoId: toDoId, creator: user.id})
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

const updateToDo = (todo, user) => {
    return new Promise((resolve, reject) => {
        db.query(sql.updateToDo, {toDoText: todo.toDoText, toDoId: todo.toDoId, creator: user.id})
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

const init = () => {
    return new Promise((resolve, reject) => {
        db.query(sql.createToDoTable).then(()=> {
            pgp.end();
            resolve('ToDo Database initialized or already present');
        }).catch(e => {
            reject(e);
        })
    })
}

module.exports = {
    newToDo,
    getAllToDos,
    getToDoById,
    deleteAllToDos,
    insertArrayofToDo,
    deleteToDo, 
    completeToDo,
    updateToDo,
    init
}