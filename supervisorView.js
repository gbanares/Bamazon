module.exports = function (inquirer, connection, cTable) {

  supervisorView = () => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'storeView',
          message: "What action would you like to perform?",
          choices: ["View sales by department", "Add new department", "Remove department", "Exit"]
        }
      ])
      .then(answers => {

        switch (answers.storeView) {
          case 'View sales by department':
            console.log('View sales by department');
            salesByDept();
            break;
          case 'Add new department':
            console.log('Add new department');
            addDepartment();
            break;
          case 'Remove department':
            console.log('Add new department');
            removeDepartment();
            break;
          case 'Exit':
            console.log('Thanks for stopping by!');
            openShop();
        }
      });
  }

  // function to do a complex table join to see the total sales by department
  salesByDept = () => {
    var queryString = "SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.product_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id";
    connection.query(queryString, function (err, res) {
      if (err) throw err;
      console.table(res);
      newAction();
    })
  }

  // function to add a department to the departments table
  addDepartment = () => {

    departmentArray = [];

    connection.query("SELECT * FROM departments", function (err, res) {
      if (err) throw err;
      console.table(res);
      for (var i = 0; i < res.length; i++) {
        departmentArray.push(res[i].department_name.toLowerCase());
      }

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'department',
            message: "What department would you like to add?",
            validate: (input) => {
              if (departmentArray.includes(input.toLowerCase())) {
                console.log(": department already exists");
                return false;
              }
              return true;
            }
          },
          {
            type: 'input',
            name: 'overhead',
            message: "What is the overhead costs of this department?",
            validate: (input) => {
              var price = /^\d+(?:[.,]\d+)*$/;
              if (price.test(input)) {
                return true
              }
              console.log(': must be a valid price ($$.$$)');
              return false;
            }
          }
        ])
        .then(answers => {
          connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)", [answers.department, answers.overhead], function (err, res) {
            if (err) throw err;
            console.log("\nNew department successfully added!\n");
            newAction();
          });
        });

    });
  }

  // removes a department for the table
  removeDepartment = () => {

    let idArray = [];
    connection.query("SELECT * FROM departments", (err, res) => {
      if (err) throw err;
      console.table(res);

      for (var i = 0; i < res.length; i++) {
        idArray.push(res[i].department_id);
      }

      inquirer.prompt([
        {
          type: "input",
          name: "id",
          message: "Select the ID for the department you would like to delete.",
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
          for (var i = 0; i < res.length; i++) {
            if (res[i].department_id === parseInt(answers.id)) {
              connection.query("DELETE FROM departments WHERE department_id = ?", [answers.id], function (err, res) {
                if (err) throw err;
                console.log('\nProduct successfully removed!\n');
                newAction();
              });
            }
          }
        } else {
          newAction();
        }
      });
    });
  }

  // redirects user back to supervisor options, or back to store page
  newAction = () => {
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'anotherAction',
        message: "What you like to perform another action?"
      }
    ]).then(answers => {
      if (answers.anotherAction) {
        supervisorView()
      } else {
        console.log('\nthanks for coming by!\n');
        openShop();
      }
    });
  }
}