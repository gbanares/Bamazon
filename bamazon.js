const inquirer = require('inquirer');
const cTable = require('console.table');

// connect to mysql db
const connection = require("./connection.js");

require('./customerView.js')(inquirer, connection, cTable);
require('./managerView.js')(inquirer, connection, cTable);
require('./supervisorView.js')(inquirer, connection, cTable);

openShop = () => {
  connection.query('SELECT * from products', function (err, res) {
    if (err) throw err;
    bamazonOptions(res);
  });
}

bamazonOptions = products => {
  console.log('Greetings! Are you ready to get your Bamazon on?');
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'storeView',
        message: "Are you a Customer, Manager or Supervisor? Or do you want to Exit?",
        choices: ['Customer', "Manager", "Supervisor", "Exit"]
      }
    ])
    .then(answers => {

      switch (answers.storeView) {
        case 'Customer':
          console.log('Customer View ------------------------------------------------------');
          purchase(products);
          break;
        case 'Manager':
          console.log('Manager View -----------------------------------------------------');
          managerView();
          break;
        case 'Supervisor':
          console.log('Supervisor View -----------------------------------------------------');
          supervisorView();
          break;
        case 'Exit':
          console.log('\nThanks for stopping by!\n');
          connection.end();
      }
    });
}

openShop();