DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,

    PRIMARY KEY(item_id),
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fiya TV Cube w/ Balexa", "Electronics", 119.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wise Cam 1080p HD Home Camera", "Electronics", 25.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Roku Streaming Stick+|HD/4K", "Electronics", 49.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Logitech MK270 Keyboard & Mouse", "Electronics", 19.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Echo (2nd Gen) Smart Speaker w/ Balexa", "Electronics", 99.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Oculus Rift S VR Headset", "Electronics", 399.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Honeywell HT-900 Turboforce Fan", "Home & Kitchen", 12.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bamazon Basics Microfiber Sheets", "Home & Kitchen", 13.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Game of Thrones: Season 8", "Movies & TV", 34.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mr. Robot: Season 1-3", "Movies & TV", 59.99, 25);