DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
  item_id INT
  AUTO_INCREMENT NOT NULL,
  product_name VARCHAR
  (45) NOT NULL,
  product_sales DECIMAL
  (10,2) DEFAULT 0,
  department_name VARCHAR
  (45) NOT NULL,
  price DECIMAL
  (10,2) NOT NULL,
  stock_quantity INT
  (10) NOT NULL,
  primary key
  (item_id)
);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Body Lotion", "Beauty and Personal Care", 14.95, 100),
    ("Bar Soap", "Beauty and Personal Care", 1.50, 100),
    ("Toothpaste", "Beauty and Personal Care", 4.50, 100),
    ("Round Boar Hair Brush", "Beauty and Personal Care", 85.00, 100),
    ("Travel Stuff Sack", "Clothing and Accessories", 60.00, 200),
    ("Dishwashing Liquid", "Household", 6.50, 300),
    ("Staub Mini Cocotte", "Home and Kitchen", 75.00, 400),
    ("Unisex Sunglasses", "Clothing and Accessories", 99.50, 200),
    ("Bowler Hat", "Clothing and Accessories", 60.00, 200),
    ("Jenga", "Entertainment and Games", 14.95, 500);

  SELECT *
  FROM products;


  CREATE TABLE departments
  (
    department_id INT
    AUTO_INCREMENT NOT NULL,
  department_name VARCHAR
    (45) NOT NULL,
  over_head_costs DECIMAL
    (10,2) NOT NULL,
  primary key
    (department_id)
);

    INSERT INTO departments
      (department_name, over_head_costs)
    VALUES
      ("Beauty and Personal Care", 100),
      ("Clothing and Accessories", 100),
      ("Household", 50),
      ("Home and Kitchen", 50),
      ("Entertainment and Games", 50);

    SELECT *
    FROM departments;
