// File sql.js

// Proper way to organize an sql provider:
//
// - have all sql files for Users in ./sql/users
// - have all sql files for Products in ./sql/products
// - have your sql provider module as ./sql/index.js

var QueryFile = require('pg-promise').QueryFile;
var path = require('path');

// Helper for linking to external query files:
function sql(file) {
    var fullPath = path.join(`${__dirname}/`, file); // generating full path;
    return new QueryFile(fullPath, {minify: true});
}


module.exports.createToDoTable = sql('./createToDoTable.sql');
module.exports.newToDo = sql('./newToDo.sql');
module.exports.getAllToDos = sql('./getAllToDos.sql');
module.exports.deleteToDos = sql('./deleteToDos.sql');
module.exports.getToDoById = sql('./getToDoById.sql');

module.exports.createUsersTable = sql('./createUserTable.sql');
module.exports.newUser = sql('./newUser.sql');


    // example external queries for Users:
//     users: {
//         add: ,
//         search: sql('users/search.sql'),
//         report: sql('users/report.sql'),
//     },
//     // external queries for Products:
//     products: {
//         add: sql('products/add.sql'),
//         quote: sql('products/quote.sql'),
//         search: sql('products/search.sql'),
//     }
// };