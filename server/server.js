const express = require('express');
const bodyParser = require('body-parser');

const {db, pgp} = require('./db/postgres.js');
const toDo = require('./models/todo.js');
const user = require('./models/user.js');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body);
    toDo.newToDo(req.body.todo)
    .then((data) => {
        res.send(data)
    })
    .catch((e) => {
        res.send(e);
    })
});

// GET /todos/:id


app.listen(3000, () => {
    console.log('Started on port 3000');
});

// toDo.newToDo('something new to do!');

// user.addUser('shadow44@gmail.com');
