require('dotenv').config();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'bamazon'
});

connection.connect(function (err) {
  if (err) {
    console.log('Something went wrong with the connection :(')
    throw err
  };
  console.log("connected as id " + connection.threadId);
});

module.exports = connection;