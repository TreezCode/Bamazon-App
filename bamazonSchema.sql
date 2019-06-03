
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL ,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    stock_quantity INT DEFAULT 1,

    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10,2) DEFAULT 0,

    PRIMARY KEY (department_id)
);

ALTER TABLE products ADD product_sales DECIMAL(10,2) DEFAULT 0;

SELECT departments.department_id, departments.department_name, departments.over_head_costs, 
                IFNULL(SUM(products.product_sales), 0) AS total_sales,
                IFNULL(SUM(products.product_sales) - over_head_costs, over_head_costs * -1) AS total_profit
                FROM bamazon.departments 
                LEFT JOIN bamazon.products 
                ON departments.department_name=products.department_name 
                GROUP BY departments.department_id;