module.exports = function (inquirer, connection, cTable) {

  purchase = (products) => {

    customerTable(products);

    const productArray = [];
    for (var i = 0; i < products.length; i++) {
      productArray.push(products[i].product_name);
    };

    inquirer.prompt([
      {
        type: 'list',
        name: 'productName',
        message: "Which item do you want to purchase?",
        choices: productArray
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How of this item do you want?',
        validate: (input) => {
          if (!isNaN(input)) {
            return true
          }
          console.log(': please enter valid a numer');
          return false;
        }
      }
    ]).then(answers => {
      inStock(products, answers);
    });
  },

    inStock = (products, answers) => {
      for (var i = 0; i < products.length; i++) {
        if (products[i].product_name === answers.productName) {
          if (answers.quantity < products[i].stock_quantity) {
            console.log('The item you selected is instock.')
            return makePurchase(products[i], answers.quantity)
          }
          console.log("Sorry, we are out of stock for that item! :-( ");
          // return purchase(products)
          return anotherPurchase();
        }
      }
    },

    makePurchase = (product, quantity) => {

      const newQuantity = product.stock_quantity - quantity;
      const productName = product.product_name;
      const salesPrice = parseFloat(product.price * quantity).toFixed(2);

      connection.query("UPDATE products SET stock_quantity = ?, product_sales = (product_sales + ?) WHERE product_name = ?", [newQuantity, salesPrice, productName], function (err, res) {
        if (err) throw err;
        console.log(`Quantity: ${quantity} of Item: ${productName}, Amount: ${salesPrice} has been added to your cart`);
        anotherPurchase();
      });
    },

    anotherPurchase = () => {
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'newPurchase',
          message: "Add more to cart?",
        }
      ]).then(answers => {
        if (answers.newPurchase) {
          connection.query('SELECT * from products', function (err, res) {
            if (err) throw err;
            purchase(res);
          });
        } else {
          console.log('Thanks for shopping! Come back to see us again!');
          openShop();
        }
      });
    },

    customerTable = (products) => {
      const filteredProducts = [];

      for (var i = 0; i < products.length; i++) {
        let newObj = {
          id: products[i].item_id,
          name: products[i].product_name,
          department: products[i].department_name,
          price: products[i].price,
          stock: products[i].stock_quantity,
        }
        filteredProducts.push(newObj);
      };
      console.table(filteredProducts);
    }
};