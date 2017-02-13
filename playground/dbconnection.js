
const connection = process.env.DATABASE_URL || {
    server: 'localhost',
    port: 5432,
    database: 'TodoApp',
    user: 'Encode2',
    password: '1'
}

module.exports = {
    connection
};