const mysql = require('mysql');

const connection = mysql.createConnection({
host : '127.0.0.1',
user : 'developer',
password: 'PruebaBot22',
database : 'mirmiseolyrics'

})
module.exports = connection;
