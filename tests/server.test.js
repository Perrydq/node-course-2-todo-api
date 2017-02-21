const expect = require('expect');
const request = require('supertest');


const {app} = require('./../server/server.js');
const toDo = require('./../server/models/todo.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');



describe('POST /todos', () => {
    before(populateUsers);
    before(populateTodos);
    it('should create a new todo', (done)=>{
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({todo: text})
            .expect(200)
            .expect(res => {
                expect(res.body.todo).toBe(text);
            })
            .end((err, res) => {
                if(err){
                return done(err);
                }
                toDo.getAllToDos().then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[todos.length-1].todo).toBe(text);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                toDo.getAllToDos().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch(e => done(e));
            });
    });
});
describe('GET /todos', () => {
    it('should get all todos', (done)=> {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo object', (done) => {
        request(app)
        .get(`/todos/${todos[0].id}`)
        .expect(200)
        .expect((res)=> {
            expect(res.body.todo.todo).toBe(todos[0].todo);
        }).end(done);
    });

    it('should return a 404 if todo not found', (done)=> {
        request(app)
        .get(`/todos/4023`)
        .expect(404)
        .end(done);
    });

    it('should return a 404 for non-valid IDs', (done) => {
        request(app)
        .get(`/todos/jfds98jfdsa`)
        .expect(404)
        .end(done);
    })
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        // request(app)
        //     .get('/users/me')
        //     .set('x-auth')
    });

    it('should return a 401 if not authenticated', (done) => {

    });
});