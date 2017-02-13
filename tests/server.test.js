const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server/server.js');
const toDo = require('./../server/models/todo.js');

const todos = [
    {todo: 'first test todo'},
    {todo: 'second test todo'}
];



describe('POST /todos', () => {
    beforeEach((done) => {
        toDo.deleteToDos()
        .then(() => {
            toDo.insertArrayofToDo(todos);
        })
        .then(() => done())
        .catch(e => done(e));
    });
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
                    expect(todos.length).toBe(2);
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
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
    it()
});
    //doesn't work as I use serial ID's not insertable objectID's via mongoDB
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
        requeset(app)
        .get(`/todos/478923674806723`)
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