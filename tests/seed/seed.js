const {app} = require('./../../server/server.js');
const toDo = require('./../../server/models/todo.js');
const _user = require('./../../server/models/user.js');

const users = [
    {email: 'andrew@example.com', password: 'user1pass'},
    {email: 'perry@example.com', password: 'user2pass'}
];

var todos = [
    {todo: 'first test todo'},
    {todo: 'second test todo'}
];

const populateUsers = (done) => {
    _user.deleteAllUsers().then(() => {
        var userOne = new _user.UserSchema(users[0]).save();
        var userTwo = new _user.UserSchema(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => {done()});
}

const populateTodos = (done) => {
    toDo.deleteAllToDos()
        .then(() => {
            toDo.insertArrayofToDo(todos);
        })
        .then(() => done())
        .catch(e => done(e));
};

module.exports = {
    populateTodos,
    todos,
    populateUsers,
    users
}