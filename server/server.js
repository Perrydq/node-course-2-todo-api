const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {db, pgp} = require('./db/postgres.js');
const _toDo = require('./models/todo.js');
const _user = require('./models/user.js');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

_user.init().then((message) => {
    console.log(message);
    _toDo.init()
    .then((message) => {
        console.log(message);
    })
    .catch(e => {
        console.log(e);
        die();
    })
});


app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body);
    _toDo.newToDo(req.body.todo)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
    _toDo.getAllToDos()
    .then(todos => {
        res.status(200).send({todos});
    })
    .catch(e => {
        res.status(400).send(e);
    })
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(Number.isInteger(+id)){
        _toDo.getToDoById(id)
        .then((todo) => {
            if(!todo) res.status(404).send('To Do Not Found'); // if null reject
            res.status(200).send(todo);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send();
        });
    } else {
        res.status(404).send('Invalid ID');
    }
});

app.delete('/todos/:id', (req, res) => {
    //get id/
    const id = req.params.id;
    //validata id if not valid return 404
    if(Number.isInteger(+id)){
        //remove todo by ID
        //success
            //if no response data 404
            //if response print todo
        _toDo.deleteToDo(id)
        .then((todo) => {
            todo ? res.status(200).send(todo) : res.status(404).send('no todo to delete');
        })
        .catch((e) => {
            res.status(400).send();
        });
    } else {
        res.status(404).send('Invalid ID');
    }
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['todo', 'completed']);
    if(Number.isInteger(+id)){
        //remove todo by ID
        //success
            //if no response data 404
            //if response print todo
        const updatedToDo = {
                toDoText: body.todo,
                toDoId: id
            }
        if(_.isBoolean(body.completed) && body.completed && body.todo){
            //update todo text and set completed status to true
            //send as object with properties _toDoText and _toDoId

            _toDo.updateToDo(updatedToDo)
            .then(todo => {
                _toDo.completeToDo(id)
                .then(todo => {
                res.status(200).send(todo);
                })
                .catch(e => res.status(400).send(e));
            })
            .catch(e => res.status(400).send(e));
        } else if(_.isBoolean(body.completed) && body.completed) {
            //set completed status only
            _toDo.completeToDo(id)
            .then(todo => {
                res.status(200).send(todo);
            })
            .catch(e => res.status(400).send(e));
        } else if(body.todo) {
            //update todo text only
            _toDo.updateToDo(updatedToDo)
            .then(todo => {
                res.status(200).send(todo);
            })
            .catch(e => res.status(404).send(e));
        } else {
            res.status(404).send('No to do\'s updated');
        }
    } else {
        res.status(404).send('Invalid ID');
    }

});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users', (req, res) => {
    var newUser = new _user.UserSchema(_.pick(req.body.user, ['email', 'password']));
    newUser.saveNew()
    .then((createdUser) => {
        res.status(200)
        .header('x-auth', createdUser.getAuthToken())
        .send(newUser.toJSON());
    })
    .catch(e => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    _user.findByEmail(_.pick(req.body.user, ['email', 'password']))
        .then((user) => {
            user = new _user.UserSchema(user);
            res.status(200)
            .header('x-auth', user.getAuthToken())
            .send(user.toJSON());
        }).catch(e => {
            switch(e){
                case 'Incorrect Password': res.status(401).send(e);
                    break;
                case 'No User Found': res.status(401).send(e);
                    break;
                default: console.log(e);
                         res.status(400).send();
            }
        })  
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

// app.get('/deleteAllToDos', (req, res) => {
//     _toDo.deleteAllToDos()
//     .then(message => {
//         res.status(200).send(message);
//     })
//     .catch(e => {
//         res.status(400).send(e);
//     });
// });

app.listen(3000, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}