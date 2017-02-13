const express = require('express');
const bodyParser = require('body-parser');

const {db, pgp} = require('./db/postgres.js');
const toDo = require('./models/todo.js');
const user = require('./models/user.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body);
    toDo.newToDo(req.body.todo)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
    toDo.getAllToDos()
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
        toDo.getToDoById(id)
        .then((todo) => {
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
        toDo.deleteToDo(id)
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

// app.get('/deleteAllToDos', (req, res) => {
//     toDo.deleteAllToDos()
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

// toDo.newToDo('something new to do!');

// user.addUser('shadow44@gmail.com');
