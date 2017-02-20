const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

// bcrypt.genSalt(10,(err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// });

var hashedPasssword = '$2a$10$4rXhdcLDf60bqFp2hY1UEuLy0x8R8mMv4FzoNrkpmPB8vluQ6eZvC';

bcrypt.compare(password, hashedPasssword, (err, res) => {
    console.log(res);
});


// var data = {
//     id: 10
// };


// var token = jwt.sign(data, '123abc'); // second parameter is salt
// console.log(token);


// var decoded = jwt.verify(token, '123abc');
// console.log(`decoded: ${JSON.stringify(decoded)}`);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString(),
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data).toString());

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash){
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Don\'t trust');
// }