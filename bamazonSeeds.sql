
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL ,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,

    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Fiya TV Cube w/ Balexa", "Electronics", 119.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Wise Cam 1080p HD Home Camera", "Electronics", 25.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Roku Streaming Stick+|HD/4K", "Electronics", 49.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Logitech MK270 Keyboard & Mouse", "Electronics", 19.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Echo (2nd Gen) Smart Speaker w/ Balexa", "Electronics", 99.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Oculus Rift S VR Headset", "Electronics", 399.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Honeywell HT-900 Turboforce Fan", "Home & Kitchen", 12.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Bamazon Basics Microfiber Sheets", "Home & Kitchen", 13.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Game of Thrones: Season 8", "Movies & TV", 34.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Mr. Robot: Season 1-3", "Movies & TV", 59.99, 25);

ALTER TABLE products ADD COLUMN product_sales DECIMAL(10,2) NOT NULL;


CREATE TABLE departments (
    department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
    VALUES ("Electronics", 10000);

INSERT INTO departments (department_name, over_head_costs)
    VALUES ("Home & Kitchen", 5000);

INSERT INTO departments (department_name, over_head_costs)
    VALUES ("Movies & TV", 8000);

INSERT INTO departments (department_name, over_head_costs)
    VALUES ("Office", 4000);

