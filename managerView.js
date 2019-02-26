module.exports = function (inquirer, connection, cTable) {

  managerView = () => {
    let products;
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      products = res;
    });

    inquirer.prompt([
      {
        type: 'list',
        name: 'options',
        message: "What would you like to do?",
        choices: ["Check stock", "Check low stock", "Add to stock", "Add new product", "Delete a product", "Back to shop"]
      }
    ]).then(answers => {
      switch (answers.options) {
        case 'Check stock':
          viewProducts(products);
          break;
        case 'Check low stock':
          viewLowInventory();
          break;
        case 'Add to stock':
          addInventory(products);
          break;
        case 'Add new product':
          addProduct()
          break;
        case 'Delete a product':
          deleteProduct(products)
          break;
        case 'Back to shop':
          openShop();
          break;
      }
    });
  }

  viewProducts = (products) => {
    console.table(products);
    anotherAction();
  }

  // stock less than 10
  viewLowInventory = () => {
    console.log('\nFinding products with stock less than 10...\n')
    connection.query("SELECT * FROM products WHERE (inventory_quantity < 10)", function (err, res) {
      if (err) throw err;
      console.table(res);
      anotherAction();
    });
  }

  // add stock per item
  addInventory = (products) => {
    console.table(products);
    productsArray = [];
    for (var i = 0; i < products.length; i++) {
      productsArray.push(products[i].product_name);
    }
    inquirer.prompt([
      {
        type: 'list',
        name: 'product',
        message: "Which product would you like to add stock to?",
        choices: productsArray
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How much stock would you like to add?',
        validate: (input) => {
          if (!isNaN(input) && input < 5000) {
            return true
          } else if (input > 5000) {
            console.log(': we dont have room for that much stock :(');
            return false;
          }
          console.log(': must input valid a numer');
          return false;
        }
      }
    ]).then(answers => {
      connection.query("UPDATE products SET inventory_quantity=(inventory_quantity+ ?) WHERE product_name = ?", [answers.quantity, answers.product], function (err, res) {
        if (err) throw err;
        console.log(`\nCongrats! \nYou just increased the stock of ${answers.product} by ${answers.quantity} units!\n`);
        anotherAction(products);
      });
    });
  }

  // add a new product
  addProduct = () => {

    departmentArray = [];

    connection.query("SELECT * FROM departments", function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        departmentArray.push(res[i].department_name);
      }
    });

    inquirer.prompt([
      {
        type: 'input',
        name: 'productName',
        message: 'What new product would you like to add?'
      },
      {
        type: 'input',
        name: 'price',
        message: 'how much will this new product go for?',
        validate: (input) => {
          var price = /^\d+(?:[.,]\d+)*$/;
          if (price.test(input)) {
            return true
          }
          console.log(': must be a valid price ($$.$$)');
          return false;
        }
      },
      {
        type: 'list',
        name: 'department',
        message: 'What department will this new product be sold in?',
        choices: departmentArray
      },
      {
        type: 'input',
        name: 'stock',
        message: 'how will the beginning stock be?',
        validate: (input) => {
          if (!isNaN(input) && input < 5000) {
            return true
          } else if (input > 5000) {
            console.log(': We dont have room for that much in the store :(');
            return false;
          }
          console.log(': must input valid a numer');
          return false;
        }
      }
    ]).then((answers) => {
      let vals = [answers.productName, answers.department, answers.price, answers.stock];
      connection.query("INSERT INTO products (product_name, department_name, price, inventory_quantity) VALUES (?, ?, ?, ?)", vals, function (err, res) {
        if (err) throw err;
        console.log("\nNew product successfully added!\n");
        anotherAction();
      });
    });
  }

  // delete a product
  deleteProduct = (products) => {
    console.table(products);

    let idArray = [];
    for (var i = 0; i < products.length; i++) {
      idArray.push(products[i].item_id);
    }

    inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "Select the ID for the product you would like to delete.",
        validate: (input) => {
          if (!isNaN(input) && idArray.includes(parseInt(input))) {
            return true;
          }
          console.log(': Please select a valid ID');
        }
      },
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to delete this product?",
      }
    ]).then((answers) => {
      if (answers.confirm) {
        for (var i = 0; i < products.length; i++) {
          if (products[i].item_id === parseInt(answers.id)) {
            connection.query("DELETE FROM products WHERE item_id = ?", [answers.id], function (err, res) {
              if (err) throw err;
              console.log('\nProduct successfully removed!\n');
              anotherAction();
            });
          }
        }
      } else {
        anotherAction();
      }
    });
  }

  anotherAction = () => {
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'anotherAction',
        message: "What you like to perform another action?"
      }
    ]).then(answers => {
      if (answers.anotherAction) {
        managerView()
      } else {
        console.log('\nthanks for coming by!\n');
        openShop();
      }
    });
  }

}