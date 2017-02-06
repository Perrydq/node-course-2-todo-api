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
    var fullPath = path.join(__dirname, file); // generating full path;
    return new QueryFile(fullPath, {minify: true});
}

module.exports.createToDoTable = sql('createToDoTable.sql');
module.exports.addToDo = sql('addToDo.sql');
module.exports.listToDo = sql('listToDo.sql');
module.exports.createUsersTable = sql('createUsersTable.sql');
module.exports.addUser = sql('addUser.sql');


    // external queries for Users:

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