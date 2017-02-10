const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server/server.js');
const toDo = require('./../server/models/todo.js');

beforeEach((done) => {
    toDo.deleteToDos()
    .then(() => done())
    .catch(e => console.log(e));
});

describe('POST /todos', () => {
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
                    expect(todos.length).toBe(1);
                    expect(todos[0].todo).toBe(text);
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch(e => done(e));
            })
    })
});

